import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from 'src/app/services/utils/breadcrumb.service';
import { TruMenuConstancts } from 'src/app/shared/utils/tru-menu';
import { ActivatedRoute } from '@angular/router';
import { TruAppService } from 'src/app/services/tru-app.service';
import { TruAppSvcUtil } from 'src/app/services/tru-app-svc-util';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  single: any[];
  bubbleData: any[];
  multi: any[];
  singleLoading:boolean=false;
  bubbleLoading:boolean=false;
  multiLoading:boolean=false;
  // options
  showXAxis = true;
  showYAxis = true;
  gradient = true;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'Population';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  appId:string|null;
  constructor(private svc:TruAppService,
    private breadcrumbSvc:BreadcrumbService,private route:ActivatedRoute) {
    breadcrumbSvc.location=[TruMenuConstancts.DASHBAORD];
    breadcrumbSvc.page=TruMenuConstancts.DASHBAORD;
  }

  ngOnInit(): void {
    this.svc.setSecondMenu();
    this.svc.appId.subscribe((appId: string) => {
      this.appId = appId;
      this.singleLoading=true;
      this.bubbleLoading=true;
      this.multiLoading=true;
      this.svc.dashboard.graphData(this.appId,'single').subscribe((res) => {
        this.singleLoading=false;
        if(res.success){
          this.single=res.data;
        }
      }, (err)=>{ this.bubbleLoading=false; TruAppSvcUtil.httpErr(err,this.svc.messageSvc);  });
      this.svc.dashboard.graphData(this.appId,'multi').subscribe((res) => {
        this.multiLoading=false;
        if(res.success){
          this.multi=res.data;
        }
      }, (err)=>{ this.bubbleLoading=false; TruAppSvcUtil.httpErr(err,this.svc.messageSvc);  });
      this.svc.dashboard.graphData(this.appId,'bubble').subscribe((res) => {
        this.bubbleLoading=false;
        if(res.success){
          this.bubbleData=res.data;
        }
      }, (err)=>{ this.bubbleLoading=false; TruAppSvcUtil.httpErr(err,this.svc.messageSvc);  });
    });
  }

  onSelect(event){

  }

}
