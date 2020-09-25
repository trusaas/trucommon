import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from 'src/app/services/utils/breadcrumb.service';
import { TruMenuConstancts } from 'src/app/shared/utils/tru-menu';
import { TruAppService } from 'src/app/services/tru-app.service';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html'
})
export class InboxComponent implements OnInit {

  constructor(private svc:TruAppService,
    private breadcrumbSvc:BreadcrumbService) {
    breadcrumbSvc.location=[TruMenuConstancts.INBOX];
    breadcrumbSvc.page=TruMenuConstancts.INBOX;
  }

  ngOnInit(): void {
    this.svc.setSecondMenu();
  }


}
