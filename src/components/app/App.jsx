import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindKeyboardEvents, unbindKeyboardEvents } from '@/utils/keyboard'

import { ThemeProvider } from 'styled-components'

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
      <ThemeProvider theme={this.props.theme}>
        <div className='app'>
          <StatusBar />
          <main>
            <Visualizers />
            <TrackSettings />
          </main>
        </div>
      </ThemeProvider>
    )
  }
}

function mapStateToProps (state) {
  return {
    theme: state.preferences.theme,
  }
}

export default connect(mapStateToProps)(App)
