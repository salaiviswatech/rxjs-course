import { Component, OnInit } from '@angular/core';
import { timer, of, concat } from 'rxjs';
import { createHttpObservable } from './utils/utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  ngOnInit() {



  }

}
