import { Component, OnInit } from '@angular/core';
import { TruAppService } from 'src/app/services/tru-app.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html'
})
export class HelpComponent implements OnInit {

  constructor(private svc:TruAppService) { }

  ngOnInit(): void {
    this.svc.seoSvc.updateTitle('Truresponse Help');
  }

}
