import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NgAppListComponent } from './ng-app-list.component';

const routes: Routes = [
  {
    path: '',
    component: NgAppListComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class NgAppListRoutingModule {}
