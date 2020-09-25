import { BaseHandler } from './base-handler'; 
import { APIGatewayEvent, APIGatewayProxyResult,Context } from 'aws-lambda'; 
import { SigninService,SignupService,SignoutService, PasswordService, UserService, VerificationService } from '../service/user';

export class UserHandler extends BaseHandler{
    
    handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
        if(event.httpMethod===this.HTTP_METHODS.POST){
            switch(event.pathParameters?.path){
                case 'signin':
                    return await this.common_handler(event,context,new SigninService(),false);
                case 'signup':
                    return await this.common_handler(event,context,new SignupService(),false);
                case 'password':{
                    if(event.queryStringParameters?.action==='change')
                        return await this.common_handler(event,context,new PasswordService());   
                    else
                        return await this.common_handler(event,context,new PasswordService(),false); 
                }case 'change-email':
                    return await this.common_handler(event,context,new UserService());  
                case 'verify-email': 
                    return await this.common_handler(event,context,new VerificationService(),false);                   
                
            }
        }else if(event.httpMethod===this.HTTP_METHODS.GET){
            switch(event.pathParameters?.path){
                case 'signout':
                    return await this.common_handler(event,context,new SignoutService(),false);                
                case 'resend-confirmation':
                    return await this.common_handler(event,context,new UserService());  
                case 'verify-session': 
                    return await this.common_handler(event,context,new VerificationService());                   
            }
        } 
        return await this.common_handler(event,context);
    }

}
let handler = new UserHandler().handler;
export { handler };