import { Component, OnInit } from '@angular/core';
import { TruTable } from 'src/app/shared/utils/tru-table';
import { TruAppService } from 'src/app/services/tru-app.service';
import { TruAppSvcUtil } from 'src/app/services/tru-app-svc-util';

@Component({
  selector: 'app-team-invites-table',
  templateUrl: './team-invites-table.component.html'
})
export class TeamInvitesTableComponent implements OnInit {


  dataTable:TruTable;
  constructor(public svc:TruAppService) {
    this.dataTable = new TruTable('team','list?action=invitations',this.svc,['email']);
    this.dataTable.fixedCond={accepted:false};
  }
  resend(data){
    this.svc.team
    .inviteTeammates([data.user.email],true)
    .subscribe(res=>{
      if(res.success){
        this.svc.messageSvc.success(res.message);
      }else{
        this.svc.messageSvc.error(res.message);
      }
    }, (err)=>{ TruAppSvcUtil.httpErr(err,this.svc.messageSvc);  });
  }
  ngOnInit(): void {}

}
