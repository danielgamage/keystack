import {inc, dec} from './actions'
import * as d3 from "d3"

const body = document.body

// const row = body.append("div")
//   .attr("class", "row")
// .append("div")
//   .attr("class", "container")
//
// row.data(el)
//
// const pieChart = row.append("svg")
//     .attr("class", `pie ${el.name}`)
//     .attr("width",  128)
//     .attr("height", 128)
//     .attr("viewBox", `0 0 128 128`)
// const arcs =  d3.pie()([...el.interpolations].map(interpolation => interpolation.weight))
// arcs.map((arc, arcIndex) => {
//   const arcRendered = d3.arc()
//     .innerRadius(48)
//     .outerRadius(64)
//     .cornerRadius(2)
//     .padAngle(.03)
//     .startAngle(arc.startAngle)
//     .endAngle(arc.endAngle)
//
//   pieChart.append("path")
//       .attr("d", arcRendered)
//       .attr("class", "arc")
//       .attr("transform", "translate(64, 64)")
//       .attr("fill", getColor(i, arcs.length, 90 - arcIndex * 40 / arcs.length))
//
// })
