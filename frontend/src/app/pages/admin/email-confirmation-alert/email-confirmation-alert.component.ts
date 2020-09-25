import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { TruAppSvcUtil } from 'src/app/services/tru-app-svc-util';
import { TruAppService } from 'src/app/services/tru-app.service';
import { TruNzOptions } from 'src/app/shared/utils/tru-nz-options';
import { TruValidators } from 'src/app/shared/utils/tru-validators';

@Component({
  selector: 'app-email-confirmation-alert',
  templateUrl: './email-confirmation-alert.component.html',
  styleUrls:['./email-confirmation-alert.component.scss']
})
export class EmailConfirmationAlertComponent implements OnInit {

  accountEmail: TruNzOptions = new TruNzOptions();
  constructor(public svc: TruAppService,
    private fb: FormBuilder) {
    if(this.svc.session){
      this.accountEmail.form = this.fb.group({
        email: [null, [Validators.required,TruValidators.email]]
      });
   }
  }

  ngOnInit(): void {
  }

  chnageMail(){
    this.accountEmail.form.reset();
    this.accountEmail.visible=true;
  }
  submitChangeEmail(){
    for (const i in this.accountEmail.form.controls) {
      this.accountEmail.form.controls[i].markAsDirty();
      this.accountEmail.form.controls[i].updateValueAndValidity();
    }
    if(!this.accountEmail.form.valid) return;
    this.accountEmail.loading=true;
    this.accountEmail.closable=false;
    this.svc.user.chnageMail(this.accountEmail.form.value).subscribe(res => {
      if (res.success) {
        this.svc.user.verifySession(true,this.svc,()=>{
          this.svc.messageSvc.success(res.message);
          this.accountEmail.loading=false;
          this.accountEmail.closable=true;
          this.accountEmail.visible=false;
        });
      } else {
        this.accountEmail.loading=false;
        this.accountEmail.closable=true;
        this.svc.messageSvc.error(res.message);
      }
    }, (err)=>{ TruAppSvcUtil.httpErr(err,this.svc.messageSvc,this.accountEmail);  });
  }
  resendConfirmation(){
    this.svc.user.resendConfirmation().subscribe(res => {
      if (res.success) {
        this.svc.messageSvc.success(res.message);
      } else {
        this.svc.messageSvc.error(res.message);
      }
    }, (err)=>{ TruAppSvcUtil.httpErr(err,this.svc.messageSvc);  });
  }

}
