import React, { Component } from 'react'
import { connect } from 'react-redux'

import { audioEffectNodes } from '@/utils/audio'

import { line, curveCatmullRom } from 'd3-shape'
import { scaleLinear, scaleLog, scalePow } from 'd3-scale'
import { axisBottom, axisLeft } from 'd3-axis'
import { select } from 'd3-selection'
import { format } from 'd3-format'

import styled from 'styled-components'
import vars from '@/variables'

import crosshairIcon from '@/images/icon/crosshair.svg'

import {
  NumericInput,
  Item,
  Select,
  Icon,
} from '@/components'

const StyledFilter = styled.div`
  position: relative;

  .icon--crosshair {
    position: absolute;
    fill: ${props => vars.accents[props.theme.accent].light};
    pointer-events: none;
    transform: translate(-50%, -50%);
  }
`

const filterTypes = [{
  name: 'lowpass',
  label: 'Low-pass',
  frequency: true,
  q: true,
  gain: false,
  mix: true,
  y: 'q',
}, {
  name: 'highpass',
  label: 'High-pass',
  frequency: true,
  q: true,
  gain: false,
  mix: true,
  y: 'q',
}, {
  name: 'bandpass',
  label: 'Band-pass',
  frequency: true,
  q: true,
  gain: false,
  mix: true,
  y: 'q',
}, {
  name: 'lowshelf',
  label: 'Low-shelf',
  frequency: true,
  q: false,
  gain: true,
  mix: true,
  y: 'gain',
}, {
  name: 'highshelf',
  label: 'High-shelf',
  frequency: true,
  q: false,
  gain: true,
  mix: true,
  y: 'gain',
}, {
  name: 'peaking',
  label: 'Peaking',
  frequency: true,
  q: true,
  gain: true,
  mix: true,
  y: 'gain',
}, {
  name: 'notch',
  label: 'Notch',
  frequency: true,
  q: true,
  gain: false,
  mix: true,
  y: 'q',
}, {
  name: 'allpass',
  label: 'All-pass',
  frequency: true,
  q: true,
  gain: false,
  mix: true,
  y: 'q',
}]

const parameters = [{
  name: 'frequency',
  label: 'freq',
  unit: 'hz',
  format: '.3s',
  min: 30,
  max: 20000,
  step: 0.01,
  scale: 10
}, {
  name: 'q',
  unit: '',
  format: '',
  min: 0.1,
  max: 18,
  step: 0.1,
  scale: Math.E
}, {
  name: 'gain',
  format: '',
  unit: 'dB',
  min: -18,
  max: 18,
  step: 0.1,
  scale: 1
}, {
  name: 'mix',
  format: '',
  unit: '%',
  min: 0,
  max: 100,
  step: 1,
  scale: 1
}]

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
      .domain([-10, 10])
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

    this.onMouseDown = this.onMouseDown.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
    this.scaleX = this.scaleX.bind(this)
    this.scaleY = this.scaleY.bind(this)
    this.setParams = this.setParams.bind(this)
  }

  componentWillMount () {
    this.setParams()
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

  //
  //
  //

  setParams () {
    this.paramX = parameters.find(el => 'frequency' === el.name)
    const currentYParamName = filterTypes.find(el => this.props.data.type === el.name).y
    this.paramY = parameters.find(el => currentYParamName === el.name)
  }

  //
  //
  //

  onMouseDown (e) {
    this.canvasBox = this.svgElement.getBoundingClientRect()

    this.setParams()

    window.addEventListener('mousemove', this.onMouseMove)
    window.addEventListener('mouseup', this.onMouseUp)

    this.onMouseMove(e)
  }

  scaleX (value, scale) {
    const pixelScale = scaleLinear()
      .domain([this.canvasBox.left, this.canvasBox.left + this.canvasBox.width])
      .range([0, 1])
      .clamp(true)

    // console.log('x', {input_value: value})

    value = pixelScale(value)

    // console.log('x', {percent_value: value})

    // if (scale !== 1) {
    value = scale ** value
    // }

    // console.log('x', {scaled_value: value})

    const paramXScale = scalePow()
      .exponent(Math.E)
      .domain([1, scale])
      .range([this.paramX.min, this.paramX.max])
      .clamp(true)

    // console.log('x', {output_value: paramXScale(value)})
    // console.log('x', '———————————')

    return paramXScale(value)
  }

  scaleY (value, scale) {
    const pixelScale = scaleLinear()
      .domain([this.canvasBox.top + this.canvasBox.height, this.canvasBox.top])
      .range([0, 100])
      .clamp(true)

    value = pixelScale(value)

    // if (scale !== 1) {
    //   value = scale ** value
    // }

    // console.log('y', {value})

    const paramYScale = scalePow()
      .exponent(this.paramY.scale)
      .domain([1, 100 ** this.paramY.scale])
      .range([this.paramY.min, this.paramY.max])
      .clamp(true)

    return paramYScale(value)
  }

  onMouseMove (e) {
    e.preventDefault()

    const xValue = this.scaleX(e.pageX, this.paramX.scale)
    const yValue = this.scaleY(e.pageY, this.paramY.scale)

    console.log({xValue, yValue})

    this.props.dispatch({
      type: 'UPDATE_DEVICE',
      id: this.props.data.id,
      property: this.paramX.name,
      value: xValue,
    })

    this.props.dispatch({
      type: 'UPDATE_DEVICE',
      id: this.props.data.id,
      property: this.paramY.name,
      value: yValue,
    })
  }

  onMouseUp (e) {
    window.removeEventListener('mousemove', this.onMouseMove)
    window.removeEventListener('mouseup', this.onMouseUp)
  }

  //
  //
  //

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

    let xValue = 0
    if (this.paramX) {
      const freqToPosition = scaleLog()
        .domain([this.paramX.min, this.paramX.max])
        .range([0, 100])

      xValue = freqToPosition(this.props.data[this.paramX.name])
    }

    let yValue = 0
    if (this.paramY) {
      const yValueToPosition = scaleLog()
        .domain([this.paramY.min, this.paramY.max])
        .range([100, 0])

      yValue = yValueToPosition(this.props.data[this.paramY.name])
    }

    return (
      <Item
        type='audio'
        index={this.props.index}
        item={this.props.data}
        headerChildren={
          <div className='select'>
            <Select
              onUpdate={(e) => {
                console.log('e', e)
                this.props.dispatch({
                  type: 'UPDATE_DEVICE',
                  id: this.props.data.id,
                  property: 'type',
                  value: e
                })
              }}
              options={filterTypes.map(type => ({
                value: type.name,
                label: type.label,
              }))}
            />
          </div>
        }
      >
        <StyledFilter>
          <svg
            className='vis-path'
            id={`vis-${this.props.data.id}`}
            viewBox={`0 0 ${this.viewBoxWidth} ${this.viewBoxHeight}`}
            ref={(e) => this.svgElement = e}
            onMouseDown={this.onMouseDown}
          >
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

          <Icon
            className='icon--crosshair'
            src={crosshairIcon}
            scale={1}
            style={{
              left: xValue + '%',
              top: yValue + '%',
            }}
          />
        </StyledFilter>

        <div className='flex-container'>
          {parameters.map(param => (
            <NumericInput
              key={param.name}
              label={param.label || param.name}
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
              onInput={(event) => {
                this.props.dispatch({
                  type: 'UPDATE_DEVICE',
                  id: this.props.data.id,
                  property: param.name,
                  value: event,
                })
              }}
              />
          ))}
        </div>
      </Item>
    )
  }
}

export default connect()(Filter)
