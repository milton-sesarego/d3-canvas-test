import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import data from './data.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'd3-canvas-test';
  public showGraph = true;
  public asistenciasList: any[];

  public changeCity$ = new BehaviorSubject<string>('no_definido');

  constructor(){
    this.asistenciasList = data;
    // console.log(data)
  }


}
