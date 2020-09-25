import { BaseHandler } from './base-handler'; 
import { APIGatewayEvent, APIGatewayProxyResult,Context } from 'aws-lambda'; 
import { AccountService } from '../service/account';

export class AccountHandler extends BaseHandler{
    
    handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
        return await this.common_handler(event,context,new AccountService());
    }

}
let handler = new AccountHandler().handler;
export { handler };