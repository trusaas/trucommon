import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./layouts/user-layout/user-layout.module').then(
        m => m.UserLayoutModule
      )
  },
  {
    path: 'index',
    loadChildren: () =>
      import('./layouts/user-layout/user-layout.module').then(
        m => m.UserLayoutModule
      )
  },
  {
    path: 'a/:appId',
    loadChildren: () =>
      import('./layouts/admin-layout/admin-layout.module').then(
        m => m.AdminLayoutModule
      )
  },
  {
    path: '**',
    redirectTo: '404'
  }
];
const routerOptions: ExtraOptions = {
  useHash: false,
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled',
  scrollOffset: [0, 64],
};
@NgModule({
  imports: [RouterModule.forRoot(routes,routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
