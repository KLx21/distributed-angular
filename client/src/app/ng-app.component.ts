import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'tci-root',
  templateUrl: './ng-app.component.html',
  styleUrls: [
    './ng-app.component.less'
  ]
})
export class NgAppComponent implements OnInit, AfterViewInit {

  renderTime: string;

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.renderTime = new Date().toLocaleString();
  }
}
