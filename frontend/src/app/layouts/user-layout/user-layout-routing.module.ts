import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserLayoutComponent } from './user-layout.component';
import { HomeComponent } from 'src/app/pages/user/home/home.component';
import { SigninComponent } from 'src/app/pages/user/signin/signin.component';
import { SignupComponent } from 'src/app/pages/user/signup/signup.component';
import { ConfirmationComponent } from 'src/app/pages/user/confirmation/confirmation.component';
import { HelpComponent } from 'src/app/pages/user/help/help.component';
import { RouteGuard } from '../../guards/route.guard';
import { UnauthorizedComponent } from 'src/app/pages/user/unauthorized/unauthorized.component';
import { ForbiddenComponent } from 'src/app/pages/user/forbidden/forbidden.component';
import { PageNotFoundComponent } from '../../pages/user/page-not-found/page-not-found.component';
import { ServerErrorComponent } from '../../pages/user/server-error/server-error.component';
import { ResetPasswordComponent } from 'src/app/pages/user/reset-password/reset-password.component';
import { InvitationComponent } from 'src/app/pages/user/invitation/invitation.component';

const routes: Routes = [
  {
    path: '',
    component: UserLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'help', component: HelpComponent },
      { path: 'signin', component: SigninComponent, canActivate: [RouteGuard] },
      { path: 'signup', component: SignupComponent, canActivate: [RouteGuard] },
      { path: 'confirmation/:appId/:confirmationToken', component: ConfirmationComponent },
      { path: 'reset-password/:resetPasswordToken', component: ResetPasswordComponent },
      { path: 'invitation/:appId/:uniqueId', component: InvitationComponent },
      { path: '401', component: UnauthorizedComponent },
      { path: '403', component: ForbiddenComponent },
      { path: '404', component: PageNotFoundComponent },
      { path: '500', component: ServerErrorComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserLayoutRoutingModule { }
