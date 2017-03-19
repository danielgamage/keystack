import { h, Component } from 'preact'
import { connect } from 'preact-redux'
import NumericInput from './NumericInput.jsx'
import KeySynth from './instruments/KeySynth.jsx'
import Filter from './effects/Filter.jsx'
import StereoPanner from './effects/StereoPanner.jsx'
import Transpose from './midi/Transpose.jsx'

const MidiEffectsByName = {
  "Transpose": Transpose
};
const InstrumentsByName = {
  "KeySynth": KeySynth
};
const AudioEffectsByName = {
  "Filter": Filter,
  "StereoPanner": StereoPanner
};

class Settings extends Component {
	render() {
    const midiEffects = this.props.midiEffects.map(effect => {
      const ComponentName = MidiEffectsByName[effect.midiEffectType]
      return (<ComponentName data={effect} />)
    })
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
        {midiEffects}
        <hr/>
        {instruments}
        <hr/>
        {audioEffects}
      </div>
		);
	}
}

function mapStateToProps (state) {
  return {
    instruments: state.instruments,
    audioEffects: state.audioEffects,
    midiEffects: state.midiEffects
  }
}

export default connect(mapStateToProps)(Settings)
