import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TruAppService } from 'src/app/services/tru-app.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls:['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {

  constructor(public svc:TruAppService) { }

  ngOnInit(): void {
    this.svc.seoSvc.updateTitle('Truresponse');
  }

}
