import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
  NoteHUD,
  RadialKeys,
} from '@/components'

class Visualizers extends Component {
  constructor (props) {
    super(props)
    this.state = {
      midiReadPosition: 'input'
    }
  }
  render () {
    return (
      <div className='play-area'>
        <button
          title={'Change where visualizers read notes from: pre or post-FX'}
          onClick={() => {
            this.setState({midiReadPosition: this.state.midiReadPosition === 'input' ? 'output' : 'input'})
          }}
          className='button input-output-switch'>
          {this.state.midiReadPosition}
        </button>

        <RadialKeys midiReadPosition={this.state.midiReadPosition} />
        <NoteHUD midiReadPosition={this.state.midiReadPosition} />
      </div>
    )
  }
}

function mapStateToProps (state) {
  return { textBoxes: state.textBoxes, view: state.view }
}

export default connect(mapStateToProps)(Visualizers)
