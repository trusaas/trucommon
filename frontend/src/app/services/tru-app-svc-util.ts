import { TruUtils } from '../shared/utils/tru-utils';
import { BehaviorSubject } from 'rxjs';

export class TruAppSvcUtil {
  public static httpErr = (err,message?,compOptions?) =>{
    //TruUtils.log(err);
    if(err.status===401 || err.status===403){}else{
      if(message)message.error(TruUtils.SERVER_ERROR);
    }
    if(compOptions)compOptions.loading=false;
  }
  public static getUserSvcUrl = (part:string,appId:BehaviorSubject<string>):string =>{
    return TruAppSvcUtil.getSvcUrl('user',part,appId.getValue());
  }
  public static getAccountSvcUrl = (part:string,appId:BehaviorSubject<string>):string =>{
    return TruAppSvcUtil.getSvcUrl('account',part,appId.getValue());
  }
  public static getTeamSvcUrl = (part:string,appId:BehaviorSubject<string>):string =>{
    return TruAppSvcUtil.getSvcUrl('team',part,appId.getValue());
  }
  public static getDashboardSvcUrl = (part:string,appId:BehaviorSubject<string>):string =>{
    return TruAppSvcUtil.getSvcUrl('dashboard',part,appId.getValue());
  }
  public static getSvcUrl = (type:string,part:string,appId:string):string =>{
    return type+'/'+part+((appId && appId!==null && appId.trim()!=='')?((part.indexOf('?')<0?'?':'&')+'appId='+appId):'');
  }
}
