import { h, Component } from 'preact';
import { connect } from 'preact-redux';

import { select, selectAll } from "d3-selection"
import { axisLeft } from "d3-axis"
import { scaleLinear } from "d3-scale"
import { radialLine } from "d3-shape"
import { range } from "d3-array"

import { keys, noteForIndex } from '../utils'

class RadialKeys extends Component {
  componentDidMount() {
    var width = 400,
        height = 400,
        num_axes = 12,
        tick_axis = 1,
        start = 0,
        end = 7

    // offset from center so there's less curl in the center
    var radius = scaleLinear()
      .domain([start, end])
      .range([0, Math.min(width,height) / 2 - 25]);

    var angle = scaleLinear()
      .domain([0,num_axes])
      .range([0,360])

    var svg = select("#chart").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", `0 0 ${width} ${height}`)
      .append("g")
        .attr("transform", "translate(" + width/2 + "," + (height/2) +")");

    svg.selectAll("circle.tick")
        .data(range(end,start,(start-end) / 8))
      .enter().append("circle")
        .attr("class", "tick")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", function(d) { return radius(d); })

    svg.selectAll(".axis")
        .data(range(num_axes))
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

    function radial_tick(selection) {
      selection.each(function(axis_num) {
        axisLeft(radius)
          .ticks(5)
          .tickValues( axis_num == tick_axis ? null : [])

        select(this)
          .selectAll("text")
          .attr("text-anchor", "bottom")
          .attr("transform", "rotate(" + angle(axis_num) + ")")
      });
    }

    keys.map((el, i) => {
      var index = i/12 + 2
      var newEnd = index + 1/12
      var pieces = range(index, newEnd, (newEnd-index)/(newEnd*12))
      var r = end * 5

      var theta = function(r) {
    	  return -2*Math.PI*r
    	}

      var radius2 = scaleLinear()
        .domain([start, end])
        .range([0, Math.min(width, height) / 3.5]);

    	var spiral = radialLine()
    	  .angle(theta)
    	  .radius(radius2)

      svg.selectAll(`.spiral.spiral-${i}`)
    	    .data([el])
    	  .enter().append("path")
    	    .attr("class", (d) => `spiral spiral-${i} ${(d.black) ? "black" : "white"}`)
    	    .attr("d", (d) => spiral(pieces))
    })
  }
  componentWillReceiveProps(nextProps) {
    [...document.querySelectorAll(`.spiral.on`)].map(note => {
      note.classList.remove('on')
    })
    nextProps.notes.map(note => {
      document.querySelector(`.spiral-${note.index}`)
        .classList.add('on')
    })
  }
	render() {
		return (
      <div id="chart"></div>
		);
	}
}

function mapStateToProps (state) {
  return { notes: state.notes, view: state.view }
}

export default connect(mapStateToProps)(RadialKeys)
