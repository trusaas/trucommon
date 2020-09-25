import { Component, OnInit, ViewChild } from '@angular/core';
import { BreadcrumbService } from 'src/app/services/utils/breadcrumb.service';
import { TruMenuConstancts } from 'src/app/shared/utils/tru-menu';
import { FormBuilder, Validators } from '@angular/forms';
import { TruValidators } from 'src/app/shared/utils/tru-validators';
import { TruNzOptions } from 'src/app/shared/utils/tru-nz-options';
import { TruAppService } from 'src/app/services/tru-app.service';
import { TruAppSvcUtil } from 'src/app/services/tru-app-svc-util';


@Component({
  selector: 'app-team',
  templateUrl: './team.component.html'
})
export class TeamComponent implements OnInit {

  inviteTeammate: TruNzOptions = new TruNzOptions();
  tabIndex:number=0;
  @ViewChild('teamInvites') teamInvites;
  constructor(private fb: FormBuilder,
    public svc: TruAppService,
    private breadcrumbSvc: BreadcrumbService) {
    breadcrumbSvc.location = [TruMenuConstancts.TEAM];
    breadcrumbSvc.page = TruMenuConstancts.TEAM;
  }

  ngOnInit(): void {
    this.svc.setSecondMenu();
    //this.loadDataFromServer(this.pageIndex, this.pageSize, null, null, []);
    this.inviteTeammate.form = this.fb.group({
      emails: [null, [Validators.required,TruValidators.email]]
    });
  }
  showInviteAdd(){
    this.inviteTeammate.form.reset();
    this.inviteTeammate.visible = true;
  }
  submitInviteForm(){
    for (const i in this.inviteTeammate.form.controls) {
      this.inviteTeammate.form.controls[i].markAsDirty();
      this.inviteTeammate.form.controls[i].updateValueAndValidity();
    }
    if(!this.inviteTeammate.form.valid) return;
    this.inviteTeammate.loading=true;
    this.inviteTeammate.closable=false;
    this.svc.team
    .inviteTeammates(this.inviteTeammate.form.controls['emails'].value)
    .subscribe(res=>{
      this.inviteTeammate.loading=false;
      this.inviteTeammate.closable=true;
      if(res.success){
        this.inviteTeammate.visible = false;
        this.svc.messageSvc.success(res.message);
        if(this.tabIndex!=1) {
          this.tabIndex=1;
        }else{
          this.teamInvites.dataTable.reload();
        }
      }else{
        this.svc.messageSvc.error(res.message);
      }
    }, (err)=>{ TruAppSvcUtil.httpErr(err,this.svc.messageSvc,this.inviteTeammate);  });
  }

}
