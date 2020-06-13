import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { LoDashStatic } from 'lodash';

declare const lodash: LoDashStatic;

@NgModule({
  imports: [
    RouterModule.forRoot(NgAppRoutingModule.getRoutesFromMicroservices(), {
      useHash: false,
      initialNavigation: true,
      enableTracing: false
    })
  ],
  exports: [
    RouterModule
  ]
})
export class NgAppRoutingModule {

  /**
   * Use routes found by loadMicroservicesUI
   * from ng2 moduleConfig.json files
   */
  public static getRoutesFromMicroservices(): Route[] {
    let routes: Route[] = [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'applications'
      }
    ];

    if ((<any>window).ng2Routes && (<any>window).ng2Routes.length > 0) {
      routes = routes.concat(lodash.map((<any>window).ng2Routes, NgAppRoutingModule.guardRoute));
    }

    return routes;
  }

  private static guardRoute(route: Route) {
    return route;
  }
}
