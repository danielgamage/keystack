import { h, Component } from 'preact'
import { connect } from 'preact-redux'
import NumericInput from './NumericInput.jsx'
import { line } from "d3-shape"
import { scaleLinear } from "d3-scale"


import waveIcon from '../images/waves.svg'

class Settings extends Component {
	render() {
    const envelope = this.props.synth.envelope

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
      .x((d) => x(d.x) )
      .y((d) => y(d.y) )


		return (
      <div class="envelope">
        <svg class="envelope-path" viewBox={`0 0 32 ${viewBoxHeight}`}>
          <linearGradient id="Gradient" x1="0" x2="0" y1="0" y2={viewBoxHeight} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#6c6c6e"/>
            <stop offset="80%" stop-color="#47494b"/>
            <stop offset="100%" stop-color="#444649"/>
          </linearGradient>
          <path
            vector-effect="non-scaling-stroke"
            d={envelopePath([{x:0, y:0}, ...points]) /* Add in an extra point at the start so the fill doesn't break when init !=0 */}
            fill="url(#Gradient)"
            />
          {points.map(point => (
            <circle
              vector-effect="non-scaling-stroke"
              class="dot"
              cx={x(point.x)}
              cy={y(point.y)}
              r="0.3"
              />
          ))}
        </svg>
        <div className="container">
          {[
            {name: 'initial', min: 0, max:  1,  step: 0.01},
            {name: 'peak',    min: 0, max:  1,  step: 0.01},
            {name: 'sustain', min: 0, max:  1,  step: 0.01},
            {name: 'attack',  min: 0, max: 30,  step: 0.10},
            {name: 'decay',   min: 0, max: 30,  step: 0.10},
            {name: 'release', min: 0, max: 30,  step: 0.10}
          ].map(el => (
            <NumericInput
              label={el.name}
              class="tri"
              id={el.name}
              min={el.min}
              max={el.max}
              step={el.step}
              value={envelope[el.name]}
							action={{
								type: 'UPDATE_VOLUME_ENVELOPE',
								key: el.name
							}}
              />
          ))}
        </div>
      </div>
		);
	}
}

function mapStateToProps (state) {
  return { notes: state.notes, synth: state.synth }
}

export default connect(mapStateToProps)(Settings)
