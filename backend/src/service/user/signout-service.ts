'use strict';
import { TruData,TruUtil,TruServerMessages, TruAppConstants } from '../../utils';
import { UserToken } from '../../model';
import { BaseService } from '../base-service';
import { APIGatewayProxyResult } from 'aws-lambda';
 
export class SignoutService extends BaseService{

    constructor(){
        super();
    }
    
    handler = async (trd: TruData):Promise<APIGatewayProxyResult> => { 

        UserToken.update({ status: TruAppConstants.Status.InActive , 
                           lastAccessedOn: new Date()},
                           { where: { token: trd.token } });
        return TruUtil.AwsAPIGatewayProxyResult(200, true, TruServerMessages.SuccessfullySignedOut);

    };
}