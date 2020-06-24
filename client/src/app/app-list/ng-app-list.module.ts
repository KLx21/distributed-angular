import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgAppListRoutingModule } from './ng-app-list-routing.module';
import { NgAppListComponent } from './ng-app-list.component';

@NgModule({
  imports: [
    CommonModule,
    NgAppListRoutingModule
  ],
  declarations: [
    NgAppListComponent
  ]
})
export class NgAppListModule {

}
