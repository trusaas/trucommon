import { Component, OnInit } from '@angular/core';
import { TruAppService } from 'src/app/services/tru-app.service';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html'
})
export class PricingComponent implements OnInit {

  constructor(public svc:TruAppService) { }

  ngOnInit(): void {
  }

}
