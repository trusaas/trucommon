'use strict';
import { TruData,TruUtil,TruServerMessages, TruAppConstants, VerifySessionResult } from '../../utils'; 
import { BaseService } from '../base-service';
import { APIGatewayProxyResult } from 'aws-lambda';
import { HTTP_METHODS } from '../../handler/base-handler'; 
import { Account,UserAccount,User } from '../../model';
import { SigninService, VerificationService } from '../user';
 
export class TeamService extends BaseService{

    constructor(){
        super();
    }
    
    handler = async (trd: TruData):Promise<APIGatewayProxyResult> => { 
        if(trd.method===HTTP_METHODS.POST){
            switch(trd.pathParameters?.path){
                case 'invite': // Invite and re-invite both serving by this 
                    return await this.invite(trd);
                case 'invite-info':
                    return await this.invite_info(trd);
                case 'accept-invite':
                    return await this.accept_invite(trd);
                case 'discord-invitation':
                    return await this.discord_invitation(trd);                    
                case 'list':
                    return await this.list(trd);       
            }
        }
        return TruUtil.AwsAPIGatewayProxyResult(404, false, TruServerMessages.ApiNotFound);   
    };
 
    invite = async (trd: TruData):Promise<APIGatewayProxyResult> => { 
        let message:string|null=null;
        if (!trd.postData.emails || !Array.isArray(trd.postData.emails) || trd.postData.emails.length==0) {
            return TruUtil.AwsAPIGatewayProxyResult(200, false, TruServerMessages.MandatoryFieldsMissing);
        }
        if (!TruUtil.validEmail(trd.postData.emails)) {
            return TruUtil.AwsAPIGatewayProxyResult(200, false, TruServerMessages.InvalidEmail);
        }
        //let account: any = await Account.findOne({ where: { appId: trd.getData.appId } });
        let account:any = trd.session.selectedUserAccount.account;
        //let forRes:any =await trd.postData.emails.forEach(async (x:string) => {
        //https://www.coreycleary.me/why-does-async-await-in-a-foreach-not-actually-await/
        for(const x of trd.postData.emails){
            let user: any = await User.findOne({ where: { email: x } });
            let userAccount:any= null;
            let sendInvite=true;
            if(user!==null){
                userAccount=await UserAccount.findOne({where:{accountId:account.id,userId:user.id}});
                if(userAccount!=null){
                    if(userAccount.status!==TruAppConstants.Status.ConfirmationPending){
                        sendInvite=false;
                    }
                }
            }
            if(user === null){
                user = await User.create(<User>{email:x});
            }
            if(userAccount === null){
                userAccount = await UserAccount.create(<UserAccount>
                    {userId:user.id,
                     accountId:account.id,
                     role : TruAppConstants.Role.Operator
                    });
            }
            if(sendInvite){ 
                try {
                    let appUrl=process.env.APP_URL;
                    if(trd.postData.appUrl) appUrl = trd.postData.appUrl;
                    trd.trusender.sendEmail(process.env.TRU_SENDER_TOKEN, 'team_member_invitation',
                        user.email, { 'name': account.name, 'invitation_link': appUrl + 'invitation/' + account.appId + '/' + user.uniqueId },
                        (result: any) => {
                            TruUtil.log(result);
                        });
                    message = TruServerMessages.Team.InvitationSentSuccessfully;
                } catch (e) {
                    TruUtil.error(e);
                    message = TruServerMessages.Team.InvitationSentSuccessfully + '(Trusender Error)';
                }            
            }
        }
        return TruUtil.AwsAPIGatewayProxyResult(200,true,message);
    }
    invite_info = async (trd: TruData):Promise<APIGatewayProxyResult> => { 
        let status: boolean = true; 
        let user: any = await User.findOne({ where: { uniqueId: trd.postData.uniqueId } });
        let account: any = null;
        let userAccount: any = null;
        let resData:any|null=null; 
        if (user == null) {
            status = false;
        } else {
            user = user.dataValues;
            account = await Account.findOne({ where: { appId: trd.postData.appId } });
            if (account == null) {
                status = false;
            } else {
                account = account.dataValues;
                userAccount = await UserAccount.findOne({ where: { userId: user.id, accountId: account.id } });
                if (userAccount == null) {
                    status = false;
                } else {
                    userAccount = userAccount.dataValues; 
                    resData={user:{name:user.name,email:user.email,password:user.password!==null,status:user.status},
                             account:{name:account.name,appId:account.appId},
                             userAccount:{role:userAccount.role,status:userAccount.status}};
                }
            }
        }
        return TruUtil.AwsAPIGatewayProxyResult(200, status, null,resData);
    }
    accept_invite = async (trd: TruData):Promise<APIGatewayProxyResult> => { 
        let status:boolean=true;
        let user:any= await User.findOne({ where: { uniqueId: trd.postData.uniqueId } });
        if (user == null) status=false;//user not exists for given unique id
        else user = user.dataValues;
        let account: any = null;
        let userAccount: any = null; 
        let message:string|null=null;
        let password:string|null=null;
        if(TruUtil.dataBlankForAll(trd.postData.password,trd.postData.confirmPassword)){
        //Accepting using session
            let vsr:VerifySessionResult = await VerificationService.check(trd);
            trd.session=vsr.session;
            if(trd.session===null){
                status=false;//session not exists
                message=TruServerMessages.InvalidSession;
            }else if(user.email!==trd.session.user.email){
                status=false;//user not belongs to given session
                message=TruServerMessages.InvalidData;
            }
        }else if(user.password!==null){
        //Accepting existing user
            if (TruUtil.dataBlankForAny(trd.postData.password)) {
                status=false;
                message=TruServerMessages.MandatoryFieldsMissing;
            }
            password=TruUtil.getHash(TruUtil.decode(trd.postData.password));
            if(password!==user.password){
                status=false;
                message=TruServerMessages.InvalidData;
            }
        }else if(user.password===null){
        //Accepting new user        
            if (TruUtil.dataBlankForAny(trd.postData.name,
                trd.postData.password,trd.postData.confirmPassword)) {
                status=false;
                message=TruServerMessages.MandatoryFieldsMissing;
            }
            if(trd.postData.password!=trd.postData.confirmPassword){
                status=false;
                message=TruServerMessages.Singin.PasswordConfirmPasswordNotSame;
            }
            user.password=TruUtil.getHash(TruUtil.decode(trd.postData.password));
            user.name=trd.postData.name; 
        }
        if(status){
            account = await Account.findOne({ where: { appId: trd.postData.appId } });
            if (account == null) {
                status = false;
            } else {
                account = account.dataValues;
                userAccount = await UserAccount.findOne({ where: { userId: user.id, accountId: account.id } });
                if (userAccount == null) {
                    status = false;
                } else {
                    userAccount = userAccount.dataValues;  
                }
            }
        }
        if(!status){
            return TruUtil.AwsAPIGatewayProxyResult(200,false,message);
        }else{
            if(user.status === TruAppConstants.Status.ConfirmationPending){
                user.confirmedAt=new Date();
                user.status = TruAppConstants.Status.Active;
            }
            if(userAccount.status===TruAppConstants.Status.ConfirmationPending){
                userAccount.status = TruAppConstants.Status.Active;
            }
            await User.update(user,{where:{id:user.id}});
            await UserAccount.update(userAccount,{where:{userId:userAccount.userId,accountId:userAccount.accountId}});
            return TruUtil.AwsAPIGatewayProxyResult(200,true,TruServerMessages.Team.InvitationAcceptedSuccessfully,await SigninService.signin(trd,user.email));
        }
    }   
    discord_invitation = async (trd: TruData):Promise<APIGatewayProxyResult> => { 
        return TruUtil.AwsAPIGatewayProxyResult(200);
    }    
    list = async (trd: TruData):Promise<APIGatewayProxyResult> => { 
        let whereCond:any ={},userWhereCond:any ={};
        if(trd.getData?.action ==='teammates'){
            whereCond.status={[TruUtil.Op.ne]:TruAppConstants.Status.ConfirmationPending};
        }else{
            whereCond.status=TruAppConstants.Status.ConfirmationPending;
        }
        if(trd.postData?.customFilter &&  trd.postData?.customFilter?.email && trd.postData.customFilter?.email?.value){
            //whereCond.status={[Op.ne]:TruAppConstants.Status.ConfirmationPending};
            let emailVal=trd.postData?.customFilter?.email?.value?.trim();
            if(emailVal!==''){
                userWhereCond.email={[TruUtil.Op.like]:'%'+emailVal+'%'};
            }
        }
        let sortOrder:any=[];
        if(trd.postData?.sortField){
            sortOrder=trd.postData?.sortField.split('\.');
            sortOrder.push(trd.postData?.sortOrder);
            sortOrder=[sortOrder];
        } else{
            sortOrder = [['updatedAt','desc']];
        }
        UserAccount.findAndCountAll
        let resData:any = await UserAccount.findAndCountAll({
                attributes: ['role', 'status', 'createdAt', 'updatedAt'],
                include: [
                            {
                                association: 'account', required: true,
                                attributes: ['name', 'status'],
                                where:{appId:trd.getData.appId}
                            },
                            {
                                association: 'user', required: true,
                                attributes: ['name', 'email', 'status'],
                                where:userWhereCond
                            }
                        ],
                order: sortOrder,
                where:whereCond,
                limit: +trd.postData.pageSize,
                offset: (+trd.postData.pageIndex-1)*(+trd.postData.pageSize)
            }).catch(err=>{
                return err;
            }); 
        if(resData && resData.name && resData.name==='SequelizeDatabaseError') {
            throw resData;
        }else{
            resData.pageIndex=trd.postData.pageIndex;
        }
        return TruUtil.AwsAPIGatewayProxyResult(200,true,null,resData);
    }                
}