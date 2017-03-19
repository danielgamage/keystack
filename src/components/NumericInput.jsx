// TODO:
// - make <input> invisible unless focused and show <output> with unit
// - allow log scaling

import { h, Component } from 'preact'
import { connect } from 'preact-redux'
import { arc } from "d3-shape"
import { scaleLinear } from "d3-scale"
import { range } from "d3-array"


class NumericInput extends Component {
  constructor (props) {
    super(props)
    this.scale = this.scale.bind(this)
    this.unscale = this.unscale.bind(this)
    this.onDrag = this.onDrag.bind(this)
    this.onMouseDown = this.onMouseDown.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
    this.updateStore = this.updateStore.bind(this)
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
  scale (value) {
    const scale = this.props.scale || 1
    if (scale !== 1) {
      value = Math.log(value) / Math.log(scale)
    }
    return value
  }
  unscale (value) {
    const scale = this.props.scale || 1
    if (scale !== 1) {
      value = scale ** value
    }
    return value
  }
  onDrag (e) {
    let value = this.props.value || 0
    let movement

    value = this.scale(value)

    if (e.movementX != undefined) {
      movement = e.movementX
    } else {
      if (e.pageX != undefined) {
        movement = e.pageX - this.initialX
        this.initialX = e.pageX
      } else {
        movement = e.touches[0].pageX - this.initialX
        this.initialX = e.touches[0].pageX
      }
    }

    let step = this.props.step || 1
    value = (movement * (step || 1)) + value
    value = this.unscale(value)
    value = (this.props.min != undefined) ? Math.max(this.props.min, value) : value
    value = (this.props.max != undefined) ? Math.min(this.props.max, value) : value
    value = Math.round(value * 100) / 100

    this.updateStore(value, 'value')
  }
  onChange (e) {
    this.updateStore(e.target.value, 'value')
  }
  updateStore (v) {
    this.props.dispatch({
      ...this.props.action,
      value: v,
    })
  }
  render () {
    var arcPath = arc();

    var angle = scaleLinear()
      .domain([this.props.min, this.props.max])
      .range([Math.PI / 2 * 2.5, Math.PI / 2 * 5.5])

    return (
      <div class={`control fader ${this.props.class} ${this.props.disabled ? 'disabled' : ''}`}>
        <label
          htmlFor={this.props.id}
          class={`ControlTitle draggable`}
          onMouseDown={this.onMouseDown.bind(this)}
          onTouchStart={this.onMouseDown.bind(this)}
          >
          <span class="label-text">{this.props.label}</span>
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
              d={arcPath({
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
              d={arcPath({
                innerRadius: 14,
                outerRadius: 14,
                startAngle: angle(this.props.min),
                endAngle: angle(this.props.value)
              })}
              />
          </svg>
          <input
            id={this.props.id}
            type='number'
            disabled={this.props.disabled}
            inputMode='numeric'
            min={this.props.min}
            max={this.props.max}
            value={this.props.value}
            step={this.props.step}
            defaultValue={this.props.defaultValue}
            onChange={this.onChange.bind(this)}
            />
        </label>
      </div>
    )
  }
}

export default connect()(NumericInput)
