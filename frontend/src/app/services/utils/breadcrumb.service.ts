import { Injectable } from '@angular/core';
import { MenuItem } from 'src/app/shared/utils/tru-menu';
@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  userAccount:any={};
  appId:string|null;
  page:any={};
  location:MenuItem[]=[];
  constructor() {}
}
