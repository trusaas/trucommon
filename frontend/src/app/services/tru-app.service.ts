import { HttpClientService } from './utils/http-client.service';
import { StorageService } from './utils/storage.service';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { MessageService } from './utils/message.service';
import { BehaviorSubject } from 'rxjs';
import { TruUtils } from '../shared/utils/tru-utils';
import { User } from './user/user';
import { Account } from './admin/account';
import { Team } from './admin/team';
import { Dashboard } from './admin/dashboard';
import { TruAppSvcUtil } from './tru-app-svc-util';
import { SeoService } from './seo.service';
import { TruSecondMenu } from 'src/app/shared/utils/tru-second-menu';
import { MenuItem } from '../shared/utils/tru-menu';
@Injectable({
  providedIn: 'root'
})
export class TruAppService {
  seoSvc:SeoService|null;
  session: any;
  selectedAccount:any;
  appId = new BehaviorSubject<string>(null);
  user:User;
  account:Account;
  team:Team;
  secondMenu:TruSecondMenu=new TruSecondMenu();
  dashboard :Dashboard;
  truUtils:any=TruUtils;
  constructor(private http: HttpClientService,
    public storageSvc: StorageService,
    public router: Router,
    public messageSvc:MessageService) {
      this.getSession();
      this.user=new User(http,storageSvc,router,messageSvc,this.appId,this.session);
      this.dashboard=new Dashboard(http,storageSvc,router,messageSvc,this.appId,this.session);
      this.account=new Account(http,storageSvc,router,messageSvc,this.appId,this.session);
      this.team=new Team(http,storageSvc,router,messageSvc,this.appId,this.session);
  }
  setSecondMenu(items?:MenuItem[],selected?:MenuItem){
    setTimeout(()=>{this.secondMenu=new TruSecondMenu(items,selected);});
  }
  getTableList(apiType:string,api:string,tableParams) {
    return this.http.post(TruAppSvcUtil.getSvcUrl(apiType,api,this.appId.getValue()), tableParams);
   }
  getSession() {
    this.session = this.storageSvc.getSessionItem('session', true);
    return this.session;
  }
  updateUserStatusInSession(status?:string){
    if(this.session){
      this.session.status=status;
      this.setSession(this.session);
    }
  }
  checkSession(): boolean {
    this.session = this.storageSvc.getSessionItem('session', true);
    if (this.session) return true;
    return false;
  }
  setSession(sessionObj) {
    this.session=sessionObj;
    if(this.session && this.session.email && this.session.email.trim()!='')
      this.session.avatar='//www.gravatar.com/avatar/'+TruUtils.md5.hashStr(this.session.email.trim().toLowerCase())+'?d=wavatar';
    else this.session.avatar='//www.gravatar.com/avatar/';
    this.storageSvc.setSessionItem('session', sessionObj, true);
  }
  getToken() {
    this.session = this.storageSvc.getSessionItem('session', true);
    if (this.session) return this.session.token;
  }
  clearSession() {
    this.session=null;
    this.selectedAccount=null;
    this.storageSvc.removeSessionItem('session');
  }
  setSelectedAccount(){
    this.selectedAccount = this.session.userAccounts.find( (i:any) => i.account.appId === this.appId.getValue());
  }
  handleServerErrorCodes(err:any){
    if(err.status===401){
      if(this.session!=null){
        this.clearSession();
        this.router.navigate(['/401']);
      }
    }else if(err.status === 403){
      this.router.navigate(['/403']);
    }else if(err.status === 500){
      this.router.navigate(['/500']);
    }else if(err.status === 404){
      this.messageSvc.error('API Not Found, Please contact administrator.');
    }
  }
}
