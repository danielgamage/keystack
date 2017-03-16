import { h, Component } from 'preact'
import { connect } from 'preact-redux'
import * as d3 from 'd3'
import { arc } from "d3-shape"
import { scaleLinear } from "d3-scale"
import { range } from "d3-array"


class NumericInput extends Component {
  constructor (props) {
    super(props)
    this.onDrag = this.onDrag.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
    this.initialX = 0
  }
  onMouseDown (e) {
    this.initialX = e.pageX || e.touches[0].pageX
    document.addEventListener('mousemove', this.onDrag)
    document.addEventListener('mouseup', this.onMouseUp)
    document.addEventListener('touchmove', this.onDrag)
    document.addEventListener('touchend', this.onMouseUp)
    document.body.classList.add('cursor--lr')
  }
  onMouseUp (e) {
    document.removeEventListener('mousemove', this.onDrag)
    document.removeEventListener('mouseup', this.onMouseUp)
    document.removeEventListener('touchmove', this.onDrag)
    document.removeEventListener('touchend', this.onMouseUp)
    document.body.classList.remove('cursor--lr')
  }
  onDrag (e) {
    var value = this.props.value || this.props.defaultValue || 0
    const movement = e.touches ? e.touches[0].pageX - this.initialX : e.movementX
    if (e.touches) {
      this.initialX = e.touches[0].pageX
    }

    // console.log(movement)
    let step = this.props.step || 1
    value += (movement * (step || 1))
    value = (this.props.min != undefined) ? Math.max(this.props.min, value) : value
    value = (this.props.max != undefined) ? Math.min(this.props.max, value) : value

    this.updateStore(value, 'value')
  }
  onChange (e) {
    this.updateStore(e.target.value, 'value')
  }
  onChangeUnit (e) {
    this.updateStore(e.target.value, 'unit')
  }
  updateStore (v, vOrU) {
    this.props.dispatch({
      type: this.props.action,
      key: this.props.actionKey || null,
      value: v,
      valueOrUnit: vOrU
    })
  }
  render () {
    var arc = d3.arc();

    var angle = scaleLinear()
      .domain([this.props.min, this.props.max])
      .range([Math.PI / 2 * 2.5, Math.PI / 2 * 5.5])

    return (
      <div class={`control fader ${this.props.class}`}>
        <label
          htmlFor={this.props.id}
          class='ControlTitle draggable'
          onMouseDown={this.onMouseDown.bind(this)}
          onTouchStart={this.onMouseDown.bind(this)}
          >
          {this.props.label}
          <svg viewBox="0 0 32 32">
            <circle
              vector-effect="non-scaling-stroke"
              class="fader-knob"
              cx={16}
              cy={16}
              r="14"
              />
            <path
              vector-effect="non-scaling-stroke"
              class="fader-track"
              transform="translate(16, 16)"
              d={arc({
                innerRadius: 14,
                outerRadius: 14,
                startAngle: angle(this.props.min),
                endAngle: angle(this.props.max)
              })}
              />
            <path
              vector-effect="non-scaling-stroke"
              class="fader-value"
              transform="translate(16, 16)"
              d={arc({
                innerRadius: 14,
                outerRadius: 14,
                startAngle: angle(this.props.min),
                endAngle: angle(this.props.value)
              })}
              />
          </svg>
        </label>
        <div class="input">
          <input
            id={this.props.id}
            type='number'
            inputMode='numeric'
            min={this.props.min}
            max={this.props.max}
            value={this.props.value}
            defaultValue={this.props.defaultValue}
            onChange={this.onChange.bind(this)}
            />
        </div>
      </div>
    )
  }
}

export default connect()(NumericInput)
