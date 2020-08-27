import { AfterContentInit, Component, OnInit } from '@angular/core';
import { NgAppsService } from './shared/ng-services/ng-apps.service';

@Component({
  selector: 'app-root',
  templateUrl: './ng-app.component.html',
  styleUrls: [
    './ng-app.component.less'
  ]
})
export class NgAppComponent implements OnInit, AfterContentInit {

  renderTime: string;

  constructor(
    private appsService: NgAppsService
  ) {}

  ngOnInit() {}

  ngAfterContentInit() {
    this.renderTime = new Date().toLocaleString();
  }
}
