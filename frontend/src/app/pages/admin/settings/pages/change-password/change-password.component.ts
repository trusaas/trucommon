import { Component, OnInit } from '@angular/core';
import { TruAppService } from 'src/app/services/tru-app.service';
import { BreadcrumbService } from 'src/app/services/utils/breadcrumb.service';
import { MenuItem, TruMenuConstancts } from 'src/app/shared/utils/tru-menu';
import { SettingsComponent } from '../../settings.component';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  constructor(private svc:TruAppService,
    private breadcrumbSvc:BreadcrumbService) {
    let curMenu:MenuItem={...TruMenuConstancts.CHANGEPASSWORD};
    curMenu.path=TruMenuConstancts.SETTING.code;
    breadcrumbSvc.location=[TruMenuConstancts.SETTING,curMenu];
    breadcrumbSvc.page=curMenu;
  }

  ngOnInit(): void {
    SettingsComponent.setSecondMenu(this.svc);
  }

}
