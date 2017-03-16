import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import reduce from '../reducers';
import * as actions from '../actions';
import chords from '../data/chords'

import Settings from './Settings.jsx'

import eyeIcon from '../images/eye.svg'


class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showHUD: true
    }
  }
  switchTabs (tab) {
    this.setState({tab: tab})
  }
	render() {
    let matches = []
    if (this.state.showHUD === true) {
      if (this.props.notes.length > 0) {
        const sortedNotes = [...this.props.notes].sort((a,b) => (a.index - b.index))
        const root = sortedNotes[0]
        const chord = sortedNotes.map(note => ((note.index - sortedNotes[0].index) % 12 ))
        matches = chords.filter(el => el.set.length === chord.length && el.set.every((e, i) => e === chord[i]))
      }
    }
		return (
      <div class="note-hud">
        <div class="section-icon">
          <svg
            class={`icon icon--eye ${this.state.showHUD && 'on'}`}
            onClick={() => {
              this.setState({showHUD: !this.state.showHUD})
            }}
            viewBox='0 0 32 32'>
            <use xlinkHref={eyeIcon + `#eye`}></use>
          </svg>
        </div>
        {(this.state.showHUD === true) &&
          <div>
            <div>
              <div class="viewer note-viewer">{
                this.props.notes.map(el => (
                  <span class="notes">{el.note}<sub>{el.octave}</sub></span>
                ))
              }</div>
              <div class="viewer chord-viewer">{
                matches.map(match => (
                  <span class="chord">
                    <span class="match">{root.note} {match.name} <span class="quality">{match.quality}</span></span>
                  </span>
                ))
              }</div>
            </div>
          </div>
        }
      </div>
		);
	}
}

function mapStateToProps (state) {
  return { notes: state.notes, view: state.view }
}

export default connect(mapStateToProps)(App)
