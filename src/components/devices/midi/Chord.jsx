import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import vars from '@/variables'
import { format } from 'd3-format'

import {
  NumericInput,
  Item,
  Text,
  Popover,
} from '@/components'

import {chords, groupedChords} from '@/data/chords'

const StyledChordDevice = styled.div`
  .top {
    display: flex;
  }

  .chord-pads {
    position: relative;
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    height: 128px;
    width: 212px;
    margin: 0 0 8px 0;
    .pad {
      margin: 0 0 8px 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: calc((100% / 4) - 5px);
      height: 32px;
      overflow: hidden;
      background-color: ${vars.grey_1};
      border-radius: 4px;
      cursor: pointer;
    }
  }

  .chord-inversion-props {
    padding-left: 16px;
  }

  .chord-list-popover {
    height: 200px
  }

  .chord-list {
    height: 128px;
    overflow-y: auto;
    padding: 12px 16px;
    margin: 8px 0;
    background-color: ${vars.black};
  }

  .chord-group-title {
    margin: 16px 0 4px;
    &:first-child {
      margin-top: 0;
    }
  }

  .chord-set {
    color: ${vars.grey_4}
  }

  .flex-container {
    .numeric-input {
      width: calc(100% / 8);
    }
  }
`

class Chord extends Component {
  constructor(props) {
    super(props)

    this.state = {
      favorites: [
        'Major',
        'Major 7th',
        'Major 7th sharp 11th',
        'Major 6th',

        'Minor',
        'Minor 7th',
        'Minor 9th',
        'Minor 6th',

        'Power',
        'Suspended 2nd',
        'Suspended 4th',
        'Augmented',
      ],

      isPickerOpen: false,
    }
  }

  render () {
    const favorites = this.state.favorites.map(fave => (
      chords.find(chord => fave === chord.name)
    ))

    return (
      <Item type='midi' index={this.props.index} item={this.props.data}>
        <StyledChordDevice>
          <div className='top'>
            <div className='chord-pads'>
              {favorites.map(chord => (
                <div
                  className='pad'
                  onClick={() => {
                    this.setState({isPickerOpen: true})
                    this.props.dispatch({
                      type: 'UPDATE_DEVICE',
                      id: this.props.data.id,
                      property: 'value',
                      value: chord.naturalSet || [0,0,0,0],
                    })
                  }}
                >
                  <Text>
                    <span dangerouslySetInnerHTML={{__html: chord.abbr || chord.name}} />
                  </Text>
                </div>
              ))}

              <Popover
                isOpen={this.state.isPickerOpen}
                onClickOutside={() => {
                  this.setState({isPickerOpen: false})
                }}
                className='chord-list-popover'
              >
                <div className='chord-list'>
                  {Object.keys(groupedChords).map(group => ([
                    <Text className='chord-group-title' type='h3'>{group}</Text>,

                    groupedChords[group].map(chord => (
                      <Text
                        onClick={() => {
                          this.props.dispatch({
                            type: 'UPDATE_DEVICE',
                            id: this.props.data.id,
                            property: 'value',
                            value: chord.naturalSet,
                          })
                        }}
                      >
                        <span>{chord.name}</span>
                        &nbsp;
                        <span className='chord-set'>({chord.naturalSet.join(', ')})</span>
                      </Text>
                    ))
                  ]))}
                </div>
              </Popover>
            </div>

            <div className='chord-inversion-props'>
              <Text type='h3'>Inversions</Text>

              <NumericInput
                label='Chance'
                className='numeric-input small'
                min={0}
                max={100}
                step={1}
                displayValue={format('.0%')(this.props.data.inversionChance / 100)}
                value={this.props.data.inversionChance}
                onInput={(event) => {
                  this.props.dispatch({
                    type: 'UPDATE_DEVICE',
                    id: this.props.data.id,
                    property: 'inversionChance',
                    value: event,
                  })
                }}
              />

              <NumericInput
                label='Range'
                className='numeric-input small'
                min={0}
                max={4}
                step={1}
                unit=' oct'
                value={this.props.data.inversionRange}
                onInput={(event) => {
                  this.props.dispatch({
                    type: 'UPDATE_DEVICE',
                    id: this.props.data.id,
                    property: 'inversionRange',
                    value: event,
                  })
                }}
              />
            </div>
          </div>

          <div className='flex-container'>
            {this.props.data.value.map((el, i) => (
              <NumericInput
                key={i}
                label={`Note #${i + 1}`}
                showLabel={false}
                className='numeric-input small'
                id={`pan-${this.props.data.id}-${i + 1}`}
                min={-24}
                max={24}
                step={1}
                unit='st'
                displayValue={format('+')(this.props.data.value[i])}
                value={this.props.data.value[i]}
                onInput={(event) => {
                  this.props.dispatch({
                    type: 'UPDATE_DEVICE_ARRAY',
                    id: this.props.data.id,
                    property: 'value',
                    index: i,
                    value: event,
                  })
                }}
                />
            ))}
          </div>
        </StyledChordDevice>
      </Item>
    )
  }
}

export default connect()(Chord)
