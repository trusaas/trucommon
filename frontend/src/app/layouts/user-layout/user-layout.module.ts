import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserLayoutRoutingModule } from './user-layout-routing.module';
import { HomeComponent } from '../../pages/user/home/home.component';
import { HelpComponent } from '../../pages/user/help/help.component';
import { SigninComponent } from '../../pages/user/signin/signin.component';
import { SignupComponent } from '../../pages/user/signup/signup.component';
import { ConfirmationComponent } from '../../pages/user/confirmation/confirmation.component';
import { UserLayoutComponent } from './user-layout.component';
import { SimpleFormCommonNzModule } from 'src/app/shared/modules/simple-form-common-nz.module';
import { UnauthorizedComponent } from '../../pages/user/unauthorized/unauthorized.component';
import { ForbiddenComponent } from '../../pages/user/forbidden/forbidden.component';
import { PageNotFoundComponent } from '../../pages/user/page-not-found/page-not-found.component';
import { ServerErrorComponent } from '../../pages/user/server-error/server-error.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { PrivacyComponent } from '../../pages/user/home/components/privacy/privacy.component';
import { FeaturesComponent } from '../../pages/user/home/components/features/features.component';
import { PricingComponent } from '../../pages/user/home/components/pricing/pricing.component';
import { GrowthComponent } from '../../pages/user/home/components/growth/growth.component';
import { BannerComponent } from '../../pages/user/home/components/banner/banner.component';
import { GetStartedComponent } from '../../pages/user/home/components/get-started/get-started.component';
import { ResetPasswordComponent } from '../../pages/user/reset-password/reset-password.component';
import { InvitationComponent } from '../../pages/user/invitation/invitation.component';
@NgModule({
  declarations: [
    UserLayoutComponent,
    HomeComponent,
    HelpComponent,
    SigninComponent,
    SignupComponent,
    ConfirmationComponent,
    UnauthorizedComponent,
    ForbiddenComponent,
    PageNotFoundComponent,
    ServerErrorComponent,
    PrivacyComponent,
    FeaturesComponent,
    PricingComponent,
    GrowthComponent,
    BannerComponent,
    GetStartedComponent,
    ResetPasswordComponent,
    InvitationComponent,
  ],
  imports: [
    CommonModule,
    UserLayoutRoutingModule,
    SimpleFormCommonNzModule,
    NzLayoutModule
  ],
  exports:[]
})
export class UserLayoutModule { }
