import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TruNzOptions } from 'src/app/shared/utils/tru-nz-options';
import { FormBuilder, Validators } from '@angular/forms';
import { TruMenuConstancts,MenuItem } from 'src/app/shared/utils/tru-menu';
import { BreadcrumbService } from 'src/app/services/utils/breadcrumb.service';
import { TruAppService } from 'src/app/services/tru-app.service';
import { TruAppSvcUtil } from 'src/app/services/tru-app-svc-util';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {

  appId:string;
  menus: MenuItem[] = [
    TruMenuConstancts.DASHBAORD,
    TruMenuConstancts.TEAM,
    TruMenuConstancts.INBOX,
    TruMenuConstancts.SETTING,
  ];
  account: TruNzOptions = new TruNzOptions();
  profile: TruNzOptions = new TruNzOptions();
  constructor(public svc: TruAppService,
              private route:ActivatedRoute,
              private fb: FormBuilder,
              private breadcrumbSvc:BreadcrumbService) { this.svc.updateUserStatusInSession(); }

  ngOnInit(): void {
    this.svc.setSecondMenu();
    this.svc.seoSvc.updateTitle('Truresponse Admin');
    this.svc.updateUserStatusInSession();
    this.route.params.subscribe(params => {
      this.appId = params['appId'];
      this.svc.appId.next(this.appId);
      this.breadcrumbSvc.userAccount=this.svc.session.userAccounts.find(i => i.account.appId === this.appId);
      if(this.breadcrumbSvc.userAccount){
         this.breadcrumbSvc.appId=this.breadcrumbSvc.userAccount.account.appId;
      }
      this.svc.user.verifySession(true,this.svc,()=>{
        this.svc.setSelectedAccount();
      });
    });
    this.account.form = this.fb.group({
      account: [null, [Validators.required]]
    });
  }
  addAccount(){
    this.account.form.reset();
    this.account.visible=true;
    this.profile.visible=false;
  }
  submitAccount(){
    for (const i in this.account.form.controls) {
      this.account.form.controls[i].markAsDirty();
      this.account.form.controls[i].updateValueAndValidity();
    }
    if(!this.account.form.valid) return;
    this.account.loading=true;
    this.account.closable=false;
    this.svc.account.createAccount(this.account.form.value).subscribe(res => {
      this.account.loading=false;
      this.account.closable=true;
      if (res.success) {
        this.account.visible=false;
        this.svc.user.verifySession(true,this.svc);
        this.svc.messageSvc.success(res.message);
      } else {
        this.svc.messageSvc.error(res.message);
      }
    }, (err)=>{ TruAppSvcUtil.httpErr(err,this.svc.messageSvc,this.account);  });
  }

}
