import React, { Component } from 'react'
import { connect } from 'react-redux'

import Settings from '../Settings.jsx'
import Icon from '../Icon.jsx'
import matchChords from '../../utils/matchChords'
import eyeIcon from '../../images/eye.svg'

class NoteHUD extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showHUD: true
    }
  }
  switchTabs (tab) {
    this.setState({tab: tab})
  }
  render () {
    let matches = []
    let root
    if (this.state.showHUD === true && this.props.notes[this.props.midiReadPosition].length > 0) {
      matches = matchChords([...this.props.notes[this.props.midiReadPosition]])
    }
    return (
      <div className='note-hud info-section'>
        <div className='section-icon'>
          <Icon
            className={`icon icon--eye ${this.state.showHUD && 'on'}`}
            onClick={() => {
              this.setState({showHUD: !this.state.showHUD})
            }}
            src={eyeIcon}
            />
        </div>
        {(this.state.showHUD === true) &&
        <div>
          <div>
            <div className='viewer note-viewer'>{
                this.props.notes[this.props.midiReadPosition].length > 0
                ? this.props.notes[this.props.midiReadPosition].map(el => (
                  <span className='notes'>{el.note}<sub>{el.octave}</sub></span>
                ))
                : <span className='empty'>Notes will appear here.</span>
              }</div>
            <div className='viewer chord-viewer'>{
                matches.length > 0
                ? matches.map((match, i, arr) => (
                  <span className='chord'>
                    <span className='root'>{match.root}</span><span className='name'>{match.name}</span>
                  </span>
                ))
                : <span className='empty'>Matched chords will appear here.</span>
              }</div>
          </div>
        </div>
        }
      </div>
    )
  }
}

function mapStateToProps (state) {
  return { notes: state.notes, view: state.view }
}

export default connect(mapStateToProps)(NoteHUD)
