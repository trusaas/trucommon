import { Md5 } from 'ts-md5/dist/md5';

export class TruUtils {

  public static md5:any=Md5;
  public static SERVER_ERROR:string='Server error, Please contact administrator or retry.';

  public static test = (): {} => {
    return {};
  };

  public static  getRandomNumberBetween = (min:number,max:number):number => {
    return Math.floor(Math.random()*(max-min+1)+min);
  }
  public static log = (message:any) =>{
    console.log(message);
  }
  public static  getRandomStatus = ():string => {
    const i:number=TruUtils.getRandomNumberBetween(1,4);
    if(i===1){
      return 'success';
    }else if(i===2){
      return 'error';
    }else if(i===3){
      return 'warning';
    }else{
      return 'default';
    }
    /*
    else if(i===4){
      return 'processing';
    }
    */
  }
  public static  getRandomSeat = ():boolean => {
    const i:number=TruUtils.getRandomNumberBetween(1,2);
    if(i===1){
      return true;
    }else{
      return false;
    }
  }
}
