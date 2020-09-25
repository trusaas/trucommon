import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from 'src/app/services/utils/breadcrumb.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {

  constructor(public breadcrumbSvc:BreadcrumbService,
    public location:Location) { }

  ngOnInit(): void {
  }

}
