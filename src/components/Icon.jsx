import { h, Component } from 'preact'
import 'whatwg-fetch'

class Icon extends Component {
  constructor (props) {
    super(props)
    this.state = {
      image: `<svg viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="10"></circle>
      </svg>`
    }
  }
  componentWillMount () {
    fetch(this.props.src).then(data => {
      return data.text()
    }).then(data => {
      this.setState({
        image: data
      })
    })
  }
  render () {
    return (
      <div
        {...this.props}
        dangerouslySetInnerHTML={{__html: this.state.image}}
        />
    )
  }
}

export default Icon
