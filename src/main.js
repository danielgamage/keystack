import {inc, dec} from './actions'
import * as d3 from "d3"
import {keys, noteForIndex} from './utils'

const body = document.body

var width = 400,
    height = 430,
    num_axes = 12,
    tick_axis = 1,
    start = 0,
    end = 4,
    r = 2

var theta = function(r) {
  return -2*Math.PI*r;
};

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
    .attr("viewBox", `0 0 ${width} ${height}`)
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
    .attr("y", radius(end)+24)
    .text(function(d,i) {
      return noteForIndex(i)
    })
    .attr("text-anchor", "middle")
    .attr("transform", function(d) { return "rotate(" + (180 - (360/12/2)) + ")" })

keys.map((el, i) => {
  // d3.range(start, end+0.001, (end-start)/(end*12));
  var index = i/12 + 2
  var newEnd = index + 1/12
  var pieces2 = d3.range(index, newEnd, (newEnd-index)/(newEnd*12))
  var r2 = end * 5

  var theta2 = function(r2) {
	  return -2*Math.PI*r2
	}
	// var radius2 = d3.scaleLinear()
	//   .domain([start, end])
	//   .range([4, 4*r2])
  var radius2 = d3.scaleLinear()
    .domain([start, end])
    .range([0, d3.min([width,height])/3.5]);

	var spiral2 = d3.radialLine()
	  .angle(theta2)
	  .radius(radius2)

  svg.selectAll(`.spiral.spiral-${i}`)
	    .data([el])
	  .enter().append("path")
	    .attr("class", (d) => `spiral spiral-${i} ${(d.black) ? "black" : "white"}`)
	    .attr("d", (d) => spiral2(pieces2))
})

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

var context = new AudioContext(),
    masterVolume = context.createGain();

masterVolume.gain.value = 0.3;
masterVolume.connect(context.destination);

var oscillators = {};

window.addEventListener("keydown", (e) => {
  const note = keys.filter((el) => (el.qwerty === e.key))[3]
  // console.log(oscillators)
  startNote(note, note.freq)
})
window.addEventListener("keyup", (e) => {
  const note = keys.filter((el) => (el.qwerty === e.key))[3]
  stopNote(note, note.freq)
})

const stopNote = (note, frequency) => {
  oscillators[frequency].forEach((oscillator) => {
    console.log(oscillator)
    oscillator.stop(context.currentTime);
  });
  document.querySelector(`.spiral-${note.index}`)
    .style.stroke = null;
}
const startNote = (note, frequency) => {
  console.log(note.index)
  document.querySelector(`.spiral-${note.index}`)
    .style.stroke = "red";
  var osc = context.createOscillator(),
    osc2 = context.createOscillator();

  osc.frequency.value = frequency;
  osc.type = 'sawtooth';

  osc2.frequency.value = frequency;
  osc2.type = 'triangle';

  osc.connect(masterVolume);
  osc2.connect(masterVolume);

  masterVolume.connect(context.destination);

  oscillators[frequency] = [osc, osc2];

  osc.start(context.currentTime);
  osc2.start(context.currentTime);
}
