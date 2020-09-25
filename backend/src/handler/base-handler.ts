'use strict';

import { TruUtil } from '../utils/tru-util';
import { TruData, TruRequestMeta, VerifySessionResult } from '../utils/tru-interfaces';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { TruSequelize } from '../sequelize';
import { Sequelize } from 'sequelize';
import { TruServerMessages } from '../utils/tru-server-messages';  
import { BaseService } from '../service/base-service';
import { VerificationService } from '../service/user';

const trusender = require('@trusender/trusender-node/index');
const globalObj: any = {};

const GetConnection = (): Sequelize => {
    // If 'sequelize' doesn't exist
    if (globalObj.sequelize === undefined || globalObj.sequelize === null) {
        // Init sequelize
        globalObj.sequelize = TruSequelize.Init();
    }
    return <Sequelize>globalObj.sequelize;
}

export abstract class BaseHandler { 

    HTTP_METHODS=HTTP_METHODS;

    common_handler = async (event: APIGatewayEvent, context: Context,
        service?:BaseService,checkSession?:boolean): Promise<APIGatewayProxyResult> => {
        if(checkSession==undefined) checkSession=true; 
        if (service === undefined) {
            return TruUtil.AwsAPIGatewayProxyResult(404, false, TruServerMessages.ApiNotFound);
        } else {
            let authorization: string | null = event.headers.Authorization;
            let token = authorization === undefined || authorization === null ? null: authorization.replace('Bearer ','');
            try {
                let postData:any = null; 
                if (event.body != null) try { postData = JSON.parse(event.body); } catch (e) { TruUtil.log(e); }
                let trd = <TruData>{
                    token: token,
                    postData: postData,
                    getData: event.queryStringParameters,
                    sequelize: GetConnection()!, 
                    trusender: trusender,
                    method:event.httpMethod,
                    pathParameters: event.pathParameters,
                    event:event,
                    context:context,
                    meta: <TruRequestMeta>{
                        ip: event.requestContext.identity.sourceIp,
                        agent: event.requestContext.identity.userAgent,
                        os: null,
                        browser: null
                    }
                }; 
                if(checkSession){
                    let vsr:VerifySessionResult = await VerificationService.check(trd);
                    if(vsr.res!=null){
                        return vsr.res;
                    }else{
                        trd.session=vsr.session;
                    }
                }
                return await service.handler(trd);
            } catch (e) {
                TruUtil.error(e);
                return TruUtil.AwsAPIGatewayProxyResult(200, false, TruServerMessages.InternalServerError, e);
            }
        }
    }
}

export const HTTP_METHODS=Object.freeze({POST:'POST',PUT:'PUT',PATCH:'PATCH',GET:'GET',DELETE:'DELETE',OPTIONS:'OPTIONS'});