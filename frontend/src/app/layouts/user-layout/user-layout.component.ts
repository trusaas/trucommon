import { Component, OnInit } from '@angular/core';
import { TruMenuConstancts,MenuItem } from 'src/app/shared/utils/tru-menu';
import { TruAppService } from 'src/app/services/tru-app.service';
@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.scss']
})
export class UserLayoutComponent implements OnInit {

  features:MenuItem=TruMenuConstancts.FEATURES;
  pricing:MenuItem=TruMenuConstancts.PRICING;
  help:MenuItem=TruMenuConstancts.HELP;
  signin:MenuItem=TruMenuConstancts.SIGININ;
  my_account:MenuItem=TruMenuConstancts.MYACCOUNT;

  signup:MenuItem=TruMenuConstancts.SIGINUP;

  constructor(public svc:TruAppService) { }

  ngOnInit(): void {
    this.svc.seoSvc.updateTitle('Truresponse');
  }

}
