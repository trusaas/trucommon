import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from 'src/app/services/utils/breadcrumb.service';
import { MenuItem, TruMenuConstancts } from 'src/app/shared/utils/tru-menu';
import { TruAppService } from 'src/app/services/tru-app.service';



@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {



  constructor(private svc:TruAppService,
    private breadcrumbSvc:BreadcrumbService) {}

  ngOnInit(): void {
  }

  private static menus: MenuItem[] = [
    TruMenuConstancts.PROFILE,
    TruMenuConstancts.CHANGEPASSWORD,
    TruMenuConstancts.ACCOUNTS,
    TruMenuConstancts.USAGE,
    TruMenuConstancts.BILLING,
  ];

  static setSecondMenu(svc:TruAppService){
    svc.setSecondMenu(SettingsComponent.menus,TruMenuConstancts.SETTING);
  }
}

