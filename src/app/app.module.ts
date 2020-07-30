import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { ForceDirectedGraphComponent } from './develar-commons/d3/force-directed-graph/force-directed-graph.component';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent, ForceDirectedGraphComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
