import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import { audioEffectNodes } from '../../utils/audio'

import { line, curveCatmullRom } from "d3-shape"
import { scaleLinear, scaleLog, scalePow } from "d3-scale"
import { axisBottom } from "d3-axis"
import { select } from "d3-selection"


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
  .domain([-3, 3])
  .range([viewBoxHeight, 0])
  .clamp(true)
const envelopePath = line()
  .x((d) => x(d.x) )
  .y((d) => y(d.y) )
  .curve(curveCatmullRom)

const xAxis = axisBottom()
  .scale(x)
  .ticks(3, ".1s")

class Filter extends Component {
  componentDidMount() {
    const axis = select(`#vis-${this.props.data.id} .axis-x`)
      .call(xAxis.tickSize('5'))
      .selectAll('*')
        .attr('vector-effect', "non-scaling-stroke")
    const grid = select(`#vis-${this.props.data.id} .grid`)
      .call(xAxis
        .tickSize(viewBoxHeight)
        .tickFormat("")
      )
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
    const filterNode = audioEffectNodes[this.props.data.id]
    filterNode.getFrequencyResponse(
      myFrequencyArray,
      magResponseOutput,
      phaseResponseOutput
    )
    const magnitudePoints = [...magResponseOutput].map((response, i) => ({x: myFrequencyArray[i], y: response}))
    const phasePoints = [...phaseResponseOutput].map((response, i) => ({x: myFrequencyArray[i], y: response}))

		return (
      <div class="item effect-item">
        <header>
          <h3 class="title">Filter</h3>
          <div className="select">
            <select
              onChange={(e) => {
                this.props.dispatch({
                  type: 'UPDATE_FILTER',
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
          </div>
        </header>
        <svg class="vis-path" id={`vis-${this.props.data.id}`} viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}>
          <g class="grid" />
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
              scale={param.scale}
              value={this.props.data[param.name]}
              action={{
                type: 'UPDATE_FILTER',
                id: this.props.data.id,
                property: param.name
              }}
              />
          ))}
        </div>
      </div>
		)
	}
}

export default connect()(Filter)
