export class MenuItem {
  icon:string;
  name:string;
  title:string|null;
  code:string;
  path:string;
  parents:MenuItem[];
  constructor(icon:string,name:string,code:string,title?:string){
    this.icon=icon;
    this.name=name;
    this.code=code;
    if(title) this.title=title;
    else this.title=name;
  }
}
export class TruMenuConstancts {

  static FEATURES:MenuItem =  new MenuItem('appstore','Features','features');
  static PRICING:MenuItem =  new MenuItem('dollar','Pricing','pricing');
  static HELP:MenuItem =  new MenuItem('question-circle','Help','help');
  static SIGININ:MenuItem =  new MenuItem('login','Signin','signin');
  static SIGINUP:MenuItem =  new MenuItem('user-add','Get Started','signup');
  static MYACCOUNT:MenuItem =  new MenuItem('user','Go to Dashboard','myaccount');

  static DASHBAORD:MenuItem =  new MenuItem('dashboard','Dashboard','dashboard');
  static TEAM:MenuItem =  new MenuItem('team','Team','team','Team Management');
  static INBOX:MenuItem =  new MenuItem('inbox','Inbox','inbox');
  static SETTING:MenuItem =  new MenuItem('setting','Settings','settings','Account Settings');

  static PROFILE:MenuItem =  new MenuItem('profile','Profile','profile');
  static CHANGEPASSWORD:MenuItem =  new MenuItem('key','Change Password','change-password');
  static ACCOUNTS:MenuItem =  new MenuItem('bank','Accounts','accounts');
  static USAGE:MenuItem =  new MenuItem('pie-chart','Usage','usage');
  static BILLING:MenuItem =  new MenuItem('dollar','Billing','billing');


}
