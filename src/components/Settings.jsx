import { h, Component } from 'preact'
import { connect } from 'preact-redux'
import reduce from '../reducers'
import * as actions from '../actions'
import Midi from './MIDI.jsx'
import NumericInput from './NumericInput.jsx'
import Envelope from './Envelope.jsx'
import Oscillators from './Oscillators.jsx'

import waveIcon from '../images/waves.svg'

class Settings extends Component {
	render() {
		return (
      <div class="settings">
        <Midi />
        <div>
          <Oscillators />
          <Envelope />
        </div>
      </div>
		);
	}
}

function mapStateToProps (state) {
  return { synth: state.synth }
}

export default connect(mapStateToProps)(Settings)
