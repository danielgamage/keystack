import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import NumericInput from '../NumericInput.jsx'
import Item from '../Item.jsx'

class Chord extends Component {
	render() {
		return (
      <Item title="Chord" type="midi" item={this.props.data}>
        <div class="flex-container">
          {this.props.data.value.map((el, i) => (
            <NumericInput
              label={`Note #${i + 1}`}
              showLabel={false}
              class="six small"
              id={`pan-${this.props.data.id}-${i + 1}`}
              min={-24}
              max={24}
              step={1}
              unit={" st"}
              value={this.props.data.value[i]}
              action={{
                type: 'UPDATE_MIDI_VALUE_ARRAY',
                id: this.props.data.id,
                index: i
              }}
              />
          ))}
        </div>
      </Item>
		)
	}
}

export default connect()(Chord)
