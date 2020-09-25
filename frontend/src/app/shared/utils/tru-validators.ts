
import { FormControl } from '@angular/forms';
export class TruValidators {
  public static passwordLength = (control: FormControl): { [s: string]: boolean } => {
    if (control.value && (control.value.length < 6 || control.value.length > 20))
      return { passwordLength: true, error: true };
    else{
      let cpc = control.parent && control.parent.controls?control.parent.controls['confirmPassword']:null;
      if(cpc) setTimeout(()=>{cpc.setValue(cpc.value);},200);
      return {};
    }
  };
  public static email = (control: FormControl): { [s: string]: boolean } => {
    let email = control.value;
    if (email == undefined || email == null ||
      (Array.isArray(email) && email.length==0) ||
      (typeof email ==='string' && email.trim() === '')) return {};
    const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if(typeof email ==='string'){
      email = email.trim();
      if(!emailRegexp.test(email)){
        return { emailCustom: true, error: true };
      }
      else return {};
    }else{
      let flag:boolean=true;
      email.forEach(x => {
        if(!emailRegexp.test(x)){
          return flag=false;
        }
      });
      if(!flag){
        return { emailCustom: true, error: true };
      }else{
        return {};
      }
    }

  };

  public static confirmPassword = (control: FormControl): { [s: string]: boolean } => {
    let formValue:any = (control && control.parent && control.parent.value) ? control.parent.value : {password:''};
    let confirmPassword = control.value;
    let password = formValue.password;
    if (password == undefined || password == null || password.trim() === '') return {};
    if (confirmPassword == undefined || confirmPassword == null || confirmPassword.trim() === '') return { required: true, error: true };
    if(password!=confirmPassword){
      return { confirmPassword: true, error: true };
    }
    return {};
  };
}
