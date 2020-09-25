'use strict';
import { TruData,TruUtil,TruServerMessages, TruAppConstants } from '../../utils'; 
import { BaseService } from '../base-service';
import { APIGatewayProxyResult } from 'aws-lambda';
import { HTTP_METHODS } from '../../handler/base-handler';
import { Account,UserAccount } from '../../model';
 
export class AccountService extends BaseService{

    constructor(){
        super();
    }
    
    handler = async (trd: TruData):Promise<APIGatewayProxyResult> => { 
        if(trd.method=== HTTP_METHODS.POST){
            switch (trd.pathParameters?.path) {
                case 'save':
                  return await this.save(trd);
                case 'update':
                  return await this.update(trd);
                case 'list':
                  return await this.list(trd); 
            }
        }else if(trd.method=== HTTP_METHODS.GET){
            switch (trd.pathParameters?.path) {
                case 'get':
                  return await this.save(trd);
            }            
        }

        return TruUtil.AwsAPIGatewayProxyResult(404, false, TruServerMessages.ApiNotFound);   

    };
    save = async (trd: TruData):Promise<APIGatewayProxyResult> => { 
        if (TruUtil.dataBlankForAny(trd.postData.account)) {
            return TruUtil.AwsAPIGatewayProxyResult(200, false, TruServerMessages.MandatoryFieldsMissing);
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
            trd.postData.name = trd.postData.account;
            trd.postData.status = TruAppConstants.Status.Active;
            let account: any = await Account.create(<Account>trd.postData, transactionObj);
            account = account.dataValues;
            trd.postData.userId = trd.session.user.id;
            trd.postData.accountId = account.id;
            trd.postData.role = TruAppConstants.Role.AccountAdmin;
            await UserAccount.create(<UserAccount>trd.postData, transactionObj);
            await transaction.commit();
            message = TruServerMessages.Account.CreatedSuccessfully;
        } catch (e) {
            TruUtil.error(e);
            message = TruServerMessages.InternalServerError;
            status = false;
            if (transaction) await transaction.rollback();
        }
        return TruUtil.AwsAPIGatewayProxyResult(200, status, message);
    }
    update = async (trd: TruData):Promise<APIGatewayProxyResult> => { 
        return TruUtil.AwsAPIGatewayProxyResult(200);
    }
    list = async (trd: TruData):Promise<APIGatewayProxyResult> => { 
        return TruUtil.AwsAPIGatewayProxyResult(200);
    }
    get = async (trd: TruData):Promise<APIGatewayProxyResult> => { 
        return TruUtil.AwsAPIGatewayProxyResult(200);
    }            
}