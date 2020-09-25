'use strict';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import * as uuid from 'uuid';
import { APIGatewayProxyResult } from 'aws-lambda';
import { decode,encode} from 'base-64';
import { Sequelize,Op } from "sequelize"; 
export class TruUtil {
    static Op = Op;
    static Sequelize = Sequelize;
    static log = (x: any, y?: any) => {
        if (process.env.CONSOLE_LOG! == 'true') {
            if (x != undefined && y == undefined) console.log(x);
            else if (x != undefined && y != undefined) console.log(x, y);
            else console.log('No parameters received.');
        }
    }
    static getRandomNumberBetween = (min:number,max:number) => {
        return Math.floor(Math.random()*(max-min+1)+min);
      }
    static decode = (x:string):string => {
        return decode(x);
    }
    static encode = (x:string):string => {
        return encode(x);
    }
    static error = (x: any, y?: any) => {
        if (process.env.CONSOLE_ERROR! == 'true') {
            if (x != undefined && y == undefined) console.error(x);
            else if (x != undefined && y != undefined) console.error(x, y);
            else console.error('No parameters received.');
        }
    }
    static validEmail = (emails: string[]) => {
        if (emails == undefined || emails == null || (Array.isArray(emails) && emails.length==0)) return false;
        const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        let flag:boolean=true; 
        if (!Array.isArray(emails)) emails=[emails];
        emails.forEach((x):any => { 
          if(!emailRegexp.test(x)){
            return flag=false;
          }
        });
        return flag;
    }
    static hasData = (data: string) => {
        return !TruUtil.blank(data);
    }
    static blank = (data: string) => {
        return data == undefined || data == null || data.trim() === '';
    }
    static hasDataForAll = (...data: string[]) => {
        let flag:boolean=true;
        data.forEach(x=>{
            flag=TruUtil.hasData(x);
            if(!flag) return;
        });
        return flag;
    }
    static dataBlankForAll = (...data:string[]) => {
        let flag:boolean=true;
        data.forEach(x=>{
            flag=TruUtil.blank(x);
            if(!flag) return;
        });
        return flag;
    }     
    static dataBlankForAny = (...data:string[]) => {
        let flag:boolean=false;
        data.forEach(x=>{
            flag=TruUtil.blank(x);
            if(flag) return;
        });
        return flag;
    } 
    static hasDataForAny = (...data: string[]) => {
        let flag:boolean=false;
        data.forEach(x=>{
            flag=TruUtil.hasData(x);
            if(flag) return;
        });
        return flag;
    }    
    static generateRandomString = () => {
        return require('randomstring').generate({
            length: 6,
            charset: 'alphanumeric'
        });
    }
    static getJwt = (data: any) => {
        return jwt.sign({
            data: data
        }, process.env.JWT_SECRET!, { expiresIn: '30 days' });;
    }
    static letifyJwt = (token: string) => {
        try {
            let _o: any = jwt.verify(token, process.env.JWT_SECRET!);
            return { success: true, data: _o.data };
        } catch (err) {
            // log(err);
            return { success: false, message: 'Invalid token.' }
        }
    }
    static getHash = (data: string, key?: string) => {
        if (key == undefined) key = process.env.PWD_HASH_SALT!;
        let hmac = crypto.createHmac('sha256', key);
        hmac.update(data);
        return hmac.digest('hex');
    }
    static makeQueryPramVal = (val:string):string | null => {
        if(val===null)    return null;
        else return val.replace("'","\\'");
    }
    static AwsAPIGatewayProxyResult = (code: number, status?: boolean, message?: string | null, data?: any): APIGatewayProxyResult => {
        const body: any = {};
        if (code == undefined || code == null || code == 0) code = 200;
        if (message != undefined) body.message = message;
        if (data != undefined) body.data = data;
        if (status != undefined) body.success = status; else body.success = true;
        return <APIGatewayProxyResult>{
            statusCode: code,
            isBase64Encoded:false,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Max-Age': 0
            },
            body: JSON.stringify(body)
        };
    }
    static generateSalt = () => {
        // Generate a v1 (time-based) id
        return uuid.v1() // -> '6c84fb90-12c4-11e1-840d-7b25c5ee775a'
        // Generate a v4 (random) id
        // return require('uuid').v4(); // -> '110ec58a-a0f2-4ac4-8393-c866d813b8d1'
    }
    static uuidV1 = uuid.v1;
    static uuidV3 = uuid.v3;
    static uuidV4 = uuid.v4;
    static uuidV5 = uuid.v5;
}