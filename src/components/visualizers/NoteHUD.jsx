import React, { Component } from "react"
import { connect } from "react-redux"

import styled from "styled-components"

import matchChords from "utils/matchChords"

const StyledNoteHUD = styled.div`
  display: flex;
  margin-bottom: 1rem;
  color: var(--fg-1);

  .section-icon {
    margin-right: 0.5rem;
  }
  .viewer {
    margin-bottom: 0.5rem;
  }
  .note-viewer {
    font-weight: 700;
  }
  .chord-viewer {
    line-height: 1.5;
  }
  .empty {
    color: var(--fg-5);
  }
  .notes {
    display: inline-block;
    margin-right: 0.25rem;
    sub {
      font-weight: 400;
      color: var(--fg-5);
    }
  }
  .chord {
    margin-right: 1rem;
    .root {
      font-weight: 700;
      margin-right: 0.2em;
    }
  }
  sub {
    position: static;
    font-size: 1rem;
    vertical-align: baseline;
  }
`

class NoteHUD extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showHUD: true,
    }
  }
  switchTabs(tab) {
    this.setState({ tab: tab })
  }
  render() {
    let matches = []
    if (
      this.state.showHUD === true &&
      this.props.notes[this.props.midiReadPosition].length > 0
    ) {
      matches = matchChords([...this.props.notes[this.props.midiReadPosition]])
    }
    return (
      <StyledNoteHUD>
        {this.state.showHUD === true && (
          <div>
            <div>
              <div className="viewer note-viewer">
                {this.props.notes[this.props.midiReadPosition].length > 0 ? (
                  this.props.notes[this.props.midiReadPosition].map((el) => (
                    <span key={el.note + el.octave} className="notes">
                      {el.note}
                      <sub>{el.octave}</sub>
                    </span>
                  ))
                ) : (
                  <span className="empty">Notes will appear here.</span>
                )}
              </div>
              <div className="viewer chord-viewer">
                {matches.length > 0 ? (
                  matches.map((match, i, arr) => (
                    <span key={match.name} className="chord">
                      <span className="root">{match.root}</span>
                      <span className="name">{match.name}</span>
                    </span>
                  ))
                ) : (
                  <span className="empty">
                    Matched chords will appear here.
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </StyledNoteHUD>
    )
  }
}

function mapStateToProps(state) {
  return { notes: state.notes, view: state.view }
}

export default connect(mapStateToProps)(NoteHUD)
