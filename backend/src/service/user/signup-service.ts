'use strict';
import { TruData,TruUtil,TruServerMessages,TruAppConstants } from '../../utils';
import { User,Account,UserAccount } from '../../model';
import { BaseService } from '../base-service';
import { APIGatewayProxyResult } from 'aws-lambda';
import { SigninService } from './signin-service';
 
export class SignupService extends BaseService{

    constructor(){
        super();
    }
    
    handler = async (trd: TruData):Promise<APIGatewayProxyResult> => { 

        if (TruUtil.dataBlankForAny(trd.postData.account,trd.postData.email,trd.postData.password,
            trd.postData.name)) {
            return TruUtil.AwsAPIGatewayProxyResult(200, false, TruServerMessages.MandatoryFieldsMissing);
        }
        if (!TruUtil.validEmail(trd.postData.email)) {
            return TruUtil.AwsAPIGatewayProxyResult(200, false, TruServerMessages.InvalidEmail);
        }
        // Assigning auto generated appId
        let user: any = await User.findOne({ where: { email: trd.postData.email } });
        if (user != null && user.password) {
            return TruUtil.AwsAPIGatewayProxyResult(200, false, TruServerMessages.Account.UserAlreadyExists);
        } 
        let account: any = await Account.findOne({ where: { name: trd.postData.account } });
        if (account != null) return TruUtil.AwsAPIGatewayProxyResult(200, false, TruServerMessages.Account.AccountAlreadyExists);
        let transaction;
        let status: boolean = true;
        let message: string | null = null;
        try {
            // get transaction
            transaction = await trd.sequelize.transaction();
            const transactionObj = { transaction: transaction };
            if (user === null) {
                user = await User.create(<User>trd.postData, transactionObj);
            }else{ 
                user.confirmationToken=TruUtil.uuidV1();
                await User.update(<User>{
                    name:trd.postData.name, 
                    password: TruUtil.getHash(TruUtil.decode(user.password)),
                    confirmationToken: user.confirmationToken,
                    confirmationSentAt: new Date(),
                    status: TruAppConstants.Status.ConfirmationPending
                }, { where: { id: user.id }, transaction: transaction });
            }
            user = user.dataValues;
            user.name=trd.postData.name;
            trd.postData.name = trd.postData.account;
            let account: any = await Account.create(<Account>trd.postData, transactionObj);
            account = account.dataValues;
            trd.postData.userId = user.id;
            trd.postData.accountId = account.id;
            trd.postData.role = TruAppConstants.Role.AccountAdmin;
            await UserAccount.create(<UserAccount>trd.postData, transactionObj);
            try {
                trd.trusender.sendEmail(process.env.TRU_SENDER_TOKEN, 'confirmed_signup_emailer',
                    user.email, { 'name': user.name, 'confirmation_link': process.env.APP_URL + 'confirmation/' + account.appId + '/' + user.confirmationToken },
                    (result: any) => {
                        TruUtil.log(result);
                    });
                message = TruServerMessages.Account.CreatedSuccessfully;
            } catch (e) {
                TruUtil.error(e);
                message = TruServerMessages.Account.CreatedSuccessfully + '(Trusender Error)';
            }
            await transaction.commit();
    
        } catch (e) {
            TruUtil.error(e);
            message = TruServerMessages.InternalServerError;
            status = false;
            if (transaction) await transaction.rollback();
        }
        trd.token=null;
        return TruUtil.AwsAPIGatewayProxyResult(200, status, message, await SigninService.signin(trd,user.email));

    };
}

/*
SET FOREIGN_KEY_CHECKS=0;
use truresponse;
TRUNCATE user_account;
TRUNCATE account;
TRUNCATE user;
TRUNCATE user_token;
SET FOREIGN_KEY_CHECKS=1;
*/