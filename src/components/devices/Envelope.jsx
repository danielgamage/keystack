import React, { Component } from 'react'
import { connect } from 'react-redux'
import { NumericInput } from '@/components'
import { line } from 'd3-shape'
import { scaleLinear } from 'd3-scale'
import { format } from 'd3-format'

class Envelope extends Component {
  render () {
    const envelope = this.props.envelope

    const log10 = (v) => Math.log10(v + 1)
    const viewBoxWidth = 32
    const viewBoxHeight = 8
    const sustainWidth = 1
    const points = [
      { // initial
        x: 0,
        y: envelope.initial
      },
      { // peak
        x: log10(envelope.attack),
        y: envelope.peak
      },
      { // decay–sustain
        x: log10(envelope.attack) + log10(envelope.decay),
        y: envelope.sustain
      },
      { // end of sustain
        x: log10(envelope.attack) + log10(envelope.decay) + sustainWidth,
        y: envelope.sustain
      },
      { // end of release
        x: log10(envelope.attack) + log10(envelope.decay) + sustainWidth + log10(envelope.release),
        y: 0
      }
    ]

    const x = scaleLinear()
      .domain([0, log10(envelope.attack) + log10(envelope.decay) + sustainWidth + log10(envelope.release)])
      .range([0, viewBoxWidth])
    const y = scaleLinear()
      .domain([0, 1])
      .range([viewBoxHeight, 0])
    const envelopePath = line()
      .x((d) => x(d.x))
      .y((d) => y(d.y))

    return (
      <section className='envelope'>
        <svg className='vis-path' viewBox={`0 0 32 ${viewBoxHeight}`}>
          <linearGradient id='EnvelopeGradient' x1='0' x2='0' y1='0' y2={viewBoxHeight} gradientUnits='userSpaceOnUse'>
            <stop offset='0%' stopColor='#59595b' />
            <stop offset='80%' stopColor='#47494b' />
            <stop offset='100%' stopColor='#444649' />
          </linearGradient>
          <path
            vectorEffect='non-scaling-stroke'
            d={envelopePath([{x: 0, y: 0}, ...points]) /* Add in an extra point at the start so the fill doesn't break when init !=0 */}
            fill='url(#EnvelopeGradient)'
            />
          {points.map(point => (
            <circle
              vectorEffect='non-scaling-stroke'
              key={`${point.x}-${point.y}`}
              className='dot'
              cx={x(point.x)}
              cy={y(point.y)}
              r='0.3'
              />
          ))}
        </svg>
        <div className='flex-container'>
          {[
            {
              name: 'initial',
              label: 'init',
              unit: '',
              format: '',
              min: 0,
              max: 1,
              step: 0.01
            },
            {
              name: 'peak',
              label: 'peak',
              unit: '',
              format: '',
              min: 0,
              max: 1,
              step: 0.01
            },
            {
              name: 'sustain',
              label: 'sus',
              unit: '',
              format: '',
              min: 0,
              max: 1,
              step: 0.01
            },
            {
              name: 'attack',
              label: 'att',
              unit: 's',
              format: '0.3s',
              min: 0,
              max: 5,
              step: 0.01
            },
            {
              name: 'decay',
              label: 'dec',
              unit: 's',
              format: '0.3s',
              min: 0,
              max: 5,
              step: 0.01
            },
            {
              name: 'release',
              label: 'rel',
              unit: 's',
              format: '0.3s',
              min: 0,
              max: 5,
              step: 0.01
            }
          ].map(el => (
            <NumericInput
              label={el.name}
              key={el.name}
              className='tri'
              id={el.name}
              min={el.min}
              max={el.max}
              step={el.step}
              unit={el.unit}
              displayValue={format(el.format)(envelope[el.name])}
              value={envelope[el.name]}
              onInput={(event) => {
                this.props.dispatch({
                  type: 'UPDATE_VOLUME_ENVELOPE',
                  id: this.props.instrument.id,
                  key: el.name,
                  value: event
                })
              }}
              />
          ))}
        </div>
      </section>
    )
  }
}

export default connect()(Envelope)
