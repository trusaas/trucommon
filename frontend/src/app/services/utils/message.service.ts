import { Injectable,TemplateRef } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
@Injectable({
  providedIn: 'root',
})
export class MessageService {
  truMessageTemplate:TemplateRef<{}>;

  constructor(private notify: NzNotificationService,private message: NzMessageService) { }

  success(message:string,title?:string){
    this.create('success',message,title);
  }
  private create(type: string,message:string,title?:string){
    if(message && message!=null && message.trim()!='')
      this.notify.template(this.truMessageTemplate,{nzPauseOnHover:true,nzData:{type:type,title:title,message:message}});
  }
  error(message:string,title?:string){
    this.create('error',message,title);
  }
  info(message:string,title?:string){
    this.create('info',message,title);
  }
  warning(message:string,title?:string){
    this.create('warning',message,title);
  }

  warningCenter(message:string,options?:any){
    this.message.create('warning', message,options);
  }

}
