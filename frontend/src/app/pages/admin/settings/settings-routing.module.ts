import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { BillingComponent } from './pages/billing/billing.component';
import { UsageComponent } from './pages/usage/usage.component';
import { AccountsComponent } from './pages/accounts/accounts.component';
import { AuthGuard } from '../../../guards/auth.guard';
const routes: Routes = [
  {
    path: '', component: SettingsComponent,
    canActivate: [AuthGuard] ,
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full', canActivate: [AuthGuard] },
      { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
      { path: 'billing', component: BillingComponent, canActivate: [AuthGuard] },
      { path: 'usage', component: UsageComponent, canActivate: [AuthGuard] },
      { path: 'accounts', component: AccountsComponent, canActivate: [AuthGuard] },
      { path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuard] },
      { path: '**', redirectTo: "/404" },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
