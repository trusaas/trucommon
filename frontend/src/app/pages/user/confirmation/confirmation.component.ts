import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TruAppService } from 'src/app/services/tru-app.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html'
})
export class ConfirmationComponent implements OnInit {

  processed:boolean=false;
  status:boolean=false;
  private appId: string | null = null;
  private confirmationToken: string | null = null;

  constructor(private route: ActivatedRoute,
    public svc: TruAppService) { }

  ngOnInit(): void {
    this.processed=false;
    this.route.params.subscribe(params => {
      this.confirmationToken = params['confirmationToken'];
      this.appId = params['appId'];
      setTimeout(()=>{
        this.svc.user.confirmation({ appId: this.appId, confirmationToken: this.confirmationToken })
        .subscribe(res => {
          if(this.svc.session){
            if(this.svc.session?.email!==res.data?.email){
              if(res.success){
                this.svc.user.signout(this.svc,true,()=>{
                  this.updateStatus(res);
                });
              }else{
                this.updateStatus(res);
              }
            }else{
              this.svc.updateUserStatusInSession('Active');
              this.updateStatus(res);
            }
          }else{
            this.updateStatus(res);
          }
        });
      },0);
    });
  }
  updateStatus = (res:any)=>{
    this.status=res.success;
    this.processed=true;
  }
}

