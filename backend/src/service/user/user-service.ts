'use strict';
import { TruData,TruServerMessages,TruUtil } from '../../utils';
import { BaseService } from '../base-service';
import { APIGatewayProxyResult } from 'aws-lambda';
import { User } from '../../model';
 
export class UserService extends BaseService{

    constructor(){
        super();
    }
    
    handler = async (trd: TruData):Promise<APIGatewayProxyResult> => { 

        if(trd.event.pathParameters?.path==='resend-confirmation'){
            return await this.resend_confirmation(trd);
        }else if(trd.event.pathParameters?.path==='change-email'){
            return await this.change_email(trd);
        }

        return TruUtil.AwsAPIGatewayProxyResult(404, false, TruServerMessages.ApiNotFound);   
    

    };
    resend_confirmation = async (trd: TruData):Promise<APIGatewayProxyResult> => { 
        let message:string|null=null;
        try {
            let user=trd.session.user;
            trd.trusender.sendEmail(process.env.TRU_SENDER_TOKEN, 'confirmed_signup_emailer',
                user.email, { 'name': user.name, 'confirmation_link': process.env.APP_URL + 'confirmation/' + trd.getData.appId + '/' + user.confirmationToken },
                (result: any) => {
                    TruUtil.log(result);
                });
                message = TruServerMessages.Account.ConfirmationSentSuccessfully;
        } catch (e) {
            TruUtil.error(e);
            message = TruServerMessages.Account.ConfirmationSentSuccessfully + '(Trusender Error)';
        }    
        return TruUtil.AwsAPIGatewayProxyResult(200,true,message);
    }
    change_email = async (trd: TruData):Promise<APIGatewayProxyResult> => { 
        if (TruUtil.dataBlankForAny(trd.postData.email)) {
            return TruUtil.AwsAPIGatewayProxyResult(200, false, TruServerMessages.MandatoryFieldsMissing);
        }
        if (!TruUtil.validEmail(trd.postData.email)) {
            return TruUtil.AwsAPIGatewayProxyResult(200, false, TruServerMessages.InvalidEmail);
        }  
        let user: any = await User.findOne({ where: { email: trd.postData.email,id:{[TruUtil.Op.ne]: trd.session.user.id}}});
        if (user != null) {
            return TruUtil.AwsAPIGatewayProxyResult(200, false, TruServerMessages.Account.UserAlreadyExists);
        } else{ 
            if(trd.session.user.email!==trd.postData.email){
                trd.session.user.confirmationToken=TruUtil.uuidV1();
                trd.session.user.confirmationSentAt=new Date();
            }
            await User.update(<User>{email:trd.postData.email,
                                     confirmationToken:trd.session.user.confirmationToken,
                                     confirmationSentAt:trd.session.user.confirmationSentAt
                                    },{where:{id:trd.session.user.id}});
            let message:string|null=null;
            try {
                trd.trusender.sendEmail(process.env.TRU_SENDER_TOKEN, 'confirmed_signup_emailer',
                trd.postData.email, { 'name': trd.session.user.name, 'confirmation_link': process.env.APP_URL + 'confirmation/' + trd.getData.appId + '/' + trd.session.user.confirmationToken },
                    (result: any) => {
                        TruUtil.log(result);
                    });
                    message = TruServerMessages.Account.EmailUpdatedAndConfirmationSentSuccessfully;
            } catch (e) {
                TruUtil.error(e);
                message = TruServerMessages.Account.EmailUpdatedAndConfirmationSentSuccessfully + '(Trusender Error)';
            } 
            return TruUtil.AwsAPIGatewayProxyResult(200,true,message);
        }
    }
}