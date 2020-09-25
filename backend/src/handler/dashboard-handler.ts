import { BaseHandler } from './base-handler'; 
import { APIGatewayEvent, APIGatewayProxyResult,Context } from 'aws-lambda'; 
import { DashboardService } from '../service/dashboard';

export class DashboardHandler extends BaseHandler{
    
    handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
        return await this.common_handler(event,context,new DashboardService());
    }

}
let handler = new DashboardHandler().handler;
export { handler };