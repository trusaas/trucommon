import { HttpClientService } from "../utils/http-client.service";
import { StorageService } from "../utils/storage.service";
import { Router } from "@angular/router";
import { MessageService } from "../utils/message.service";
import { BehaviorSubject } from "rxjs";
import { HttpParams } from "@angular/common/http";
import { TruAppSvcUtil } from '../tru-app-svc-util';
import { TruUtils } from "../../shared/utils/tru-utils";
import { TruAppService } from '../tru-app.service';

export class User {

  constructor(private http: HttpClientService,
    private storageSvc: StorageService,
    private router: Router,
    private messageSvc:MessageService,
    private appId:BehaviorSubject<string>|null,
    private session:any) {}

    signin(params: any) {
      return this.http.post(TruAppSvcUtil.getUserSvcUrl('signin',this.appId), params);
    }
    signup(params: any) {
      return this.http.post(TruAppSvcUtil.getUserSvcUrl('signup',this.appId), params);
    }
    requestPassword(params: any) {
      params.globalLoader=false;
      return this.http.post(TruAppSvcUtil.getUserSvcUrl('password?action=request',this.appId), params);
    }
    validatePasswordRequest(params: any) {
      params.globalLoader=false;
      return this.http.post(TruAppSvcUtil.getUserSvcUrl('password?action=request-validate',this.appId), params);
    }
    resetPassword(params: any) {
      if(!params?.globalLoader)params.globalLoader=false;
      return this.http.post(TruAppSvcUtil.getUserSvcUrl('password?action=reset',this.appId), params);
    }
    changePassword(params: any) {
      if(!params?.globalLoader)params.globalLoader=false;
      return this.http.post(TruAppSvcUtil.getUserSvcUrl('password?action=change',this.appId), params);
    }
    chnageMail(params: any) {
      params.globalLoader=false;
      return this.http.post(TruAppSvcUtil.getUserSvcUrl('change-email',this.appId), params);
    }

    resendConfirmation() {
      let params = new HttpParams();//.append('globalLoader','false');
      return this.http.get(TruAppSvcUtil.getUserSvcUrl('resend-confirmation',this.appId), {params});
    }


    confirmation(params: any) {
      params.globalLoader=false;
      return this.http.post(TruAppSvcUtil.getUserSvcUrl('verify-email',this.appId), params);
    }
    signout(truAppSvc:TruAppService,silent?:boolean,callback?:Function) {
      if(!silent || silent===null) silent=false;
      this.http.get(TruAppSvcUtil.getUserSvcUrl('signout',this.appId)).subscribe((res) => {
        truAppSvc.clearSession();
        if(!silent){
          this.messageSvc.success(res.message);
          this.router.navigate(['/']);
        }
        if(callback) callback();
      }, (err) => {
        truAppSvc.clearSession();
        if(!silent){
          this.messageSvc.success('Successfully signed out.');
          this.router.navigate(['/']);
        }
        if(callback) callback();
      });
    }
    verifySession(updateSessionStore:boolean,truAppSvc:TruAppService,callback?:Function){
      let params = new HttpParams().append('globalLoader', `false`);
      this.http.get(TruAppSvcUtil.getUserSvcUrl('verify-session',this.appId),{params}).subscribe((res) => {
        if(res.success)
          if(updateSessionStore){
            let latestSessionData=res.data.user;
            latestSessionData.token=res.data.token;
            latestSessionData.userAccounts=res.data.userAccounts;
            truAppSvc.setSession(latestSessionData);
          }
          if(callback) callback();
      }, (err)=>{  TruAppSvcUtil.httpErr(err); if(callback) callback(); });
    }


}
