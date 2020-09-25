'use strict';
import { TruData,TruServerMessages,TruUtil } from '../../utils';
import { BaseService } from '../base-service';
import { APIGatewayProxyResult } from 'aws-lambda'; 
import { User } from '../../model';
 
export class PasswordService extends BaseService{

    constructor(){
        super();
    }
    
    handler = async (trd: TruData):Promise<APIGatewayProxyResult> => { 
        switch(trd.getData?.action){
            case 'change':
                return await this.change(trd);
            case 'request':
                return await this.request(trd);
            case 'request-validate':
                return await this.request_validate(trd);
            case 'reset':
                return await this.reset(trd);

        } 
        return TruUtil.AwsAPIGatewayProxyResult(404, false, TruServerMessages.ApiNotFound);
    };

    change = async (trd: TruData):Promise<APIGatewayProxyResult> => { 
        return TruUtil.AwsAPIGatewayProxyResult(200);
    }

    request = async (trd: TruData):Promise<APIGatewayProxyResult> => { 
        if (TruUtil.dataBlankForAny(trd.postData.email)) {
            return TruUtil.AwsAPIGatewayProxyResult(200, false, TruServerMessages.MandatoryFieldsMissing);
        }
        if (!TruUtil.validEmail(trd.postData.email)) {
            return TruUtil.AwsAPIGatewayProxyResult(200, false, TruServerMessages.InvalidEmail);
        }
        let user: any = await User.findOne({ where: { email: trd.postData.email } });
        if (user != null && user.password) {
            let message:string|null=null;
            const resetPasswordToken:string=TruUtil.uuidV1();
            await User.update(<User>{
                resetPasswordToken: resetPasswordToken,
                resetPasswordSentAt: new Date()
            }, { where: { id: user.id }});
            try {
                let appUrl=process.env.APP_URL;
                if(trd.postData.appUrl) appUrl = trd.postData.appUrl;
                trd.trusender.sendEmail(process.env.TRU_SENDER_TOKEN, 'password_reset_emailer',
                    user.email, { 'name': user.name, 'password_reset_link': appUrl + 'reset-password/' +  resetPasswordToken },
                    (result: any) => {
                        TruUtil.log(result);
                    });
                message = TruServerMessages.Singin.ResetMailSent
            } catch (e) {
                TruUtil.error(e);
                message = TruServerMessages.Singin.ResetMailSent + '(Trusender Error)';
            }
            return TruUtil.AwsAPIGatewayProxyResult(200, true, message);
        } else {
            return TruUtil.AwsAPIGatewayProxyResult(200, false, TruServerMessages.Singin.UserNotExists);       
        }
    }

    request_validate = async (trd: TruData):Promise<APIGatewayProxyResult> => { 
        if (TruUtil.dataBlankForAny(trd.postData.resetPasswordToken)) {
            return TruUtil.AwsAPIGatewayProxyResult(200, false,TruServerMessages.MandatoryFieldsMissing);
        }
        let user:any=await User.findOne({where:{resetPasswordToken:trd.postData.resetPasswordToken}});
        if (user === undefined || user === null || user.resetPasswordSentAt === null) {
            return TruUtil.AwsAPIGatewayProxyResult(200, false);
        }else{
            let diffMs:number = new Date().getTime()-user.resetPasswordSentAt.getTime(); 
            let diffMin:number = diffMs/60000; 
            if(diffMin>60){
                return TruUtil.AwsAPIGatewayProxyResult(200, false);
            }else{
                return TruUtil.AwsAPIGatewayProxyResult(200,true,null,{email:user.email});
            }
        }
    }

    reset = async (trd: TruData):Promise<APIGatewayProxyResult> => { 
        if (TruUtil.dataBlankForAny(trd.postData.resetPasswordToken,
            trd.postData.password,
            trd.postData.confirmPassword)) {
            return TruUtil.AwsAPIGatewayProxyResult(200, false,TruServerMessages.MandatoryFieldsMissing);
        }
        if(trd.postData.password!=trd.postData.confirmPassword){
            return TruUtil.AwsAPIGatewayProxyResult(200, false,TruServerMessages.Singin.PasswordConfirmPasswordNotSame);
        }
        await User.update(<User>{password:TruUtil.getHash(TruUtil.decode(trd.postData.password)),
        resetPasswordToken:null,resetPasswordSentAt:null},
        {where:{resetPasswordToken:trd.postData.resetPasswordToken}})
        return TruUtil.AwsAPIGatewayProxyResult(200, true,TruServerMessages.Singin.PasswordResetSuccess);
    
    }

}
 