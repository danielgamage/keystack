import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import { line, curveBundle } from 'd3-shape'
import { scaleLinear } from 'd3-scale'
import { format } from 'd3-format'

import NumericInput from './NumericInput.jsx'

import { keys } from '../utils'
import { loadSample } from '../utils/audio'

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
    console.log(sample.name)
    return (
      <section class='sample'>
        <svg
          ref={(c) => this.element = c}
          class={`vis-path ${sample.name === null ? 'empty' : ''}`}
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
            class='waveform'
            vector-effect='non-scaling-stroke'
            d={waveform(sample.waveform)}
            />
          <rect vector-effect='non-scaling-stroke' class='inactive-cover' x={loopEndX} y='0' height={viewBoxHeight} width={viewBoxWidth - loopEndX} />
          <rect vector-effect='non-scaling-stroke' class='frame' x='0' y='0' height={viewBoxHeight} width={viewBoxWidth} />
          <polygon vector-effect='non-scaling-stroke' class='start-marker-flag' points='0,0 0,8 6,0' />
          <line vector-effect='non-scaling-stroke' class='start-marker' x1='0' y1={viewBoxHeight} x2='0' y2='0' />
          <rect vector-effect='non-scaling-stroke' class='loop-bar' x={loopStartX} y='0' height='8' width={loopEndX - loopStartX} />
          <line vector-effect='non-scaling-stroke' class='loop-marker' x1={loopStartX} y1={viewBoxHeight} x2={loopStartX} y2='0' />
          <line vector-effect='non-scaling-stroke' class='loop-marker' x1={loopEndX} y1={viewBoxHeight} x2={loopEndX} y2='0' />
          <text class='sample-text empty-text' x={viewBoxWidth / 2} y={viewBoxHeight / 2} text-anchor='middle' alignment-baseline='middle'>
            No sample added
          </text>
          <text class='sample-text drop-text' x={viewBoxWidth / 2} y={viewBoxHeight / 2} text-anchor='middle' alignment-baseline='middle'>
            Drop file Here
          </text>
        </svg>
        <div className='sample-info'>
          <span class='name'>{sample.name}</span>
          <span class='size'>{sample.size != null && `${format('.2')(sample.size / 1024 / 1024)}mb`}</span>
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
              class='small quad'
              id={`loop-${el.name}`}
              min={el.min}
              max={el.max}
              step='0.01'
              value={this.props.instrument[`loop${el.name}`]}
              action={{
                id: this.props.instrument.id,
                type: 'UPDATE_INSTRUMENT_ITEM',
                property: `loop${el.name}`
              }}
              />
          ))}
          <NumericInput
            label='Pitch'
            class='small quad'
            id='sample-pitch'
            min={0}
            max={88}
            step={1}
            displayValue={keys[this.props.instrument.pitch].note + keys[this.props.instrument.pitch].octave}
            value={this.props.instrument.pitch}
            action={{
              id: this.props.instrument.id,
              type: 'UPDATE_INSTRUMENT_ITEM',
              property: 'pitch'
            }}
              />
          <NumericInput
            label='Detune'
            unit=' ct'
            class='small quad'
            id='sample-detune'
            min={-50}
            max={50}
            step={0.1}
            value={this.props.instrument.detune}
            action={{
              id: this.props.instrument.id,
              type: 'UPDATE_INSTRUMENT_ITEM',
              property: 'detune'
            }}
              />
        </div>
      </section>
    )
  }
}

export default connect()(Sample)
