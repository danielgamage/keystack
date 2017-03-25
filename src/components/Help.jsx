import { h, Component } from 'preact'

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

class Icon extends Component {
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
          title={`${this.state.active ? 'Open' : 'Close'} Help Panel`}
          onClick={(e) => {
            this.setState({ active: !this.state.active })
          }}
          class='button help-button'
          >
          ?
        </button>
        <div class={`help-container ${this.state.active ? 'active' : ''}`}>
          <h2>Help</h2>
          <section>
            <h3>octave</h3>
            <kbd title='z shifts octave down'>z</kbd>/<kbd title='x shifts octave up'>x</kbd>
          </section>
          <section>
            <h3>notes</h3>
            <div class='keyboard'>
              {keyboardRows.map(row => (
                <div class={`row ${row.color}`}>
                  {row.keys.map(key => (
                    <kbd disabled={key.disabled}>{key.key}</kbd>
                    ))}
                </div>
                ))}
            </div>
          </section>
        </div>
      </div>
    )
  }
}

export default Icon
