import React, { useEffect, useRef } from "react"
import { connect } from "react-redux"

import { line } from "d3-shape"
import { scaleLinear } from "d3-scale"
import { audioEffectNodes } from "utils/audio"
import { makeWaveshaperCurve } from "pipeline/audioEffects.js"
import { NumericInput, Item, Select } from "components"
import styled from "styled-components"

const StyledWaveshaper = styled.div`
  .vis {
    max-width: 120px;
    overflow: hidden;
  }
`

const parameters = [
  { name: "mix", unit: "%", min: 0, max: 100, scale: 1 },
  { name: "amount", unit: "%", min: 0, max: 300, scale: 1 },
  // { name: 'feedback',
  //   unit: '%',
  //   min: 0,
  //   max: 90,
  //   step: 1,
  //   scale: 1
  // }
]

const Waveshaper = (props) => {
  const viewBoxWidth = 256
  const viewBoxHeight = 256
  const x = scaleLinear().domain([0, 256]).range([0, 256])
  const y = scaleLinear().domain([-1, 1]).range([256, 0])
  const pathD = line()
    .x((d, i) => x(i))
    .y((d, i) => y(d))
  const svgElement = useRef(null)
  const originalCurve = Array(256) // [-1..1]
    .fill()
    .map((el, i) => (i / 256) * 2 - 1)
  const distortionCurve = makeWaveshaperCurve(props.data.amount, {
    samples: 256,
    method: props.data.method,
  })
  const mixedCurve = originalCurve.map(
    (el, i) =>
      el * (1 - props.data.mix / 100) +
      (distortionCurve[i] * props.data.mix) / 100
  )

  return (
    <Item type="audio" index={props.index} item={props.data}>
      <StyledWaveshaper>
        <Select
          options={[
            { label: "Chebyshev", value: "chebyshev" },
            { label: "Depth", value: "depth" },
            { label: "Distortion", value: "distortion" },
            { label: "Sine", value: "sine" },
          ]}
          onUpdate={(event) => {
            props.dispatch({
              type: "UPDATE_DEVICE",
              id: props.data.id,
              property: "method",
              value: event,
            })
          }}
        />
        <div className="vis type--volume">
          <svg
            className="vis-path"
            id={`vis-${props.data.id}`}
            viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
            ref={svgElement}
          >
            <path className="vis-path--secondary" d={pathD(originalCurve)} />
            <path className="vis-path--primary" d={pathD(mixedCurve)} />
          </svg>
        </div>
        <div className="flex-container type--volume">
          {parameters.map((param) => (
            <NumericInput
              label={param.name}
              id={param.name}
              min={param.min}
              max={param.max}
              scale={param.scale}
              unit={param.unit}
              displayValue={props.data[param.name]}
              value={props.data[param.name]}
              onInput={(event) => {
                props.dispatch({
                  type: "UPDATE_DEVICE",
                  id: props.data.id,
                  property: param.name,
                  value: event,
                })
              }}
            />
          ))}
        </div>
      </StyledWaveshaper>
    </Item>
  )
}

export default connect()(Waveshaper)
