import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import vars from '@/variables'

import {
  Icon,
  ThemeSettings,
  Kbd,
  Popover
} from '@/components'

import helpIcon from '@/images/icon/help.svg'

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

const StyledHelpContainer = styled.div`
  background: ${vars.grey_7};
  border-radius: ${vars.radius};
  box-shadow: 0 0 2rem rgba(0, 0, 0, 0.2);
  padding: 2rem;
  width: calc(100vw - 8rem);
  max-width: 32rem;
  max-height: calc(100vh - 8rem);
  z-index: 10;
  section {
    margin-right: 2rem;
  }
  .flex-container {
    margin: 2rem 0;
  }
  .title {
    width: 100%;
  }

  .row {
    display: flex;
    justify-content: center;
    kbd {
      margin: 0.1rem;
      &[disabled] {
        opacity: 0.2;
      }
    }
    &.black {
      kbd {
        border-color: ${vars.grey_0};
      }
    }
    &.white {
      kbd {
        color: ${vars.grey_0};
        background: ${vars.grey_6};
        border-color: ${vars.grey_4};
      }
    }
  }
`
const StyledHelp = styled.div`
  position: relative;

  .help-button {
    position: absolute;
    right: 1rem;
    bottom: 1rem;
    z-index: 11;
  }
`

class Help extends Component {
  constructor (props) {
    super(props)
    this.state = {
      active: false
    }

    this.togglePopover = this.togglePopover.bind(this)
  }

  togglePopover () {
    this.setState({ active: !this.state.active })
  }

  render () {
    return (
      <StyledHelp>
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
            scale={2}
          />
        </button>

        <Popover
          isOpen={this.state.active}
          onClickOutside={() => this.togglePopover()}
          place='below'
        >
          <StyledHelpContainer>
            <h2 className='title'>Help</h2>
            <div className='flex-container'>
              <section>
                <h3>octave</h3>
                <Kbd title='z shifts octave down'>z</Kbd>/<Kbd title='x shifts octave up'>x</Kbd>
              </section>
              <section>
                <h3>notes</h3>
                <div className='keyboard'>
                  {keyboardRows.map(row => (
                    <div key={row.color} className={`row ${row.color}`}>
                      {row.keys.map(key => (
                        <Kbd key={key.key} disabled={key.disabled}>{key.key}</Kbd>
                        ))}
                    </div>
                    ))}
                </div>
              </section>
            </div>
            <div>
              <a className='button' href='https://github.com/danielgamage/keystack'>Keystack on GitHub</a>
            </div>
            <button
              className='button'
              onClick={(e) => {
                this.togglePopover()
              }}
              >
              {`${this.state.active ? 'Close' : 'Open'} Help Panel`}
            </button>
            <ThemeSettings
              prefs={this.props.theme}
              onInput={(event) => {
                this.props.dispatch({
                  type: 'UPDATE_THEME',
                  value: event
                })
              }}
            />
          </StyledHelpContainer>
        </Popover>
      </StyledHelp>
    )
  }
}


function mapStateToProps (state) {
  return {
    theme: state.preferences.theme,
  }
}

export default connect(mapStateToProps)(Help)
