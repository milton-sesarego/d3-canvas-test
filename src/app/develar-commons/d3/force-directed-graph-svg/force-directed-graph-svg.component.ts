import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';

import * as d3 from 'd3';

@Component({
  selector: 'force-directed-graph-svg',
  templateUrl: './force-directed-graph-svg.component.html',
  styleUrls: ['./force-directed-graph-svg.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class ForceDirectedGraphSVGComponent implements OnInit {
  @Input() data: Array<any> = [];
  @Input() parameter$: Observable<string>;
  public showGraph = true;
  private defaultView = true;
  public chart: any;
  private actualParam = 'no_definido';
  links: any;
  nodes: any;
  simulation: any;
  invalidation: any;
  link: any;
  node: any;
  svg: any;
  types = ['licensing', 'suit', 'resolved']
  height = 3500;
  width = 2400;
  color: any;

  constructor() { }

  ngOnInit() {
    this.color = d3.scaleOrdinal(d3.schemeCategory10)
    if (this.parameter$){
      this.parameter$.subscribe(param => {
        this.refreshGraph(param);
      });
    }
  }

  private resetGraph(){
    if (this.defaultView){
      this.height = 2500;
      this.width =  1900;
    }else {
      this.height = 1200;
      this.width =  1200;
    }

    this.simulation = d3.forceSimulation(this.nodes)
      .force("link", d3.forceLink( this.links).id( d => d['id']) )
      .force("charge", d3.forceManyBody().strength(-300))
      //.force("center", d3.forceCenter(this.width/2, this.height/2));
      .force("x", d3.forceX())
      .force("y", d3.forceY());

    this.svg = d3.select('#graph').select('svg')
      .attr("viewBox", `${-this.width / 2} ${-this.height / 2} ${ this.width} ${this.height}`)
      .style("font", "20px sans-serif");

    // Per-type markers, as they don't inherit styles.
    this.svg.append("defs").selectAll("marker")
      .data(this.types)
      .join("marker")
      .attr("id", d => `arrow-${d}`)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 15)
      .attr("refY", -0.5)
      .attr("markerWidth", 12)
      .attr("markerHeight", 12)
      .attr("orient", "auto")
      .append("path")
      .attr("fill", this.color)
      .attr("d", "M0,-5L10,0L0,5");

    this.link = this.svg.append("g")
      .attr("fill", "none")
      .attr("stroke-width", 1.5)
      .selectAll("path")
      .data(this.links)
      .join("path")
      .attr("stroke", d => this.color(d.type))
      .attr("marker-end", d => `url(${new URL(`#arrow-${d.type}`, "http://develar-local.co:4200/salud/gestion/reportesvigilancia")})`);

    this.node = this.svg.append("g")
      .attr("fill", "currentColor")
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .selectAll("g")
      .data(this.nodes)
      .join("g")
      .call(this.drag(this.simulation));

    this.node.append("circle")
      .attr("stroke", "white")
      .attr("stroke-width", 1.5)
      .attr("r", 4);

    this.node.append("text")
      .attr("x", 8)
      .attr("y", "0.31em")
      .text(d => d.id)
      .clone(true).lower()
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-width", 3);

    this.simulation.on("tick", () => {
      this.link.attr("d", this.linkArc);
      this.node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    //this.invalidation.then(() => this.simulation.stop());
    //return this.svg.node();
  }

  drag(simulation){
    const dragstarted = function(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

    const dragged = function(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    const dragended = function(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  }

  linkArc(d) {
    const r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
    return `
        M${d.source.x},${d.source.y}
        A${r},${r} 0 0,1 ${d.target.x},${d.target.y}
        `;
  }

  private refreshGraph(param){
    this.showGraph = false;
    if(! (this.data && this.data.length)) return;
    this.types = Array.from(new Set( this.data.map(d=> d['type']) ));
    let _source;
    if(param === 'no_definido'){
      _source = this.data;
      this.defaultView = true;
    } else {
      this.defaultView = false;
      _source = this.data.filter(token => {
        return token.type === param;
      })
    }
    let _nodes = Array.from(new Set( _source.flatMap(l => [l.source, l.target])), id =>({ id }) )
    this.nodes = _nodes.map(d => Object.create(d));
    this.links = _source.map(d => Object.create(d));
    this.showGraph = true;
    this.resetGraph()
  }
}
