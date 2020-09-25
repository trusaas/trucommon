'use strict';
import { TruData,TruUtil,TruServerMessages, TruAppConstants } from '../../utils';
import { User, UserToken } from '../../model';
import { BaseService } from '../base-service';
import { APIGatewayProxyResult } from 'aws-lambda';
 
export class SigninService extends BaseService{

    constructor(){
        super();
    }
    
    handler = async (trd: TruData):Promise<APIGatewayProxyResult> => { 

        if (TruUtil.dataBlankForAny(trd.postData.email,trd.postData.password)) {
            return TruUtil.AwsAPIGatewayProxyResult(200, false, TruServerMessages.MandatoryFieldsMissing);
        }
        if (!TruUtil.validEmail(trd.postData.email)) {
            return TruUtil.AwsAPIGatewayProxyResult(200, false, TruServerMessages.InvalidEmail);
        }
        trd.token=null;
        let user:any = await SigninService.signin(trd,trd.postData.email,trd.postData.password)
        if (user === undefined || user === null) {
            return TruUtil.AwsAPIGatewayProxyResult(200, false, TruServerMessages.Singin.InvalidData);
        } else {
            return TruUtil.AwsAPIGatewayProxyResult(200, true, TruServerMessages.Singin.SuccessfullySiginin, user);       
        }

    };

    static signin = async (trd:TruData,email: string,password?: string) =>{
        let whereCond:any = {email:email};
        if(password){
            whereCond.password=TruUtil.getHash(TruUtil.decode(password));
        } 
        whereCond[TruUtil.Op.and]=[TruUtil.Sequelize.literal(`
         \`userAccounts\`.\`role\` = '${TruUtil.makeQueryPramVal(TruAppConstants.Role.AccountAdmin)}' OR
        (\`userAccounts\`.\`role\` = '${TruUtil.makeQueryPramVal(TruAppConstants.Role.Operator)}'   AND 
         \`userAccounts\`.\`status\` <> '${TruUtil.makeQueryPramVal(TruAppConstants.Status.ConfirmationPending)}'
        )` )];       
        let user: any = await User.findOne({
            attributes: ['id', 'name', 'email', 'status'],
            include: [{
                association: 'userAccounts', required: true,
                attributes: ['role', 'status'],
                include: [{
                    association: 'account', required: true,
                    attributes: ['name', 'appId']                    
                }]
            }],
            where: whereCond,
            order:[['userAccounts','role','asc']]
        });
        if (user === undefined || user === null) {
            return null;
        }else{
            user = user.dataValues;
            let id:number = user.id;
            delete user.id; 
            if(trd.token===null){
                trd.token=TruUtil.getJwt({"name":user.name,"email":user.email,"status":user.status});
                await UserToken.create(<UserToken>{
                    lastAccessedOn: new Date(),
                    status: TruAppConstants.Status.Active,
                    userId: id, token: trd.token, ip: trd.meta.ip,
                    os: trd.meta.os, browser: trd.meta.browser
                });
            }
            user.token = trd.token;
            user.userAccounts = user.userAccounts;
            return user;
        }
    }
}