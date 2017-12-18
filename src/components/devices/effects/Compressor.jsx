import React, { Component } from 'react'
import { connect } from 'react-redux'

import { line, curveBundle } from 'd3-shape'
import { scaleLinear, scaleLog, scalePow } from 'd3-scale'
import { axisBottom, axisLeft } from 'd3-axis'
import { select } from 'd3-selection'
import { format } from 'd3-format'

import { audioEffectNodes } from '@/utils/audio'
import { compressSample } from '@/utils/compressor'

import {
  NumericInput,
  Item,
} from '@/components'

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
  .x((d) => x(d.x))
  .y((d) => y(d.y))
  .curve(curveBundle.beta(1))

const params = {
  'attack': {
    unit: 's',
    format: '0.3s',
    min: 0,
    max: 1,
    step: 0.01
  },
  'release': {
    unit: 's',
    format: '0.3s',
    min: 0,
    max: 1,
    step: 0.01
  },
  'knee': {
    unit: ' dB',
    format: '',
    min: 0,
    max: 40,
    step: 1
  },
  'ratio': {
    unit: ':1',
    format: '',
    min: 1,
    max: 20,
    step: 0.1
  },
  'threshold': {
    unit: ' dB',
    format: '',
    min: -100,
    max: 0,
    step: 1
  }
}

const xAxis = axisBottom()
  .scale(x)
  .ticks(5, '.0s')
const yAxis = axisLeft()
  .scale(y)
  .ticks(5, '.0s')

class Compressor extends Component {
  componentDidMount () {
    const gridX = select(`#vis-${this.props.data.id} .grid-x`)
      .call(xAxis
        .tickSize(viewBoxHeight)
        .tickFormat('')
      )
      .selectAll('*')
        .attr('vector-effect', 'non-scaling-stroke')
    const gridY = select(`#vis-${this.props.data.id} .grid-y`)
      .call(yAxis
        .tickSize(viewBoxWidth)
        .tickFormat('')
      )
      .selectAll('*')
        .attr('vector-effect', 'non-scaling-stroke')
  }
  render () {
    const points = [
      -100,
      this.props.data.threshold - (this.props.data.knee / 2),
      this.props.data.threshold,
      this.props.data.threshold + (this.props.data.knee / 2),
      0
    ].map(x => ({x: x, y: compressSample(x, this.props.data.threshold, this.props.data.ratio, this.props.data.knee)}))

    return (
      <Item type='audio' index={this.props.index} item={this.props.data}>
        <div className='compressor-container'>
          <div className='vis'>
            <svg className='vis-path' id={`vis-${this.props.data.id}`} viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}>
              <g className='grid grid-x' />
              <g className='grid grid-y'
                transform={`translate(${viewBoxWidth},0)`}
                />
              <path
                vectorEffect='non-scaling-stroke'
                d={compressionCurve(points)}
                />
              {points.map(point => (
                <circle
                  vectorEffect='non-scaling-stroke'
                  className='dot'
                  cx={x(point.x)}
                  cy={y(point.y)}
                  r='4'
                  />
              ))}
            </svg>
            <div className='flex-container'>
              {['attack', 'release'].map((el, i) => (
                <NumericInput
                  label={el}
                  className='tri small right'
                  id={`pan-${this.props.data.id}-${Math.floor(i * Math.random() * 1000)}`}
                  min={params[el].min}
                  max={params[el].max}
                  steps={{default: params[el].step, shiftKey: params[el].step * 10}}
                  unit={params[el].unit}
                  displayValue={format(params[el].format)(this.props.data[el])}
                  value={this.props.data[el]}
                  onInput={(event) => {
                    this.props.dispatch({
                      type: 'UPDATE_DEVICE',
                      id: this.props.data.id,
                      property: el,
                      value: event,
                    })
                  }}
                  />
              ))}
            </div>
          </div>
          <div >
            {['threshold', 'ratio', 'knee'].map((el, i) => (
              <NumericInput
                label={el}
                id={`pan-${this.props.data.id}-${Math.floor(i * Math.random() * 1000)}`}
                min={params[el].min}
                max={params[el].max}
                steps={{default: params[el].step, shiftKey: params[el].step * 10}}
                unit={params[el].unit}
                displayValue={format(params[el].format)(this.props.data[el])}
                value={this.props.data[el]}
                onInput={(event) => {
                  this.props.dispatch({
                    type: 'UPDATE_DEVICE',
                    id: this.props.data.id,
                    property: el,
                    value: event,
                  })
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
