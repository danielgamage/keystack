import { select, selectAll } from 'd3-selection'
import { axisLeft } from 'd3-axis'
import { scaleLinear } from 'd3-scale'
import { radialLine } from 'd3-shape'
import { range } from 'd3-array'

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { store } from './utils/store'

import {
  App
} from '@/components'

import './styles/style.scss'

//
// Redux
//

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector('#root')
)
