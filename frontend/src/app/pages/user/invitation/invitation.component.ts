import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TruAppService } from 'src/app/services/tru-app.service';
import { encode } from 'base-64';
import { TruValidators } from 'src/app/shared/utils/tru-validators';
import { TruAppSvcUtil } from 'src/app/services/tru-app-svc-util';
@Component({
  selector: 'app-invitation',
  templateUrl: './invitation.component.html',
  styles:[`.ant-input-affix-wrapper-disabled{
    color: inherit;
    background-color: transparent;
  }
  .ant-input-disabled{
    color: inherit;
  }`]
})
export class InvitationComponent implements OnInit {


  inviteForm!: FormGroup;
  cnfmPasswordVisible:boolean=false;
  processed:boolean=false;
  status:boolean=false;
  invitationDetails:any={};
  appId: string | null = null;
  uniqueId: string | null = null;
  constructor(private route: ActivatedRoute,public svc: TruAppService,private fb: FormBuilder) { }
  ngOnInit(): void {
    this.processed=false;
    this.invitationDetails={};
    this.route.params.subscribe(params => {
      this.uniqueId = params['uniqueId'];
      this.appId = params['appId'];
      this.refreshInvitation();
    });
  }
  updateStatus = (res:any)=>{
    if(res.success){
      this.invitationDetails=res.data;
      this.inviteForm.controls['email'].setValue(res.data.user.email);
      this.inviteForm.controls['email'].disable();
      this.inviteForm.controls['name'].setValue(res.data.user.name);
      if(res.data.user.name) this.inviteForm.controls['name'].disable();
      if(res.data.user.password){
        this.inviteForm.controls['confirmPassword'].setValidators([]);
        this.inviteForm.controls['confirmPassword'].setValue('');
      }
      if(this.svc.session!==null && this.svc.session.email===res.data?.user?.email){
        this.inviteForm.controls['password'].setValidators([]);
        this.inviteForm.controls['password'].setValue('');
      }
    } else{
      this.invitationDetails= {};
    }
    this.status=res.success;
    this.processed=true;
  }
  submitInviteForm(){
    let flag:boolean=true;
    let cnfPwd:string=this.inviteForm.value.confirmPassword;
    if(this.inviteForm.value.password!==cnfPwd){
      flag=false;
    }
    for (const i in this.inviteForm.controls) {
      this.inviteForm.controls[i].markAsDirty();
      this.inviteForm.controls[i].updateValueAndValidity();
    }
    if(flag){
      this.inviteForm.controls['confirmPassword'].setValue(this.inviteForm.value.password);
    }else{
      this.inviteForm.controls['confirmPassword'].setValue(cnfPwd);
    }
    if(!this.inviteForm.valid) return;
    this.inviteForm.controls['password'].setValue(encode(this.inviteForm.value.password));
    this.inviteForm.controls['confirmPassword'].setValue(this.inviteForm.value.password);
    let params:any=this.inviteForm.value;
    params.uniqueId=this.uniqueId;
    params.appId=this.appId;
    params.globalLoader=true;
    this.svc.team.acceptInvite(params).subscribe(res => {
      if (res.success) {
        this.svc.setSession(res.data);
        this.svc.router.navigate(['/a', this.appId, 'dashboard']);
        this.svc.messageSvc.success(res.message);
      } else {
        this.refreshInvitation();
        this.svc.messageSvc.error(res.message);
      }
    }, (err)=>{ TruAppSvcUtil.httpErr(err,this.svc.messageSvc);  });
  }
  refreshInvitation(){
    this.processed=false;
    this.invitationDetails={};
    this.inviteForm = this.fb.group({
      email: [null, [Validators.required,TruValidators.email]],
      name: [null, [Validators.required]],
      password: [null, [Validators.required, TruValidators.passwordLength]],
      confirmPassword: [null, [TruValidators.confirmPassword]],
    });
    this.inviteForm.controls['password'].valueChanges.subscribe(val=>{
      this.inviteForm.controls['confirmPassword'].setValue('');
    });
    setTimeout(()=>{
      this.svc.team.inviteInfo({ globalLoader:false,
        uniqueId: this.uniqueId,
        appId: this.appId })
      .subscribe(res => {
          if(res.success){
            if(this.svc.session!==null && this.svc.session.email!==res.data?.user?.email){
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
  }
}
