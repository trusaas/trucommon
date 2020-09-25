'use strict';
import { TruAppConstants, TruData,TruServerMessages,TruUtil, VerifySessionResult } from '../../utils';
import { BaseService } from '../base-service';
import { APIGatewayProxyResult } from 'aws-lambda';
import { User,Account,UserAccount,UserToken } from '../../model';
 
export class VerificationService extends BaseService{

    constructor(){
        super();
    }
    
    handler = async (trd: TruData):Promise<APIGatewayProxyResult> => { 
        switch(trd.event.pathParameters?.path){
            case 'verify-email':
                return await this.verify_email(trd);
            case 'verify-session':
                return await this.verify_session(trd);
        } 
        return TruUtil.AwsAPIGatewayProxyResult(404, false, TruServerMessages.ApiNotFound);   

    };
    verify_email = async (trd: TruData):Promise<APIGatewayProxyResult> => { 
        if (TruUtil.dataBlankForAny(trd.postData.appId,trd.postData.confirmationToken)) {
            return TruUtil.AwsAPIGatewayProxyResult(200, false, TruServerMessages.MandatoryFieldsMissing);
        }
        let transaction;
        let status: boolean = true;
        let message: string | null = null;
        let user: any = null;
        let account: any = null;
        let userAccount: any = null;
        user = await User.findOne({ where: { confirmationToken: trd.postData.confirmationToken } });
        if (user == null) {
            status = false;
        } else {
            user = user.dataValues;
            account = await Account.findOne({ where: { appId: trd.postData.appId } });
            if (account == null) {
                status = false;
            } else {
                account = account.dataValues;
                userAccount = await UserAccount.findOne({ where: { userId: user.id, accountId: account.id } });
                if (userAccount == null) {
                    status = false;
                } else {
                    userAccount = userAccount.dataValues;
                    try {
                        // get transaction
                        transaction = await trd.sequelize.transaction();
                        if (user.status === TruAppConstants.Status.ConfirmationPending) {
                            await User.update(<User>{
                                confirmedAt: new Date(),
                                updatedAt: new Date(),
                                status: TruAppConstants.Status.Active
                            }, { where: { id: user.id }, transaction: transaction });
                        }
                        if (account.status === TruAppConstants.Status.ConfirmationPending) {
                            await Account.update(<Account>{
                                updatedAt: new Date(),
                                status: TruAppConstants.Status.Active
                            }, { where: { id: account.id }, transaction: transaction });
                        }
                        if (userAccount.status === TruAppConstants.Status.ConfirmationPending) {
                            await UserAccount.update(<UserAccount>{
                                updatedAt: new Date(),
                                status: TruAppConstants.Status.Active
                            }, { where: { accountId: account.id, userId: user.id }, transaction: transaction });
                        }
                        await transaction.commit();
                    } catch (e) {
                        TruUtil.error(e);
                        message = TruServerMessages.InternalServerError;
                        status = false;
                        if (transaction) await transaction.rollback();
                    }
                }
            }
        }
        if (!status) {
            message = TruServerMessages.Confirmation.InvalidData;
        } else {
            message = TruServerMessages.Confirmation.SuccessfullyConfirmed;
        }
        return TruUtil.AwsAPIGatewayProxyResult(200, status, message,{email:user?.email,appId:trd.postData.appId});
    
    }
    verify_session = async (trd: TruData):Promise<APIGatewayProxyResult> => { 
        delete trd.session.id;
        delete trd.session.user.dataValues.id;
        delete trd.session.user.dataValues.confirmationToken;
        delete trd.session.user.dataValues.confirmationSentAt;
        trd.session.userAccounts.forEach( (x:any) => {
            delete x.account.dataValues.id;        
        });
        return TruUtil.AwsAPIGatewayProxyResult(200,true,null,trd.session);
    }

    static check = async (trd: TruData) =>  {
        let vsr:VerifySessionResult = {res:null,session:null};
        if(!trd.token || trd.token===null || trd.token.trim()===''){
            vsr.res = TruUtil.AwsAPIGatewayProxyResult(401,true); 
            return vsr;
        }
        vsr.session = await UserToken.verifySession(trd.meta,trd.token);
        if(vsr.session===null){
            vsr.res = TruUtil.AwsAPIGatewayProxyResult(401,true);  
        }else{
            if(vsr.session.status && vsr.session.status === 'Active'){
                let userAccount:any|null = vsr.session.userAccounts.find( (i:any) => i.account.appId === trd.getData.appId);
                if(!userAccount) {
                    vsr.res = TruUtil.AwsAPIGatewayProxyResult(403,true); 
                }else{
                    vsr.session.selectedUserAccount=userAccount;
                    let curDate=new Date();
                    let lastAccessed=new Date(vsr.session.lastAccessedOn);
                    if(!(curDate.getFullYear()=== lastAccessed.getFullYear()
                        && curDate.getMonth() === lastAccessed.getMonth()
                        && curDate.getDate() === lastAccessed.getDate())){
                        UserToken.update(<UserToken>{lastAccessedOn:new Date()},{where:{id: vsr.session.id}})
                    }
                }
            }else{
                vsr.res = TruUtil.AwsAPIGatewayProxyResult(401,true); 
            }
        } 
        return vsr;
    };
}