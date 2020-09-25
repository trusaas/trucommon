import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TruValidators } from '../../../shared/utils/tru-validators';
import { encode, decode } from 'base-64';
import { TruAppService } from 'src/app/services/tru-app.service';
import { TruAppSvcUtil } from 'src/app/services/tru-app-svc-util';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html'
})
export class SignupComponent implements OnInit {

  signupForm!: FormGroup;
  passwordVisible:boolean=false;
  cnfmPasswordVisible:boolean=false;

  constructor(private fb: FormBuilder,private svc:TruAppService) { }

  ngOnInit(): void {
    this.svc.seoSvc.updateTitle('Truresponse Signup');
    this.signupForm = this.fb.group({
      account: [null, [Validators.required]],
      name: [null, [Validators.required]],
      email: [null, [Validators.required, TruValidators.email]],
      password: [null, [Validators.required, TruValidators.passwordLength]],
      confirmPassword: [null, [TruValidators.confirmPassword]],
    });
    this.signupForm.controls['password'].valueChanges.subscribe(val=>{
      this.signupForm.controls['confirmPassword'].setValue('');
    });
  }
  submitSignupForm(){
    let flag:boolean=true;
    let cnfPwd:string=this.signupForm.value.confirmPassword;
    if(this.signupForm.value.password!==cnfPwd){
      flag=false;
    }
    for (const i in this.signupForm.controls) {
      this.signupForm.controls[i].markAsDirty();
      this.signupForm.controls[i].updateValueAndValidity();
    }
    if(flag){
      this.signupForm.controls['confirmPassword'].setValue(this.signupForm.value.password);
    }else{
      this.signupForm.controls['confirmPassword'].setValue(cnfPwd);
    }
    if(!this.signupForm.valid) return;
    this.signupForm.controls['password'].setValue(encode(this.signupForm.value.password));
    this.signupForm.controls['confirmPassword'].setValue(this.signupForm.value.password);
    this.svc.user.signup(this.signupForm.value).subscribe(res => {
      if (res.success) {
        this.svc.storageSvc.setLocalItem('remember',
        {remember:true,email: this.signupForm.value.email, password: this.signupForm.value.password}, true);
        this.svc.setSession(res.data);
        this.svc.router.navigate(['/a', res.data.userAccounts[0].account.appId, 'dashboard']);
        this.svc.messageSvc.success(res.message);
      } else {
        this.signupForm.controls['password'].setValue(decode(this.signupForm.value.password));
        this.signupForm.controls['confirmPassword'].setValue(this.signupForm.value.password);
        this.svc.messageSvc.error(res.message);
      }
    }, (err)=>{ TruAppSvcUtil.httpErr(err,this.svc.messageSvc);  });
  }
}
