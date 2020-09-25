import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BreadcrumbService } from 'src/app/services/utils/breadcrumb.service';
import { UserService } from 'src/app/services/user.service';
import { TruMenuConstancts } from 'src/app/shared/utils/tru-menu';
import { HttpClientModule } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TeamService } from 'src/app/services/admin/team.service';
import { Md5 } from 'ts-md5/dist/md5';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';


interface ItemData {
  gender: string;
  name: Name;
  email: string;
}

interface Name {
  title: string;
  first: string;
  last: string;
}

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {

  ds = null;
  md5:any=Md5;
  constructor(private userService: UserService,
    private breadcrumbService: BreadcrumbService,
    private http: HttpClientModule,
    private msg: NzMessageService,
    private teamService: TeamService) {
    breadcrumbService.location = [TruMenuConstancts.TEAM];
    breadcrumbService.page = TruMenuConstancts.TEAM;
    this.ds = new MyDataSource(teamService);
  }
  ngOnInit(): void {
  }
  edit(item) {

  }
}
class MyDataSource extends DataSource<ItemData> {
  private length = 100000;
  private pageSize = 10;
  private cachedData = Array.from<ItemData>({ length: this.length });
  private fetchedPages = new Set<number>();
  private dataStream = new BehaviorSubject<ItemData[]>(this.cachedData);
  private subscription = new Subscription();

  constructor(private teamService: TeamService) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<ItemData[]> {
    this.subscription.add(
      collectionViewer.viewChange.subscribe(range => {
        const startPage = this.getPageForIndex(range.start);
        const endPage = this.getPageForIndex(range.end - 1);
        for (let i = startPage; i <= endPage; i++) {
          this.fetchPage(i);
        }
      })
    );
    return this.dataStream;
  }

  disconnect(): void {
    this.subscription.unsubscribe();
  }

  private getPageForIndex(index: number): number {
    return Math.floor(index / this.pageSize);
  }

  private fetchPage(page: number): void {
    if (this.fetchedPages.has(page)) {
      return;
    }
    this.fetchedPages.add(page);

    this.teamService
      .getFakeData(`https://randomuser.me/api/?results=${this.pageSize}&inc=name,gender,email,nat&noinfo`)
      .subscribe(res => {
        this.cachedData.splice(page * this.pageSize, this.pageSize, ...res.results);
        this.dataStream.next(this.cachedData);
      });
  }
}

/*

initLoading = true; // bug
loadingMore = false;
data: any[] = [];
md5:any = Md5;
list: Array<{ loading: boolean; name: any,email:any }> = [];

constructor(private userService:UserService,
  private breadcrumbService:BreadcrumbService,
  private http: HttpClientModule,
  private msg: NzMessageService,
  private teamService:TeamService) {
  breadcrumbService.location=[TruMenuConstancts.TEAM];
  breadcrumbService.page=TruMenuConstancts.TEAM;
}





ngOnInit(): void {
  this.getFakeData((res: any) => {
    this.data = res.results;
    this.list = res.results;
    this.initLoading = false;
  });
}
getFakeData(callback: (res: any) => void): void {
  this.teamService.getFakeData().subscribe((res: any) => callback(res));
}

onLoadMore(): void {
  this.loadingMore = true;
  this.list = this.data.concat([...Array(count)].fill({}).map(() => ({ loading: true, name: {} })));
  this.teamService.getFakeData().subscribe((res: any) => {
    this.data = this.data.concat(res.results);
    this.list = [...this.data];
    this.loadingMore = false;
  });
}

edit(item: any): void {
  this.msg.success(item.email);
}
*/
