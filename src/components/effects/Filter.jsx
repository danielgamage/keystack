import { h, Component } from 'preact'
import { connect } from 'preact-redux'

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
    step: 10
  },
  { name: "q",
    min: 0,
    max: 18,
    step: .1
  },
  { name: "gain",
    min: -15,
    max: 15,
    step: .1
  }
]

class Filter extends Component {
	render() {
		return (
      <div>
        <h3>Filter</h3>
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
            value={this.props.data[param.name]}
            action={{
              type: 'UPDATE_FILTER',
              id: this.props.data.id,
              property: param.name
            }}
            />
        ))}
      </div>
		);
	}
}

export default connect()(Filter)
