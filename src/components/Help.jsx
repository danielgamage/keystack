import React, { Component } from 'react'
import Icon from './Icon.jsx'

import helpIcon from '../images/help.svg'

const keyboardRows = [
  {
    color: 'black',
    keys: [
      { key: `Q`, disabled: true },
      { key: `W`, disabled: false },
      { key: `E`, disabled: false },
      { key: `R`, disabled: true },
      { key: `T`, disabled: false },
      { key: `Y`, disabled: false },
      { key: `U`, disabled: false },
      { key: `I`, disabled: true },
      { key: `O`, disabled: false },
      { key: `P`, disabled: false },
      { key: `[`, disabled: true },
      { key: `]`, disabled: false }
    ]
  },
  {
    color: 'white',
    keys: [
      { key: `A`, disabled: false },
      { key: `S`, disabled: false },
      { key: `D`, disabled: false },
      { key: `F`, disabled: false },
      { key: `G`, disabled: false },
      { key: `H`, disabled: false },
      { key: `J`, disabled: false },
      { key: `K`, disabled: false },
      { key: `L`, disabled: false },
      { key: `;`, disabled: false },
      { key: `'`, disabled: false }
    ]
  }
]

class Help extends Component {
  constructor (props) {
    super(props)
    this.state = {
      active: false
    }
  }
  render () {
    return (
      <div>
        <button
          className='button--status'
          title={`${this.state.active ? 'Close' : 'Open'} Help Panel`}
          onClick={(e) => {
            this.setState({ active: !this.state.active })
          }}
          >
          <Icon
            className={`icon icon--help`}
            src={helpIcon}
            />
        </button>
        <div className={`help-container ${this.state.active ? 'active' : ''}`}>
          <h2 className='title'>Help</h2>
          <div className='flex-container'>
            <section>
              <h3>octave</h3>
              <kbd title='z shifts octave down'>z</kbd>/<kbd title='x shifts octave up'>x</kbd>
            </section>
            <section>
              <h3>notes</h3>
              <div className='keyboard'>
                {keyboardRows.map(row => (
                  <div key={row.color} className={`row ${row.color}`}>
                    {row.keys.map(key => (
                      <kbd key={key.key} disabled={key.disabled}>{key.key}</kbd>
                      ))}
                  </div>
                  ))}
              </div>
            </section>
          </div>
          <button
            className='button'
            onClick={(e) => {
              this.setState({ active: !this.state.active })
            }}
            >
            {`${this.state.active ? 'Close' : 'Open'} Help Panel`}
          </button>
        </div>
      </div>
    )
  }
}

export default Help