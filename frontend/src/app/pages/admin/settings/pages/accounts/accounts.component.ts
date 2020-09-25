import { Component, OnInit } from '@angular/core';
import { TruAppService } from 'src/app/services/tru-app.service';
import { BreadcrumbService } from 'src/app/services/utils/breadcrumb.service';
import { MenuItem, TruMenuConstancts } from 'src/app/shared/utils/tru-menu';
import { SettingsComponent } from '../../settings.component';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {

  constructor(private svc:TruAppService,
    private breadcrumbSvc:BreadcrumbService) {
    let curMenu:MenuItem={...TruMenuConstancts.ACCOUNTS};
    curMenu.path=TruMenuConstancts.SETTING.code;
    breadcrumbSvc.location=[TruMenuConstancts.SETTING,curMenu];
    breadcrumbSvc.page=curMenu;
  }

  ngOnInit(): void {
    SettingsComponent.setSecondMenu(this.svc);
  }

}
