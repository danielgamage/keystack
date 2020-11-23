import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { NumericInput } from 'components'
import { line, curveBundle } from 'd3-shape'
import { scaleLinear } from 'd3-scale'
import { format } from 'd3-format'
import vars from 'variables'

export const EnvelopeElement = styled.div`
  .background-grid {
    stroke-dasharray: 2, 6;
    stroke-width: 1px;
    stroke: ${vars.grey_1};
  }

  .curve {
    stroke: ${props => vars.accents[props.theme.accent][0]}
  }

  .point {
    fill: ${vars.grey_0};
    stroke: ${vars.grey_7};
  }

  .control-point {
    fill: ${vars.grey_1};
    stroke: ${vars.grey_4};
    stroke-width: 1px;
  }

  .flex-container {
    justify-content: space-between;
  }

  .tri {
    width: calc((100% - (1rem * 2)) / 3) !important
  }
`

const getControlPointForBias = (first, second, bias) => {
  bias = (bias + 1) / 2

  return {
    x: first.x + ((second.x - first.x) * bias),
    y: second.y + ((first.y - second.y) * bias),
  }
}

class Envelope extends Component {
  constructor (props) {
    super(props)

    this.pathElements = []
  }

  render () {
    const envelope = this.props.envelope

    const log10 = (v) => Math.log10(v + 1)
    const viewBoxWidth = 32
    const viewBoxHeight = 8
    const sustainWidth = 1

    const pointsDict = {
      initital: {
        x: 0,
        y: envelope.initial
      },
      peak: {
        x: log10(envelope.attack),
        y: envelope.peak
      },
      sustainStart: {
        x: log10(envelope.attack) + log10(envelope.decay),
        y: envelope.sustain
      },
      sustainEnd: {
        x: log10(envelope.attack) + log10(envelope.decay) + sustainWidth,
        y: envelope.sustain
      },
      releaseEnd: {
        x: log10(envelope.attack) + log10(envelope.decay) + sustainWidth + log10(envelope.release),
        y: 0
      }
    }

    const lines = [[
      pointsDict.initital,
      getControlPointForBias(pointsDict.initital, pointsDict.peak, envelope.attackBias),
      pointsDict.peak,
    ], [
      pointsDict.peak,
      getControlPointForBias(pointsDict.peak, pointsDict.sustainStart, envelope.decayBias),
      pointsDict.sustainStart,
    ], [
      pointsDict.sustainStart,
      pointsDict.sustainEnd,
    ], [
      pointsDict.sustainEnd,
      getControlPointForBias(pointsDict.sustainEnd, pointsDict.releaseEnd, envelope.releaseBias),
      pointsDict.releaseEnd,
    ]]

    const points = Object.keys(pointsDict).map((key) => (
      pointsDict[key]
    ))

    const x = scaleLinear()
      .domain([0, log10(envelope.attack) + log10(envelope.decay) + sustainWidth + log10(envelope.release)])
      .range([0, viewBoxWidth])
    const y = scaleLinear()
      .domain([0, 1])
      .range([viewBoxHeight, 0])
    const envelopeLine = line()
      .x((d) => x(d.x))
      .y((d) => y(d.y))
    const envelopeCurve = line()
      .x((d) => x(d.x))
      .y((d) => y(d.y))
      .curve(curveBundle.beta(1));

    return (
      <EnvelopeElement>
        <svg className='vis-path' viewBox={`0 0 32 ${viewBoxHeight}`}>
          <linearGradient id='EnvelopeGradient' x1='0' x2='0' y1='0' y2={viewBoxHeight} gradientUnits='userSpaceOnUse'>
            <stop offset='0%' stopColor='#59595b' />
            <stop offset='80%' stopColor='#47494b' />
            <stop offset='100%' stopColor='#444649' />
          </linearGradient>

          {points.filter((el, i, arr) => (
            i !== 0 &&
            i !== arr.length - 1
          )).map(point => (
            <line
              vectorEffect='non-scaling-stroke'
              key={`${point.x}-${point.y}`}
              className='background-grid'
              x1={x(point.x)}
              x2={x(point.x)}
              y1={0}
              y2={viewBoxHeight}
            />
          ))}


          {lines.map((line, i) => (
            <path
              key={i}
              className='curve'
              vectorEffect='non-scaling-stroke'
              d={line.length === 2
                ? envelopeLine(line)
                : envelopeCurve(line)
              }
            />
          ))}

          {lines.map((line, i) => (
            <circle
              key={i}
              className='control-point'
              vectorEffect='non-scaling-stroke'
              cx={x(line[1].x)}
              cy={y(line[1].y)}
              r={0.2}
            />
          ))}

          {points.map((point, i) => (
            <circle
              vectorEffect='non-scaling-stroke'
              key={i}
              className='point'
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
              showLabel: true,
              min: 0,
              max: 1,
              step: 0.01
            },
            {
              name: 'peak',
              label: 'peak',
              unit: '',
              format: '',
              showLabel: true,
              min: 0,
              max: 1,
              step: 0.01
            },
            {
              name: 'sustain',
              label: 'sus',
              unit: '',
              format: '',
              showLabel: true,
              min: 0,
              max: 1,
              step: 0.01
            },
            {
              name: 'attack',
              label: 'att',
              unit: 's',
              format: '0.3s',
              showLabel: true,
              min: 0,
              max: 5,
              step: 0.01
            },
            {
              name: 'decay',
              label: 'dec',
              unit: 's',
              format: '0.3s',
              showLabel: true,
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
              max: 10,
              step: 0.01
            },
            {
              name: 'attackBias',
              label: 'attack bias',
              format: '+.2',
              showLabel: false,
              min: -1,
              max: 1,
              step: 0.01
            },
            {
              name: 'decayBias',
              label: 'decay bias',
              format: '+.2',
              showLabel: false,
              min: -1,
              max: 1,
              step: 0.01
            },
            {
              name: 'releaseBias',
              label: 'release bias',
              format: '+.2',
              showLabel: false,
              min: -1,
              max: 1,
              step: 0.01
            }
          ].map(el => (
            <NumericInput
              label={el.label}
              key={el.name}
              className='tri'
              viz='bar'
              showLabel={el.showLabel}
              id={el.name}
              min={el.min}
              max={el.max}
              steps={{default: el.step, shiftKey: el.step * 10}}
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
      </EnvelopeElement>
    )
  }
}

export default connect()(Envelope)
