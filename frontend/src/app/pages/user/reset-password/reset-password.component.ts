import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TruAppSvcUtil } from 'src/app/services/tru-app-svc-util';
import { TruAppService } from 'src/app/services/tru-app.service';
import { TruValidators } from 'src/app/shared/utils/tru-validators';
import { encode } from 'base-64';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {

  resetForm!: FormGroup;
  cnfmPasswordVisible:boolean=false;
  processed:boolean=false;
  status:boolean=false;
  email:string='';
  private resetPasswordToken: string | null = null;

  constructor(private route: ActivatedRoute,
    public svc: TruAppService,private fb: FormBuilder) { }

  ngOnInit(): void {
    this.processed=false;
    this.email='';
    this.route.params.subscribe(params => {
      this.resetPasswordToken = params['resetPasswordToken'];
      setTimeout(()=>{
        this.svc.user.validatePasswordRequest({ globalLoader:false, resetPasswordToken: this.resetPasswordToken })
        .subscribe(res => {
            if(res.success){
              if(this.svc.session!=null){
                this.svc.user.signout(this.svc,true,()=>{
                  this.updateStatus(res);
                });
              }else{
                this.updateStatus(res);
              }
            }else{
              this.updateStatus(res);
            }
        });
      },0);
    });
    this.resetForm = this.fb.group({
      password: [null, [Validators.required, TruValidators.passwordLength]],
      confirmPassword: [null, [TruValidators.confirmPassword]],
    });
    this.resetForm.controls['password'].valueChanges.subscribe(val=>{
      this.resetForm.controls['confirmPassword'].setValue('');
    });
  }
  updateStatus = (res:any)=>{
    if(res.success){
      this.email=res.data.email;
    } else{
      this.email= '';
    }
    this.status=res.success;
    this.processed=true;
  }
  submitResetForm(){
    let flag:boolean=true;
    let cnfPwd:string=this.resetForm.value.confirmPassword;
    if(this.resetForm.value.password!==cnfPwd){
      flag=false;
    }
    for (const i in this.resetForm.controls) {
      this.resetForm.controls[i].markAsDirty();
      this.resetForm.controls[i].updateValueAndValidity();
    }
    if(flag){
      this.resetForm.controls['confirmPassword'].setValue(this.resetForm.value.password);
    }else{
      this.resetForm.controls['confirmPassword'].setValue(cnfPwd);
    }
    if(!this.resetForm.valid) return;
    this.resetForm.controls['password'].setValue(encode(this.resetForm.value.password));
    this.resetForm.controls['confirmPassword'].setValue(this.resetForm.value.password);
    let params:any=this.resetForm.value;
    params.resetPasswordToken=this.resetPasswordToken;
    params.globalLoader=true;
    this.svc.user.resetPassword(params).subscribe(res => {
      if (res.success) {
        this.svc.router.navigate(['/', 'signin']);
        this.svc.messageSvc.success(res.message);
      } else {
        this.svc.messageSvc.error(res.message);
      }
    }, (err)=>{ TruAppSvcUtil.httpErr(err,this.svc.messageSvc);  });
  }
}

