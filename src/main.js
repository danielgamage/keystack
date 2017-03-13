import {inc, dec} from './actions'
import * as d3 from "d3"
import {keys} from './utils'

const body = document.body

var width = 400,
    height = 430,
    num_axes = 12,
    tick_axis = 1,
    start = 0,
    end = 4;

var theta = function(r) {
  return -2*Math.PI*r;
};

var arc = d3.arc()
  .startAngle(0)
  .endAngle(2*Math.PI);

// offset from center so there's less curl in the center
var radius = d3.scaleLinear()
  .domain([start, end])
  .range([30, d3.min([width,height])/2-20]);

var angle = d3.scaleLinear()
  .domain([0,num_axes])
  .range([0,360])

var svg = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width/2 + "," + (height/2+8) +")");

var pieces = d3.range(start, end+0.001, (end-start)/(end*12));

var spiral = d3.radialLine()
  .angle(theta)
  .radius(radius);

svg.selectAll("circle.tick")
    .data(d3.range(end,start,(start-end)/4))
  .enter().append("circle")
    .attr("class", "tick")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", function(d) { return radius(d); })

svg.selectAll(".axis")
    .data(d3.range(num_axes))
  .enter().append("g")
    .attr("class", "axis")
    .attr("transform", function(d) { return "rotate(" + -angle(d) + ")"; })
  .call(radial_tick)
  .append("text")
    .attr("y", radius(end)+13)
    .text(function(d) { return angle(d) + "°"; })
    .attr("text-anchor", "middle")
    .attr("transform", function(d) { return "rotate(" + -90 + ")" })

svg.selectAll(".spiral")
    .data([pieces])
  .enter().append("path")
    .attr("class", "spiral")
    .attr("d", spiral)
    .attr("transform", function(d) { return "rotate(" + 90 + ")" });

function radial_tick(selection) {
  selection.each(function(axis_num) {
    d3.axisLeft(radius)
      .ticks(5)
      .tickValues( axis_num == tick_axis ? null : [])

    d3.select(this)
      .selectAll("text")
      .attr("text-anchor", "bottom")
      .attr("transform", "rotate(" + angle(axis_num) + ")")
  });
}
