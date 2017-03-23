import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import { audioEffectNodes } from '../../utils/audio'

import { line, curveCatmullRom } from "d3-shape"
import { scaleLinear, scaleLog, scalePow } from "d3-scale"
import { axisBottom, axisLeft } from "d3-axis"
import { select } from "d3-selection"

import Item from '../Item.jsx'
import NumericInput from '../NumericInput.jsx'

const filterTypes = [
  { name: "lowpass",   frequency: true, q: true,  gain: false },
  { name: "highpass",  frequency: true, q: true,  gain: false },
  { name: "bandpass",  frequency: true, q: true,  gain: false },
  { name: "lowshelf",  frequency: true, q: false, gain: true  },
  { name: "highshelf", frequency: true, q: false, gain: true  },
  { name: "peaking",   frequency: true, q: true,  gain: true  },
  { name: "notch",     frequency: true, q: true,  gain: false },
  { name: "allpass",   frequency: true, q: true,  gain: false },
]

const parameters = [
  { name: "frequency",
    unit: "hz",
    format: ".3s",
    min: 30,
    max: 22000,
    step: 0.01,
    scale: 10
  },
  { name: "q",
    min: 0.1,
    max: 18,
    step: 0.1,
    scale: Math.E
  },
  { name: "gain",
    unit: "dB",
    min: -15,
    max: 15,
    step: 0.1,
    scale: 1
  }
]

const viewBoxWidth = 256
const viewBoxHeight = 64
const frequencyBars = 1024
const minHz = 30
const maxHz = 22000

const mapFreq = scalePow()
  .exponent(5)
  .domain([
    0,
    frequencyBars
  ])
  .range([
    minHz,
    maxHz
  ])

const x = scaleLog()
  .domain([minHz, maxHz])
  .range([0, viewBoxWidth])
const y = scaleLinear()
  .domain([-1, 3])
  .range([viewBoxHeight, 0])
  .clamp(true)
const envelopePath = line()
  .x((d) => x(d.x) )
  .y((d) => y(d.y) )
  .curve(curveCatmullRom)

const xAxis = axisBottom()
  .scale(x)
  .ticks(3, ".1s")
const yAxis = axisLeft()
  .scale(y)
  .ticks(5, ".1s")

class Filter extends Component {
  componentDidMount() {
    const axis = select(`#vis-${this.props.data.id} .axis-x`)
      .call(xAxis.tickSize('5'))
      .selectAll('*')
        .attr('vector-effect', "non-scaling-stroke")
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
      .attr('transform', `translate(${viewBoxWidth},0)`)
      .selectAll('*')
        .attr('vector-effect', "non-scaling-stroke");
  }
	render() {
    var myFrequencyArray = new Float32Array(frequencyBars);
    for(var i = 0; i < frequencyBars; ++i) {
      myFrequencyArray[i] = mapFreq(i)
    }

    var magResponseOutput = new Float32Array(frequencyBars) // magnitude
    var phaseResponseOutput = new Float32Array(frequencyBars)
    const filterNode = audioEffectNodes.find(el => el.id === this.props.data.id).node
    filterNode.getFrequencyResponse(
      myFrequencyArray,
      magResponseOutput,
      phaseResponseOutput
    )
    const magnitudePoints = [...magResponseOutput].map((response, i) => ({x: myFrequencyArray[i], y: response}))
    const phasePoints = [...phaseResponseOutput].map((response, i) => ({x: myFrequencyArray[i], y: response}))

		return (
      <Item title="Filter" type="audio" item={this.props.data}
        headerChildren={<div className="select">
                    <select
                      onChange={(e) => {
                        this.props.dispatch({
                          type: 'UPDATE_EFFECT',
                          id: this.props.data.id,
                          property: 'type',
                          value: e.target.value
                        })
                      }}
                      >
                      {filterTypes.map(type => (
                        <option value={type.name}>{type.name}</option>
                      ))}
                    </select>
                  </div>}>
        <svg class="vis-path" id={`vis-${this.props.data.id}`} viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}>
          <g class="grid grid-x" />
          <g class="grid grid-y" />
          <path
            class="filter-phase"
            vector-effect="non-scaling-stroke"
            d={envelopePath(phasePoints)}
            />
          <path
            class="filter-magnitude"
            vector-effect="non-scaling-stroke"
            d={envelopePath(magnitudePoints)}
            />
          <g
            class="graph-axis axis-x"
            transform={`translate(0,${viewBoxHeight})`}
            />
        </svg>
        <div class="flex-container">
          {parameters.map(param => (
            <NumericInput
              label={param.name}
              class="tri"
              disabled={!filterTypes.find(el => el.name === this.props.data.type)[param.name]}
              id={param.name}
              min={param.min}
              max={param.max}
              step={param.step}
              unit={param.unit}
              format={param.format}
              scale={param.scale}
              value={this.props.data[param.name]}
              action={{
                type: 'UPDATE_EFFECT',
                id: this.props.data.id,
                property: param.name
              }}
              />
          ))}
        </div>
      </Item>
		)
	}
}

export default connect()(Filter)
