import { Component, OnInit } from '@angular/core';
import { TruUtils } from 'src/app/shared/utils/tru-utils';
import { TruAppService } from 'src/app/services/tru-app.service';
import { TruTable } from 'src/app/shared/utils/tru-table';
@Component({
  selector: 'app-teammates-table',
  templateUrl: './teammates-table.component.html'
})
export class TeammatesTableComponent implements OnInit {

  truUtils: any = TruUtils;
  dataTable:TruTable;
  constructor(private svc:TruAppService) {
    this.dataTable = new TruTable('team','list?action=teammates',this.svc,['email']);
    this.dataTable.fixedCond={accepted:true};
  }

  ngOnInit(): void {}

}
