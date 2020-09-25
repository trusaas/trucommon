import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { ProfileComponent } from './pages/profile/profile.component';
import { AccountsComponent } from './pages/accounts/accounts.component';
import { BillingComponent } from './pages/billing/billing.component';
import { UsageComponent } from './pages/usage/usage.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';


@NgModule({
  declarations: [ProfileComponent, AccountsComponent, BillingComponent, UsageComponent, ChangePasswordComponent],
  imports: [
    CommonModule,
    SettingsRoutingModule
  ]
})
export class SettingsModule { }
