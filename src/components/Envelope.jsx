import { h, Component } from 'preact'
import { connect } from 'preact-redux'
import NumericInput from './NumericInput.jsx'
import { line } from 'd3-shape'
import { scaleLinear } from 'd3-scale'
import { format } from 'd3-format'

class Settings extends Component {
	render() {
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
      <section class='envelope'>
        <svg class='vis-path' viewBox={`0 0 32 ${viewBoxHeight}`}>
          <linearGradient id='EnvelopeGradient' x1='0' x2='0' y1='0' y2={viewBoxHeight} gradientUnits='userSpaceOnUse'>
            <stop offset='0%' stop-color='#59595b'/>
            <stop offset='80%' stop-color='#47494b'/>
            <stop offset='100%' stop-color='#444649'/>
          </linearGradient>
          <path
            vector-effect='non-scaling-stroke'
            d={envelopePath([{x: 0, y: 0}, ...points]) /* Add in an extra point at the start so the fill doesn't break when init !=0 */}
            fill='url(#EnvelopeGradient)'
            />
          {points.map(point => (
            <circle
              vector-effect='non-scaling-stroke'
              class='dot'
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
              unit: '',
              format: '',
              min: 0,
              max: 1,
              step: 0.01
            },
            {
              name: 'peak',
              unit: '',
              format: '',
              min: 0,
              max: 1,
              step: 0.01
            },
            {
              name: 'sustain',
              unit: '',
              format: '',
              min: 0,
              max: 1,
              step: 0.01
            },
            {
              name: 'attack',
              unit: 's',
              format: '0.3s',
              min: 0,
              max: 5,
              step: 0.01
            },
            {
              name: 'decay',
              unit: 's',
              format: '0.3s',
              min: 0,
              max: 5,
              step: 0.01
            },
            {
              name: 'release',
              unit: 's',
              format: '0.3s',
              min: 0,
              max: 5,
              step: 0.01
            }
          ].map(el => (
            <NumericInput
              label={el.name}
              class='tri'
              id={el.name}
              min={el.min}
              max={el.max}
              step={el.step}
              unit={el.unit}
							displayValue={format(el.format)(envelope[el.name])}
              value={envelope[el.name]}
							action={{
								type: 'UPDATE_VOLUME_ENVELOPE',
                id: this.props.instrument.id,
								key: el.name
							}}
              />
          ))}
        </div>
      </section>
		);
	}
}

export default connect()(Settings)
