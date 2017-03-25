// TODO:
// - make <input> invisible unless focused and show <output> with unit

import { h, Component } from 'preact'
import { connect } from 'preact-redux'
import { arc } from 'd3-shape'
import { scaleLinear, scaleLog } from 'd3-scale'

import { range } from 'd3-array'

class NumericInput extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showInput: false
    }
    this.handleFocus = this.handleFocus.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
    this.scale = this.scale.bind(this)
    this.unscale = this.unscale.bind(this)
    this.onDrag = this.onDrag.bind(this)
    this.onMouseDown = this.onMouseDown.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
    this.onChange = this.onChange.bind(this)
    this.updateStore = this.updateStore.bind(this)
    this.initialX = 0
    this.mouseDownX = 0
    this.mouseDownY = 0
  }
  handleFocus (e) {
    this.setState({
      showInput: true
    })
  }
  handleBlur (e) {
    this.setState({
      showInput: false
    })
  }
  onMouseDown (e) {
    e.preventDefault()
    this.initialX = e.pageX || e.touches[0].pageX
    this.mouseDownX = e.pageX || e.touches[0].pageX
    this.mouseDownY = e.pageY || e.touches[0].pageY
    this.element.classList.add('active')
    document.addEventListener('mousemove', this.onDrag)
    document.addEventListener('mouseup', this.onMouseUp)
    document.addEventListener('touchmove', this.onDrag)
    document.addEventListener('touchend', this.onMouseUp)
    document.body.classList.add('cursor--lr')
  }
  onMouseUp (e) {
    const currentMouseDownX = e.pageX || e.touches[0].pageX
    const currentMouseDownY = e.pageY || e.touches[0].pageY
    if (this.mouseDownX === currentMouseDownX && this.mouseDownY === currentMouseDownY) {
      document.querySelector(`#${this.props.id}`).focus()
    }
    this.element.classList.remove('active')
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

    if (e.movementX !== undefined) {
      movement = e.movementX
    } else {
      if (e.pageX !== undefined) {
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
    value = (this.props.min !== undefined) ? Math.max(this.props.min, value) : value
    value = (this.props.max !== undefined) ? Math.min(this.props.max, value) : value
    value = Math.round(value * 100) / 100

    this.updateStore(value, 'value')
  }
  onChange (e) {
    const value = parseFloat(e.target.value)
    this.updateStore(value)
  }
  updateStore (v) {
    this.props.dispatch({
      ...this.props.action,
      value: v
    })
  }
  angle (value) {
    const scale = this.props.scale || 1
    let angle
    if (scale !== 1) {
      angle = scaleLog()
        .domain([this.props.min, this.props.max])
        .range([Math.PI / 2 * 2.5, Math.PI / 2 * 5.5])
        .base(scale)
    } else {
      angle = scaleLinear()
        .domain([this.props.min, this.props.max])
        .range([Math.PI / 2 * 2.5, Math.PI / 2 * 5.5])
    }
    return angle(value)
  }
  render () {
    var arcPath = arc()

    return (
      <div
        class={`control fader ${this.props.class} ${this.props.disabled ? 'disabled' : ''}`}
        ref={(c) => this.element = c}>
        <label
          htmlFor={this.props.id}
          class={`ControlTitle`}
          title={this.props.label}
          >
          {this.props.showLabel !== false &&
            <span class='label-text'>{this.props.label}</span>
          }
        </label>
        <svg
          viewBox='0 0 32 32'
          class={`draggable`}
          onMouseDown={this.onMouseDown.bind(this)}
          onTouchStart={this.onMouseDown.bind(this)}
          >
          <circle
            vector-effect='non-scaling-stroke'
            class='fader-knob'
            cx={16}
            cy={16}
            r='10'
            />
          <path
            vector-effect='non-scaling-stroke'
            class='fader-track'
            transform='translate(16, 16)'
            d={arcPath({
              innerRadius: 14,
              outerRadius: 14,
              startAngle: this.angle(this.props.min),
              endAngle: this.angle(this.props.max)
            })}
            />
          <path
            vector-effect='non-scaling-stroke'
            class='fader-value'
            transform='translate(16, 16)'
            d={arcPath({
              innerRadius: 14,
              outerRadius: 14,
              startAngle: this.angle(this.props.min),
              endAngle: this.angle(this.props.value)
            })}
            />
        </svg>
        <div className='input-output'>
          <output
            for={this.props.id}
            class={!this.state.showInput && 'active'}
            >
            {this.props.displayValue !== undefined ? this.props.displayValue : this.props.value}
            <span class='suffix'>{this.props.unit}</span>
          </output>
          <input
            class={this.state.showInput && 'active'}
            id={this.props.id}
            type='number'
            disabled={this.props.disabled}
            inputMode='numeric'
            min={this.props.min}
            max={this.props.max}
            value={this.props.value}
            step={this.props.step}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            defaultValue={this.props.defaultValue}
            onChange={this.onChange.bind(this)}
            />
        </div>
      </div>
    )
  }
}

export default connect()(NumericInput)
