import { APIGatewayProxyResult } from 'aws-lambda';
import { TruData } from '../utils/tru-interfaces';

export abstract class BaseService { 
    protected trd: TruData | null;
    abstract async handler (trd: TruData):Promise<APIGatewayProxyResult>;
}