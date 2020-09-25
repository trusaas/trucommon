import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLayoutRoutingModule } from './admin-layout-routing.module';
import { AdminLayoutComponent } from './admin-layout.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { DashboardComponent } from '../../pages/admin/dashboard/dashboard.component';
import { TeamComponent } from '../../pages/admin/team/team.component';
import { SettingsComponent } from '../../pages/admin/settings/settings.component';
import { SimpleFormCommonNzModule } from 'src/app/shared/modules/simple-form-common-nz.module';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TeammatesTableComponent } from '../../pages/admin/team/teammates-table/teammates-table.component';
import { TeamInvitesTableComponent } from '../../pages/admin/team/team-invites-table/team-invites-table.component';
import { ConfirmationPendingComponent } from '../../pages/admin/confirmation-pending/confirmation-pending.component';
import { EmailConfirmationAlertComponent } from '../../pages/admin/email-confirmation-alert/email-confirmation-alert.component';
@NgModule({
  declarations: [
    AdminLayoutComponent,
    DashboardComponent,
    TeamComponent,
    SettingsComponent,
    BreadcrumbComponent,
    TeammatesTableComponent,
    TeamInvitesTableComponent,
    ConfirmationPendingComponent,
    EmailConfirmationAlertComponent,
  ],
  imports: [
    CommonModule,
    AdminLayoutRoutingModule,
    NzLayoutModule,
    NzMenuModule,
    SimpleFormCommonNzModule,
    NgxChartsModule
  ],
  exports:[]
})
export class AdminLayoutModule { }
