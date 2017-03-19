import { h, Component } from 'preact'
import { connect } from 'preact-redux'
import NumericInput from './NumericInput.jsx'
import KeySynth from './instruments/KeySynth.jsx'
import Filter from './effects/Filter.jsx'
import StereoPanner from './effects/StereoPanner.jsx'

const InstrumentsByName = {
  "KeySynth": KeySynth
};
const AudioEffectsByName = {
  "Filter": Filter,
  "StereoPanner": StereoPanner
};

class Settings extends Component {
	render() {
    const instruments = this.props.instruments.map(instrument => {
      const ComponentName = InstrumentsByName[instrument.type]
      return (<ComponentName data={instrument} />)
    })
    const audioEffects = this.props.audioEffects.map(effect => {
      const ComponentName = AudioEffectsByName[effect.audioEffectType]
      return (<ComponentName data={effect} />)
    })
		return (
      <div class="settings">
        {instruments}
        <hr/>
        {audioEffects}
      </div>
		);
	}
}

function mapStateToProps (state) {
  return { instruments: state.instruments, audioEffects: state.audioEffects }
}

export default connect(mapStateToProps)(Settings)
