import { AfterContentInit, AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'tci-root',
  templateUrl: './ng-app.component.html',
  styleUrls: [
    './ng-app.component.less'
  ]
})
export class NgAppComponent implements OnInit, AfterContentInit {

  renderTime: string;

  constructor() {}

  ngOnInit() {}

  ngAfterContentInit() {
    this.renderTime = new Date().toLocaleString();
  }
}
