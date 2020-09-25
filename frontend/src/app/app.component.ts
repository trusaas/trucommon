import { Component, Renderer2, ViewChild, TemplateRef } from '@angular/core';
import { SeoService } from './services/seo.service';
import { TruAppService } from './services/tru-app.service';
import { LoaderService } from './services/utils/loader.service';
import { MessageService } from './services/utils/message.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  loading: boolean = true;
  @ViewChild('truMessageTemplate') truMessageTemplate:TemplateRef<{}>;
  constructor(
    private loaderService: LoaderService,
    private message:MessageService,
    private svc:TruAppService,
    private seoSvc:SeoService
    ){
      svc.seoSvc=seoSvc;
     }
  ngOnInit() {
    this.loading = false;
  }
  ngAfterViewInit() {
    this.message.truMessageTemplate=this.truMessageTemplate;
    this.loaderService.isLoading.subscribe((v: boolean) => {
        setTimeout(()=>{this.loading = v;},0);
    });
  }
}
