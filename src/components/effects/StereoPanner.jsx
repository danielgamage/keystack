import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import NumericInput from '../NumericInput.jsx'

class Filter extends Component {

	render() {

		return (
      <div class="item effect-item">
        <header>
          <h3 class="title">Stereo Panner</h3>
        </header>
        <div class="flex-container">
          <NumericInput
            label="Pan"
            class="tri"
            id={`pan-${this.props.data.id}`}
            min={-1}
            max={1}
            step={.01}
            value={this.props.data["pan"]}
            action={{
              type: 'UPDATE_EFFECT',
              id: this.props.data.id,
              property: "pan"
            }}
            />
        </div>
      </div>
		)
	}
}

export default connect()(Filter)
