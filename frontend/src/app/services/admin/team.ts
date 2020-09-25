import { HttpClientService } from "../utils/http-client.service";
import { StorageService } from "../utils/storage.service";
import { Router } from "@angular/router";
import { MessageService } from "../utils/message.service";
import { BehaviorSubject } from "rxjs";
import { TruAppSvcUtil } from '../tru-app-svc-util';

export class Team {

  constructor(private http: HttpClientService,
    private storageSvc: StorageService,
    private router: Router,
    private messageSvc: MessageService,
    private appId: BehaviorSubject<string> | null,
    private session: any) { }

    inviteTeammates(emails:string[],globalLoader?:boolean){
      if(!globalLoader) globalLoader=false;
      return this.http.post(TruAppSvcUtil.getTeamSvcUrl('invite',this.appId), {emails:emails,globalLoader:globalLoader});
    }
    inviteInfo(params: any) {
      if(!params?.globalLoader)params.globalLoader=false;
      return this.http.post(TruAppSvcUtil.getTeamSvcUrl('invite-info',this.appId), params);
    }
    acceptInvite(params: any) {
      if(!params?.globalLoader)params.globalLoader=false;
      return this.http.post(TruAppSvcUtil.getTeamSvcUrl('accept-invite',this.appId), params);
    }

}
