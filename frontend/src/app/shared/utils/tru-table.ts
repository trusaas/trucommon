import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { TruAppService } from 'src/app/services/tru-app.service';
import { TruAppSvcUtil } from 'src/app/services/tru-app-svc-util';

export class TruTable {
  total = 0;
  rowsData: any[] = [];
  loading = true;
  pageSize = 10;
  pageIndex = 1;
  tableParams:NzTableQueryParams;
  customFilter:any={};
  fixedCond:any={};
  constructor(private apiType:string,private api:string,private svc:TruAppService,
    customFilterKeys?:string[],
    private sortField?:string,private sortOrder?:string){
    this.sortField=sortField;
    this.sortOrder=sortOrder;
    if(customFilterKeys){
      customFilterKeys.forEach(x=>{
        this.customFilter[x]={};
        this.customFilter[x].visible=false;
        this.customFilter[x].value='';
      });
    }

  }
  loadDataFromServer(
    tableParams?:NzTableQueryParams,
    options?:any
  ): void {
    if(!tableParams || tableParams===null) tableParams=this.tableParams;
    if(options) {
        if(options.filter) this.applyCustomFilter(options.filter);
        if(options.resetFilter) this.resetCustomFilter(options.resetFilter);
        if(options.reload && options.reload===true){
          if(tableParams.pageIndex!==1) {
            tableParams.pageIndex=1;
            return;
          }
        }
    }
    this.tableParams=tableParams;
    let params=new TruTablePrams(tableParams,this.fixedCond,this.customFilter);
    this.loading = true;
    this.svc.getTableList(this.apiType,this.api,params).subscribe((res:any) => {
      this.setServerData(res,this.svc.messageSvc);
    }, (err)=>{ TruAppSvcUtil.httpErr(err,this.svc.messageSvc,this);  });
  }
  private setServerData = (res,message) =>{
    this.loading = false;
    if(res.success){
      this.rowsData = <any[]>res.data.rows;
      this.total = res.data.count;
      if(res.data.pageIndex) this.pageIndex = res.data.pageIndex;
      else this.pageIndex = 1;
    }else{
      this.total = 0;
      this.rowsData = [];
      this.pageIndex = 1;
      message.error(res.message);
    }
  }
  applyCustomFilter = (field:string)=>{
    this.customFilter[field].visible=false;
  }
  resetCustomFilter = (field:string)=>{
    this.customFilter[field].visible=false;
    this.customFilter[field].value='';
  }
  reload = ()=>{
    this.loadDataFromServer(null,{reload:true})
  }
}
export class TruTablePrams{
  pageIndex: number;
  pageSize: number;
  sortField: string | null;
  sortOrder: string | null;
  globalLoader:boolean = false;
  filter: Array<{ key: string; value: string[] }>;
  constructor(params: NzTableQueryParams,
    private fixedCond:any,private customFilter:any){
    const { pageSize, pageIndex, sort, filter } = params;
    const currentSort = sort.find(item => item.value !== null);
    this.sortField = (currentSort && currentSort.key) || null;
    this.sortOrder = (currentSort && currentSort.value) || null;
    if(this.sortOrder && this.sortOrder!==null){
      this.sortOrder=this.sortOrder.replace('end','');
    }
    if(pageIndex<=0) this.pageIndex=1; else this.pageIndex=pageIndex;
    this.pageSize=pageSize;
    this.filter=filter;
    }
}
