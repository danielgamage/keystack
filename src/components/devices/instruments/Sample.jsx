import React, { Component } from 'react'
import { connect } from 'react-redux'

import { line, curveBundle } from 'd3-shape'
import { scaleLinear } from 'd3-scale'
import { format } from 'd3-format'

import {
  NumericInput,
} from '@/components'

import { keys } from '@/utils'
import { loadSample } from '@/utils/audio'

const viewBoxWidth = 256
const viewBoxHeight = 64

class Sample extends Component {
  render () {
    const x = scaleLinear()
      .domain([0, this.props.instrument.sample.waveform.length - 1])
      .range([0, viewBoxWidth])
      .clamp(true)

    const y = scaleLinear()
      .domain([-1, 1])
      .range([viewBoxHeight, 0])
      .clamp(true)
    const waveform = line()
      .x((d, i) => x(i))
      .y((d) => y(d))
      .curve(curveBundle.beta(1))
    const instrument = this.props.instrument
    const sample = instrument.sample

    const loopStartX = this.props.instrument.loopStart / sample.duration * viewBoxWidth
    const loopEndX = this.props.instrument.loopEnd / sample.duration * viewBoxWidth

    return (
      <section className='sample'>
        <svg
          ref={(c) => this.element = c}
          className={`vis-path ${sample.name === null ? 'empty' : ''}`}
          id={`vis-${this.props.instrument.id}`}
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          onDragOver={(e) => {
            e.preventDefault()
            this.element.classList.add('dragging')
          }}
          onDragLeave={(e) => {
            e.preventDefault()
            this.element.classList.remove('dragging')
          }}
          onDrop={(e) => {
            e.preventDefault()
            // If dropped items aren't files, reject them
            this.element.classList.remove('dragging')
            loadSample(e, instrument.id)
          }}>
          <path
            className='waveform'
            vectorEffect='non-scaling-stroke'
            d={waveform(sample.waveform)}
            />
          <rect vectorEffect='non-scaling-stroke' className='inactive-cover' x={loopEndX} y='0' height={viewBoxHeight} width={viewBoxWidth - loopEndX} />
          <rect vectorEffect='non-scaling-stroke' className='frame' x='0' y='0' height={viewBoxHeight} width={viewBoxWidth} />
          <polygon vectorEffect='non-scaling-stroke' className='start-marker-flag' points='0,0 0,8 6,0' />
          <line vectorEffect='non-scaling-stroke' className='start-marker' x1='0' y1={viewBoxHeight} x2='0' y2='0' />
          <rect vectorEffect='non-scaling-stroke' className='loop-bar' x={loopStartX} y='0' height='8' width={loopEndX - loopStartX} />
          <line vectorEffect='non-scaling-stroke' className='loop-marker' x1={loopStartX} y1={viewBoxHeight} x2={loopStartX} y2='0' />
          <line vectorEffect='non-scaling-stroke' className='loop-marker' x1={loopEndX} y1={viewBoxHeight} x2={loopEndX} y2='0' />
          <text className='sample-text empty-text' x={viewBoxWidth / 2} y={viewBoxHeight / 2} textAnchor='middle' alignmentBaseline='middle'>
            No sample added
          </text>
          <text className='sample-text drop-text' x={viewBoxWidth / 2} y={viewBoxHeight / 2} textAnchor='middle' alignmentBaseline='middle'>
            Drop file Here
          </text>
        </svg>
        <div className='sample-info'>
          <span className='name'>{sample.name}</span>
          <span className='size'>{sample.size != null && `${format('.2')(sample.size / 1024 / 1024)}mb`}</span>
        </div>
        <div className='flex-container'>
          {[
            {name: 'Start', max: instrument.loopEnd, min: 0},
            {name: 'End', max: sample.duration, min: instrument.loopStart}
          ].map(el => (
            <NumericInput
              label={`Loop ${el.name}`}
              unit='s'
              format='.3s'
              className='small quad'
              id={`loop-${el.name}`}
              min={el.min}
              max={el.max}
              steps={{default: 0.01, shiftKey: 0.1}}
              value={this.props.instrument[`loop${el.name}`]}
              onInput={(event) => {
                this.props.dispatch({
                  id: this.props.instrument.id,
                  type: 'UPDATE_INSTRUMENT_ITEM',
                  property: `loop${el.name}`,
                  value: event
                })
              }}
              />
          ))}
          <NumericInput
            label='Pitch'
            className='small quad'
            id='sample-pitch'
            min={0}
            max={88}
            displayValue={keys[this.props.instrument.pitch].note + keys[this.props.instrument.pitch].octave}
            value={this.props.instrument.pitch}
            onInput={(event) => {
              this.props.dispatch({
                id: this.props.instrument.id,
                type: 'UPDATE_INSTRUMENT_ITEM',
                property: 'pitch',
                value: event
              })
            }}
            />
          <NumericInput
            label='Detune'
            unit=' ct'
            className='small quad'
            id='sample-detune'
            min={-50}
            max={50}
            steps={{default: 0.1, shiftKey: 1, altShiftKey: 10}}
            value={this.props.instrument.detune}
            onInput={(event) => {
              this.props.dispatch({
                id: this.props.instrument.id,
                type: 'UPDATE_INSTRUMENT_ITEM',
                property: 'detune',
                value: event
              })
            }}
            />
        </div>
      </section>
    )
  }
}

export default connect()(Sample)
