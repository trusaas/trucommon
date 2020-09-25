import { Component, OnInit } from '@angular/core';
import { TruAppService } from 'src/app/services/tru-app.service';
import { BreadcrumbService } from 'src/app/services/utils/breadcrumb.service';
import { MenuItem, TruMenuConstancts } from 'src/app/shared/utils/tru-menu';
import { SettingsComponent } from '../../settings.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(private svc:TruAppService,
    private breadcrumbSvc:BreadcrumbService) {
    let curMenu:MenuItem={...TruMenuConstancts.PROFILE};
    curMenu.path=TruMenuConstancts.SETTING.code;
    breadcrumbSvc.location=[TruMenuConstancts.SETTING,curMenu];
    breadcrumbSvc.page=curMenu;
  }

  ngOnInit(): void {
    SettingsComponent.setSecondMenu(this.svc);
  }

}
