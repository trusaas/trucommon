import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TruValidators } from '../../../shared/utils/tru-validators';
import { encode, decode } from 'base-64';
import { TruAppService } from 'src/app/services/tru-app.service';
import { TruAppSvcUtil } from 'src/app/services/tru-app-svc-util';
import { TruNzOptions } from 'src/app/shared/utils/tru-nz-options';
import { SeoService } from 'src/app/services/seo.service';
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html'
})
export class SigninComponent implements OnInit {

  signinForm!: FormGroup;
  forgot: TruNzOptions = new TruNzOptions();
  passwordVisible:boolean=false;

  constructor(private fb: FormBuilder,private svc:TruAppService) {}

  ngOnInit(): void {
    this.svc.seoSvc.updateTitle('Truresponse Signin');
    let localRememberData = this.svc.storageSvc.getLocalItem('remember', true);
    if (localRememberData == null) {
      localRememberData = { email: '', password: encode(''), remember: false };
    }
    this.signinForm = this.fb.group({
      email: [localRememberData.email, [Validators.required, TruValidators.email]],
      password: [decode(localRememberData.password), [Validators.required, TruValidators.passwordLength]],
      remember: [localRememberData.remember]
    });
    this.forgot.form = this.fb.group({
      email: [null, [Validators.required, TruValidators.email]]
    });
  }
  showForgotPassword(){
    this.forgot.form.reset();
    this.forgot.visible = true;
  }
  submitSigninForm(){
    for (const i in this.signinForm.controls) {
      this.signinForm.controls[i].markAsDirty();
      this.signinForm.controls[i].updateValueAndValidity();
    }
    if(!this.signinForm.valid) return;
    this.signinForm.value.password = encode(this.signinForm.value.password);
    this.svc.user.signin(this.signinForm.value).subscribe(res => {
      if (res.success) {
        if (this.signinForm.value.remember) {
          this.svc.storageSvc.setLocalItem('remember', this.signinForm.value, true);
        } else {
          this.svc.storageSvc.removeLocalItem('remember');
        }
        this.svc.setSession(res.data);
        this.svc.router.navigate(['/a', res.data.userAccounts[0].account.appId, 'dashboard']);
        this.svc.messageSvc.success(res.message);
      } else {
        this.svc.messageSvc.error(res.message);
      }
    }, (err)=>{ TruAppSvcUtil.httpErr(err,this.svc.messageSvc);  });
  }
  submitForgotForm(): void {
    for (const i in this.forgot.form.controls) {
      this.forgot.form.controls[i].markAsDirty();
      this.forgot.form.controls[i].updateValueAndValidity();
    }
    if(!this.forgot.form.valid) return;
    this.forgot.loading=true;
    this.forgot.closable=false;
    this.svc.user.requestPassword(this.forgot.form.value).subscribe(res => {
      this.forgot.loading=false;
      this.forgot.closable=true;
      if (res.success) {
        this.forgot.visible=false;
        this.svc.messageSvc.success(res.message);
      } else {
        this.svc.messageSvc.error(res.message);
      }
    }, (err)=>{ TruAppSvcUtil.httpErr(err,this.svc.messageSvc,this.forgot);  });
  }

}
