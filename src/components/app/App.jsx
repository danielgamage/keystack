import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindKeyboardEvents, unbindKeyboardEvents } from '@/utils/keyboard'

import {
  TrackSettings,
  StatusBar,
  Visualizers,
} from '@/components'

class App extends Component {
  componentDidMount () {
    bindKeyboardEvents()
  }

  componentWillUnmount () {
    unbindKeyboardEvents()
  }

  render () {
    return (
      <div className='app'>
        <StatusBar />
        <main>
          <Visualizers />
          <TrackSettings />
        </main>
      </div>
    )
  }
}

export default connect()(App)
