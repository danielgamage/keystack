import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import NumericInput from '../NumericInput.jsx'

class DisableNotes extends Component {
	render() {
		return (
      <div class="item midi-item">
        <header>
          <h3 class="title">Disable Notes</h3>
        </header>
        <div class="piano-checkboxes">
          {this.props.data.value.map((el, i) => (
            <label class={`replaced-checkbox ${[1,3,6,8,10].includes(i) ? "black" : "white"}`}>
              <input
                checked={this.props.data.value[i]}
                type="checkbox"
                onChange={(e) => {
                  this.props.dispatch({
                    type: 'UPDATE_MIDI_VALUE_ARRAY',
                    id: this.props.data.id,
                    index: i,
                    value: e.target.checked
                  })
                }}
                />
              <div class="checkbox-replacement">
                <div class={`checkbox-check ${this.props.data.value[i] ? "active" : ""}`} />
              </div>
            </label>
          ))}
        </div>
      </div>
		)
	}
}

export default connect()(DisableNotes)
