import { h, Component } from 'preact'
import { connect } from 'preact-redux'
import NumericInput from './NumericInput.jsx'
import KeySynth from './instruments/KeySynth.jsx'

const InstrumentsByName = {
  "KeySynth": KeySynth
};

class Settings extends Component {
	render() {
    const instruments = this.props.instruments.map(instrument => {
      const ComponentName = InstrumentsByName[instrument.type]
      return (
        <ComponentName data={instrument} />
      )
    })
		return (
      <div class="settings">
        {instruments}
      </div>
		);
	}
}

function mapStateToProps (state) {
  return { instruments: state.instruments }
}

export default connect(mapStateToProps)(Settings)
