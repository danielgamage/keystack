import { configure, addDecorator } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
import '../src/styles/global.sass'

const req = require.context('../.stories', true, /\.js$/)

function loadStories () {
  req.keys().forEach((filename) => req(filename))
}

addDecorator(withKnobs)

configure(loadStories, module)
