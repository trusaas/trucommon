import { Component, OnInit } from '@angular/core';
import { TruAppService } from 'src/app/services/tru-app.service';

@Component({
  selector: 'app-get-started',
  templateUrl: './get-started.component.html'
})
export class GetStartedComponent implements OnInit {

  constructor(public svc:TruAppService) { }

  ngOnInit(): void {
  }

}
