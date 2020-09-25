import { Component, OnInit } from '@angular/core';
import { TruAppService } from 'src/app/services/tru-app.service';

@Component({
  selector: 'app-confirmation-pending',
  templateUrl: './confirmation-pending.component.html'
})
export class ConfirmationPendingComponent implements OnInit {

  constructor(public svc: TruAppService) { }

  ngOnInit(): void {
  }

}
