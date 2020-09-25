import { HttpClientService } from "../utils/http-client.service";
import { StorageService } from "../utils/storage.service";
import { Router } from "@angular/router";
import { MessageService } from "../utils/message.service";
import { BehaviorSubject } from "rxjs";
import { TruAppSvcUtil } from '../tru-app-svc-util';

export class Account {

  constructor(private http: HttpClientService,
    private storageSvc: StorageService,
    private router: Router,
    private messageSvc: MessageService,
    private appId: BehaviorSubject<string> | null,
    private session: any) { }

    createAccount(params: any) {
      params.globalLoader=false;
      return this.http.post(TruAppSvcUtil.getAccountSvcUrl('save',this.appId), params);
    }
    updateAccount(params: any) {
      return this.http.patch(TruAppSvcUtil.getAccountSvcUrl('update',this.appId), params);
    }

}
