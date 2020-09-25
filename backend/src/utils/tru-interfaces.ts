import { Sequelize } from 'sequelize';
import { APIGatewayEvent, APIGatewayProxyResult,Context } from "aws-lambda"; 
export interface TruData {
    token: string | null;
    postData: any;
    getData: any;
    pathParameters: any;
    event:APIGatewayEvent;
    context:Context;
    sequelize: Sequelize;
    meta: TruRequestMeta;
    trusender: any;
    method:string;
    session:any | null;
}
export interface VerifySessionResult {
    res: APIGatewayProxyResult | null;
    session: any | null;
}
export interface TruRequestMeta {
    ip: string;
    agent: string;
    os: string | null;
    browser: string | null;
}