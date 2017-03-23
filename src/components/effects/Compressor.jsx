import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import { line, curveBundle } from "d3-shape"
import { scaleLinear, scaleLog, scalePow } from "d3-scale"
import { axisBottom, axisLeft } from "d3-axis"
import { select } from "d3-selection"

import { audioEffectNodes } from '../../utils/audio'
import { compressSample } from '../../utils/compressor'

import Item from '../Item.jsx'
import NumericInput from '../NumericInput.jsx'


const viewBoxWidth = 256
const viewBoxHeight = 256

const x = scaleLinear()
  .domain([-100, 0])
  .range([0, viewBoxWidth])
  .clamp(true)

const y = scaleLinear()
  .domain([-100, 0])
  .range([viewBoxHeight, 0])
  .clamp(true)
const compressionCurve = line()
  .x((d) => x(d.x) )
  .y((d) => y(d.y) )
  .curve(curveBundle.beta(1))

const params = {
  'attack': {
    unit: "s",
    format: "0.3s",
    min: 0,
    max: 1,
    step: 0.01
  },
  'release': {
    unit: "s",
    format: "0.3s",
    min: 0,
    max: 1,
    step: 0.01
  },
  'knee': {
    min: 0,
    max: 40,
    step: 1
  },
  'ratio': {
    unit: ":1",
    min: 1,
    max: 20,
    step: 0.1
  },
  'threshold': {
    min: -100,
    max: 0,
    step: 1
  }
}

const xAxis = axisBottom()
  .scale(x)
  .ticks(5, ".0s")
const yAxis = axisLeft()
  .scale(y)
  .ticks(5, ".0s")

class Compressor extends Component {
  componentDidMount () {
    const gridX = select(`#vis-${this.props.data.id} .grid-x`)
      .call(xAxis
        .tickSize(viewBoxHeight)
        .tickFormat("")
      )
      .selectAll('*')
        .attr('vector-effect', "non-scaling-stroke");
    const gridY = select(`#vis-${this.props.data.id} .grid-y`)
      .call(yAxis
        .tickSize(viewBoxWidth)
        .tickFormat("")
      )
      .selectAll('*')
        .attr('vector-effect', "non-scaling-stroke");
  }
	render() {
    const points = [
      -100,
      this.props.data.threshold - (this.props.data.knee / 2),
      this.props.data.threshold,
      this.props.data.threshold + (this.props.data.knee / 2),
      0
    ].map(x => ({x: x, y: compressSample(x, this.props.data.threshold, this.props.data.ratio, this.props.data.knee)}))
		return (
      <Item title="Compressor" type="audio" item={this.props.data}>
        <div className="compressor-container">
          <div class="vis">
            <svg class="vis-path" id={`vis-${this.props.data.id}`} viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}>
              <g class="grid grid-x" />
              <g class="grid grid-y"
                transform={`translate(${viewBoxWidth},0)`}
                />
              <path
                vector-effect="non-scaling-stroke"
                d={compressionCurve(points)}
                />
              {points.map(point => (
                <circle
                  vector-effect="non-scaling-stroke"
                  class="dot"
                  cx={x(point.x)}
                  cy={y(point.y)}
                  r="4"
                  />
              ))}
            </svg>
            <div class="flex-container">
              {["attack", "release"].map((el, i) => (
                <NumericInput
                  label={el}
                  class="tri small right"
                  id={`pan-${this.props.data.id}-${Math.floor(i * Math.random() * 1000)}`}
                  min={params[el].min}
                  max={params[el].max}
                  step={params[el].step}
                  unit={params[el].unit}
                  format={params[el].format}
                  value={this.props.data[el]}
                  action={{
                    type: 'UPDATE_EFFECT',
                    id: this.props.data.id,
                    property: el
                  }}
                  />
              ))}
            </div>
          </div>
          <div >
            {["threshold", "ratio", "knee"].map((el, i) => (
              <NumericInput
                label={el}
                id={`pan-${this.props.data.id}-${Math.floor(i * Math.random() * 1000)}`}
                min={params[el].min}
                max={params[el].max}
                step={params[el].step}
                value={this.props.data[el]}
                action={{
                  type: 'UPDATE_EFFECT',
                  id: this.props.data.id,
                  property: el
                }}
                />
            ))}
          </div>
        </div>
      </Item>
		)
	}
}

export default connect()(Compressor)
