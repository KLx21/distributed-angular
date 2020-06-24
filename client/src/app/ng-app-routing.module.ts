import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoDashStatic } from 'lodash';

declare var _: LoDashStatic;
declare var window: any;

@NgModule({
  imports: [
    RouterModule.forRoot(getAllRoutes())
  ],
  exports: [
    RouterModule
  ]
})
export class NgAppRoutingModule {}

function getAllRoutes(): Routes {
  let routes: Routes = [
    {
      path: '',
      pathMatch: 'full',
      redirectTo: ''
    },
    {
      path: 'app-list',
      loadChildren: () => import('./app-list/ng-app-list.module').then(mod => mod.NgAppListModule)
    }
  ];

  if (window.additionalRoutes && window.additionalRoutes.length > 0) {
    routes = _.uniqBy(routes.concat(window.additionalRoutes), 'path');
  }

  return routes;
}
