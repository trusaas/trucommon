import { Component, OnInit } from '@angular/core';
import { TruAppService } from 'src/app/services/tru-app.service';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html'
})
export class BannerComponent implements OnInit {

  constructor(public svc:TruAppService) { }

  ngOnInit(): void {
  }

}
