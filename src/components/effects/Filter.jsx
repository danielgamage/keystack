import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import { audioEffectNodes } from '../../utils/audio'

import { line, curveCatmullRom } from "d3-shape"
import { scaleLinear, scaleLog } from "d3-scale"

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
    max: 12000,
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

class Filter extends Component {
	render() {
    const viewBoxWidth = 32
    const viewBoxHeight = 8
    var frequencyBars = 256;

    var myFrequencyArray = new Float32Array(frequencyBars);
    for(var i = 0; i < frequencyBars; ++i) {
      myFrequencyArray[i] = 20000/frequencyBars*(i+1);
    }

    var magResponseOutput = new Float32Array(frequencyBars); // magnitude
    var phaseResponseOutput = new Float32Array(frequencyBars);
    const filterNode = audioEffectNodes[this.props.data.id]
    filterNode.getFrequencyResponse(
      myFrequencyArray,
      magResponseOutput,
      phaseResponseOutput
    )
    const magnitudePoints = [...magResponseOutput].map((response, i) => ({x: i + 1.01, y: response}))
    const x = scaleLog()
      .domain([1.01, frequencyBars])
      .range([0, viewBoxWidth])
    const y = scaleLinear()
      .domain([0, 3])
      .range([viewBoxHeight, 0])
    const envelopePath = line()
      .x((d) => x(d.x) )
      .y((d) => y(d.y) )
      .curve(curveCatmullRom)


		return (
      <div>
        <h3>Filter</h3>
        <svg class="envelope-path" viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}>
          <path
            vector-effect="non-scaling-stroke"
            d={envelopePath([...magnitudePoints]) /* Add in an extra point at the start so the fill doesn't break when init !=0 */}
            />
          {/*magnitudePoints.map(point => (
            <circle
              vector-effect="non-scaling-stroke"
              class="dot"
              cx={x(point.x)}
              cy={y(point.y)}
              r="0.3"
              />
          ))*/}
        </svg>
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
		)
	}
}

export default connect()(Filter)
