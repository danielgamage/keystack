import React, { useState, useEffect } from "react"
import { connect } from "react-redux"
import { startNote, stopNote } from "utils/notes"

import { select } from "d3-selection"
import { axisLeft } from "d3-axis"
import { scaleLinear } from "d3-scale"
import { radialLine } from "d3-shape"
import { range } from "d3-array"

import { NumericInput } from "components"
import { keys, noteForIndex } from "utils"
import styled from "styled-components"

const StyledRadialKeys = styled.div`
  #chart {
    margin-bottom: 2rem;
    svg {
      stroke-width: inherit;
      width: 100%;
      height: 100%;
      stroke-linecap: butt;
    }
  }
  .play-area,
  .settings {
    width: calc((100% - 2rem) / 2);
  }

  .axis {
    & text {
      font-size: 13px;
      fill: var(--fg-3);
    }
  }
  circle.tick {
    fill: var(--bg-recessed);
    stroke-dasharray: 2 3;
  }
  path.spiral {
    fill: none;
    transition: 0.3s ease-out;
    &.black {
      stroke: var(--grey-11);
    }
    &.white {
      stroke: var(--grey-0);
    }
    &.on {
      transition: 0s ease;
      stroke: var(--accent);
    }
  }
`

const RadialKeys = (props) => {
  const [columnCount, setColumnCount] = useState(12)

  useEffect(() => {
    var width = 400, // px
      height = 400, // px
      tick_axis = 1,
      start = 0,
      end = 7 // wtf is this number

    // offset from center so there's less curl in the center
    var radius = scaleLinear()
      .domain([start, end])
      .range([0, Math.min(width, height) / 2 - 25])

    var angle = scaleLinear().domain([0, columnCount]).range([0, 360])

    select("#chart").html("")

    var svg = select("#chart")
      .append("svg")
      .attr("class", "radial-keys")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")

    svg
      .selectAll("circle.tick")
      .data(range(end, start, (start - end) / 8))
      .enter()
      .append("circle")
      .attr("class", "tick")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", function (d) {
        return radius(d)
      })

    if (columnCount === 12) {
      function radial_tick(selection) {
        selection.each(function (axis_num) {
          axisLeft(radius)
            .ticks(5)
            .tickValues(axis_num === tick_axis ? null : [])

          select(this)
            .selectAll("text")
            .attr("text-anchor", "bottom")
            .attr("transform", "rotate(" + angle(axis_num) + ")")
        })
      }

      svg
        .selectAll(".axis")
        .data(range(columnCount))
        .enter()
        .append("g")
        .attr("class", "axis")
        .attr("transform", function (d) {
          return "rotate(" + -angle(d) + ")"
        })
        .call(radial_tick)
        .append("text")
        .attr("y", radius(end) + 24)
        .text(function (d, i) {
          return noteForIndex(i)
        })
        .attr("text-anchor", "middle")
        .attr("transform", function (d) {
          return "rotate(" + (180 - 360 / columnCount / 2) + ")"
        })
    }

    keys.forEach((el, i) => {
      var index = i / columnCount + 2
      var newEnd = index + 1 / columnCount
      var pieces = range(
        index,
        newEnd,
        (newEnd - index) / (newEnd * columnCount)
      )
      // var r = end * 5

      var theta = function (r) {
        return -2 * Math.PI * r
      }

      var radius2 = scaleLinear()
        .domain([start, end])
        .range([0, Math.min(width, height) / ((1 / columnCount) * 12 * 3.5)])

      var spiral = radialLine().angle(theta).radius(radius2)

      svg
        .selectAll(`.spiral.spiral-${i}`)
        .data([el])
        .enter()
        .append("path")
        .attr("data-index", () => i)
        .attr(
          "class",
          (d) => `spiral spiral-${i} ${d.black ? "black" : "white"}`
        )
        .attr("d", (d) => spiral(pieces))
    })

    const radialKeys = document.querySelector(".radial-keys")
    radialKeys.addEventListener("mousedown", interact)
    radialKeys.addEventListener("touchstart", interact)
  }, [columnCount])

  useEffect(() => {
    ;[...document.querySelectorAll(`.spiral.on`)].forEach((note) => {
      note.classList.remove("on")
    })
    props.notes[props.midiReadPosition].forEach((note) => {
      document.querySelector(`.spiral-${note.index}`).classList.add("on")
    })
  }, [props.notes])

  const interact = (event) => {
    if ([...event.target.classList].includes("spiral")) {
      radialNoteOn(event)
    }

    event.preventDefault()
    ;[...document.querySelectorAll(".spiral")].forEach((el, i) => {
      el.addEventListener("mousemove", radialNoteOn)
      el.addEventListener("mouseleave", radialNoteOff)
      el.addEventListener("mouseup", radialNoteOff)
      el.addEventListener("touchmove", radialNoteOn)
      el.addEventListener("touchcancel", radialNoteOff)
      el.addEventListener("touchend", radialNoteOff)
    })

    window.addEventListener("mouseup", unBind)
    window.addEventListener("mouseleave", unBind)
    window.addEventListener("touchend", unBind)
  }

  const unBind = (event) => {
    ;[...document.querySelectorAll(".spiral")].forEach((el, i) => {
      el.removeEventListener("mousemove", radialNoteOn)
      el.removeEventListener("mouseleave", radialNoteOff)
      el.removeEventListener("mouseup", radialNoteOff)
      el.removeEventListener("touchmove", radialNoteOn)
      el.removeEventListener("touchcancel", radialNoteOff)
      el.removeEventListener("touchend", radialNoteOff)
    })
  }

  const radialNoteOn = (e) => {
    startNote(keys[e.target.getAttribute("data-index")])
  }

  const radialNoteOff = (e) => {
    stopNote(keys[e.target.getAttribute("data-index")])
  }

  return (
    <StyledRadialKeys>
      <NumericInput
        label={"columns"}
        min={3}
        max={16}
        step={1}
        viz="bar"
        value={columnCount}
        onInput={setColumnCount}
      />
      <div id="chart" style={{ strokeWidth: `${(columnCount / 12) * 15}px` }} />
    </StyledRadialKeys>
  )
}

function mapStateToProps(state) {
  return { notes: state.notes, view: state.view }
}

export default connect(mapStateToProps)(RadialKeys)
