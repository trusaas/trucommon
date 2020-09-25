import { HttpClientService } from "../utils/http-client.service";
import { StorageService } from "../utils/storage.service";
import { Router } from "@angular/router";
import { MessageService } from "../utils/message.service";
import { BehaviorSubject } from "rxjs";
import { HttpParams } from "@angular/common/http";
import { TruAppSvcUtil } from '../tru-app-svc-util';

export class Dashboard {

  constructor(private http: HttpClientService,
    private storageSvc: StorageService,
    private router: Router,
    private messageSvc: MessageService,
    private appId: BehaviorSubject<string> | null,
    private session: any) { }

    graphData(appId: string,type:string) {
      let params = {globalLoader:false};
      //return this.http.get(TruAppSvcUtil.getOthersSvcUrl(`graph-data`,this.appId), { params });
      return this.http.post(TruAppSvcUtil.getDashboardSvcUrl(type,this.appId), params );
    }

}
