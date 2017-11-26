import { configure, addDecorator } from '@storybook/react'
import { withKnobsOptions } from '@storybook/addon-knobs'
import React from 'react'
import { ThemeProvider } from 'styled-components'

const req = require.context('../.stories', true, /\.js$/)

function loadStories () {
  req.keys().forEach((filename) => req(filename))
}

addDecorator(withKnobsOptions({
  // debounce: { wait: 200, leading: true }, // Same as lodash debounce.
  timestamps: true // Doesn't emit events while user is typing.
}))

const theme = {
  accent: 'orange',
  lightness: 'light',
}

addDecorator(function(getStory) {
  return (
    <ThemeProvider theme={theme}>
      {getStory()}
    </ThemeProvider>
  )
})

configure(loadStories, module)
