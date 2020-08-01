import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { ForceDirectedGraphComponent } from './develar-commons/d3/force-directed-graph/force-directed-graph.component';
import { ForceDirectedGraphSVGComponent } from './develar-commons/d3/force-directed-graph-svg/force-directed-graph-svg.component';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent, ForceDirectedGraphComponent, ForceDirectedGraphSVGComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
