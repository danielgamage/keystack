import { h, Component } from 'preact'
import { connect } from 'preact-redux'
import NumericInput from './NumericInput.jsx'
import Envelope from './Envelope.jsx'
import Oscillators from './Oscillators.jsx'

class Settings extends Component {
	render() {
		return (
      <div class="settings">
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
