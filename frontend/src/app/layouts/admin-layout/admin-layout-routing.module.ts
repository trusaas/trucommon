import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout.component';
import { DashboardComponent } from 'src/app/pages/admin/dashboard/dashboard.component';
import { TeamComponent } from 'src/app/pages/admin/team/team.component';
import { AuthGuard } from '../../guards/auth.guard';
const routes: Routes = [
  {
    path: '', component: AdminLayoutComponent,
    canActivate: [AuthGuard] ,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full', canActivate: [AuthGuard] },
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
      { path: 'team', component: TeamComponent, canActivate: [AuthGuard] },
      {
        path: 'inbox',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('../../pages/admin/inbox/inbox.module').then(
            m => m.InboxModule
          )
      },
      {
        path: 'settings',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('../../pages/admin/settings/settings.module').then(
            m => m.SettingsModule
          )
      },
      { path: '**', redirectTo: "/404" },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminLayoutRoutingModule { }
