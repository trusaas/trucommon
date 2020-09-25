import { BaseHandler, HTTP_METHODS } from './base-handler'; 
import { APIGatewayEvent, APIGatewayProxyResult,Context } from 'aws-lambda';  
import { TeamService } from '../service/team';

export class TeamHandler extends BaseHandler{
    
    handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
        switch(event.pathParameters?.path){
            case 'invite-info':
                return await this.common_handler(event,context,new TeamService(),false);
            case 'accept-invite':
                    return await this.common_handler(event,context,new TeamService(),false);                
            default:
                return await this.common_handler(event,context,new TeamService());
        }
        //return await this.common_handler(event,context);
    }
    
}
let handler = new TeamHandler().handler;
export { handler };