import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import { audioEffectNodes } from '../../utils/audio'

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
  componentDidMount() {
    this.updateFrequencyResponse()
  }
  componentWillReceiveProps() {
    this.updateFrequencyResponse()
  }
  drawFrequencyResponse(mag, phase) {
    var frequencyBars = 100;



    var canvas = document.getElementById("canvas")
    var canvasContext = canvas.getContext("2d")
    canvasContext.clearRect(0, 0, canvas.width, canvas.height)
    var barWidth = 400 / frequencyBars

    // Magnitude
    canvasContext.strokeStyle = "white"
    canvasContext.beginPath()
    for(var frequencyStep = 0; frequencyStep < frequencyBars; ++frequencyStep) {
      canvasContext.lineTo(
        frequencyStep * barWidth,
        canvas.height - mag[frequencyStep]*90)
    }
    canvasContext.stroke()

    // Phase
    canvasContext.strokeStyle = "red"
    canvasContext.beginPath()
    for(var frequencyStep = 0; frequencyStep < frequencyBars; ++frequencyStep) {
      canvasContext.lineTo(
        frequencyStep * barWidth,
        canvas.height - (phase[frequencyStep]*90 + 300)/Math.PI)
    }
    canvasContext.stroke()
  }
  updateFrequencyResponse() {
    var frequencyBars = 100;
    // Array containing all the frequencies we want to get
    // response for when calling getFrequencyResponse()
    var myFrequencyArray = new Float32Array(frequencyBars);
    for(var i = 0; i < frequencyBars; ++i) {
      myFrequencyArray[i] = 20000/frequencyBars*(i+1);
    }

    // We receive the result in these two when calling
    // getFrequencyResponse()
    var magResponseOutput = new Float32Array(frequencyBars); // magnitude
    var phaseResponseOutput = new Float32Array(frequencyBars);
    const filterNode = audioEffectNodes[this.props.data.id]
    filterNode.getFrequencyResponse(
      myFrequencyArray,
      magResponseOutput,
      phaseResponseOutput
    )
    this.drawFrequencyResponse(magResponseOutput, phaseResponseOutput)
  }
	render() {
		return (
      <div>
        <h3>Filter</h3>
        <canvas id="canvas"></canvas>
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
