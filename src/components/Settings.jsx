import { h, Component } from 'preact'
import { connect } from 'preact-redux'
import NumericInput from './NumericInput.jsx'

import KeySynth from './instruments/KeySynth.jsx'
import Filter from './effects/Filter.jsx'
import StereoPanner from './effects/StereoPanner.jsx'
import Compressor from './effects/Compressor.jsx'
import Transpose from './midi/Transpose.jsx'
import Chord from './midi/Chord.jsx'

const MidiEffectsByName = {
  "Transpose": Transpose,
  "Chord": Chord
};
const InstrumentsByName = {
  "KeySynth": KeySynth
};
const AudioEffectsByName = {
  "Filter": Filter,
  "StereoPanner": StereoPanner,
  "Compressor": Compressor
};

const insertHRs = (arr) => {
  const length = arr.length
  for (let i=1; i<length; i++) {
    arr.splice(length - i, 0, <hr />)
  }
  return arr
}

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
        <section class="settings-section">
          <h3 class="settings-title">Midi Effects</h3>
          {insertHRs(midiEffects)}
        </section>
        <hr class="section-splitter"/>
        <section class="settings-section">
          <h3 class="settings-title">Instruments</h3>
          {insertHRs(instruments)}
        </section>
        <hr class="section-splitter"/>
        <section class="settings-section">
          <h3 class="settings-title">Audio Effects</h3>
          {insertHRs(audioEffects)}
        </section>
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
