import React, { Component } from 'react'
import { connect } from 'react-redux'

import { audioEffectNodes } from '@/utils/audio'

import { line, curveCatmullRom } from 'd3-shape'
import { scaleLinear, scaleLog, scalePow } from 'd3-scale'
import { axisBottom, axisLeft } from 'd3-axis'
import { select } from 'd3-selection'
import { format } from 'd3-format'

import {
  NumericInput,
  Item,
} from '@/components'

const filterTypes = [
  { name: 'lowpass', frequency: true, q: true, gain: false, mix: true },
  { name: 'highpass', frequency: true, q: true, gain: false, mix: true },
  { name: 'bandpass', frequency: true, q: true, gain: false, mix: true },
  { name: 'lowshelf', frequency: true, q: false, gain: true, mix: true },
  { name: 'highshelf', frequency: true, q: false, gain: true, mix: true },
  { name: 'peaking', frequency: true, q: true, gain: true, mix: true },
  { name: 'notch', frequency: true, q: true, gain: false, mix: true },
  { name: 'allpass', frequency: true, q: true, gain: false, mix: true }
]

const parameters = [
  { name: 'frequency',
    unit: 'hz',
    format: '.3s',
    min: 30,
    max: 20000,
    step: 0.01,
    scale: 10
  },
  { name: 'q',
    unit: '',
    format: '',
    min: 0.1,
    max: 18,
    step: 0.1,
    scale: Math.E
  },
  { name: 'gain',
    format: '',
    unit: 'dB',
    min: -15,
    max: 15,
    step: 0.1,
    scale: 1
  },
  { name: 'mix',
    format: '',
    unit: '%',
    min: 0,
    max: 100,
    step: 1,
    scale: 1
  }
]

class Filter extends Component {
  constructor (props) {
    super(props)
    this.viewBoxWidth = 256
    this.viewBoxHeight = 64
    this.frequencyBars = 1024
    this.minHz = 30
    this.maxHz = 20000

    this.mapFreq = scalePow()
      .exponent(5)
      .domain([0, this.frequencyBars])
      .range([this.minHz, this.maxHz])

    this.x = scaleLog()
      .domain([this.minHz, this.maxHz])
      .range([0, this.viewBoxWidth])
    this.y = scaleLinear()
      .domain([-6, 6])
      .range([this.viewBoxHeight, 0])
    this.envelopePath = line()
      .x((d) => this.x(d.x))
      .y((d) => this.y(d.y))
      .curve(curveCatmullRom)

    this.xAxis = axisBottom()
      .scale(this.x)
      .ticks(3, '.1s')
    this.yAxis = axisLeft()
      .scale(this.y)
      .ticks(5, '.1s')
  }
  componentDidMount () {
    const axis = select(`#vis-${this.props.data.id} .axis-x`)
      .call(this.xAxis.tickSize('5'))
      .selectAll('*')
        .attr('vector-effect', 'non-scaling-stroke')
    const gridX = select(`#vis-${this.props.data.id} .grid-x`)
      .call(this.xAxis
        .tickSize(this.viewBoxHeight)
        .tickFormat('')
      )
    .selectAll('*')
    .attr('vector-effect', 'non-scaling-stroke')
    const gridY = select(`#vis-${this.props.data.id} .grid-y`)
      .call(this.yAxis
        .tickSize(this.viewBoxWidth)
        .tickFormat('')
      )
      .attr('transform', `translate(${this.viewBoxWidth}, 0)`)
    .selectAll('*')
      .attr('vector-effect', 'non-scaling-stroke')
  }
  render () {
    var myFrequencyArray = new Float32Array(this.frequencyBars)
    for (var i = 0; i < this.frequencyBars; ++i) {
      myFrequencyArray[i] = this.mapFreq(i)
    }

    var magResponseOutput = new Float32Array(this.frequencyBars) // magnitude
    var phaseResponseOutput = new Float32Array(this.frequencyBars)
    const filterNode = audioEffectNodes.find(el => el.id === this.props.data.id).filter
    filterNode.getFrequencyResponse(
      myFrequencyArray,
      magResponseOutput,
      phaseResponseOutput
    )
    const magnitudePoints = [...magResponseOutput].map((response, i) => ({x: myFrequencyArray[i], y: 10.0 * Math.log10(response)}))
    const phasePoints = [...phaseResponseOutput].map((response, i) => ({x: myFrequencyArray[i], y: 10 * response}))

    return (
      <Item type='audio' index={this.props.index} item={this.props.data}
        headerChildren={<div className='select'>
          <select
            onChange={(e) => {
              this.props.dispatch({
                type: 'UPDATE_DEVICE',
                id: this.props.data.id,
                property: 'type',
                value: e.target.value
              })
            }}
            >
            {filterTypes.map(type => (
              <option key={type.name} value={type.name}>{type.name}</option>
            ))}
          </select>
        </div>}>
        <svg className='vis-path' id={`vis-${this.props.data.id}`} viewBox={`0 0 ${this.viewBoxWidth} ${this.viewBoxHeight}`}>
          <defs>
            <clipPath id='cut-off'>
              <rect x='0' y='0' width={this.viewBoxWidth} height={this.viewBoxHeight} />
            </clipPath>
          </defs>
          <g className='grid grid-x' />
          <g className='grid grid-y' />
          <path
            className='filter-phase'
            vectorEffect='non-scaling-stroke'
            d={this.envelopePath(phasePoints)}
            clipPath='url(#cut-off)'
            />
          <path
            className='filter-magnitude'
            vectorEffect='non-scaling-stroke'
            d={this.envelopePath(magnitudePoints)}
            clipPath='url(#cut-off)'
            />
          <g
            className='graph-axis axis-x'
            transform={`translate(0,${this.viewBoxHeight})`}
            />
        </svg>
        <div className='flex-container'>
          {parameters.map(param => (
            <NumericInput
              key={param.name}
              label={param.name}
              className='quad'
              disabled={!filterTypes.find(el => el.name === this.props.data.type)[param.name]}
              id={param.name}
              min={param.min}
              max={param.max}
              step={param.step}
              scale={param.scale}
              unit={param.unit}
              displayValue={format(param.format)(this.props.data[param.name])}
              value={this.props.data[param.name]}
              action={{
                type: 'UPDATE_DEVICE',
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
