import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { text, boolean, color, number } from '@storybook/addon-knobs'

import NumericInput from '../src/components/NumericInput'
import Button from '../src/components/forms/Button'

storiesOf('NumericInput', module)
  .add('solo', () => {
    const min = number('Min', 30)
    const max = number('Max', 12000)
    const freqSlider = number('Frequency', 400, {
      range: true,
      min: min,
      max: max,
      step: 1,
    })
    return (
      <div>
        {freqSlider}
        <NumericInput
          label='tune'
          className='small'
          min={min}
          max={max}
          step='1'
          unit=' ct'
          displayValue={freqSlider}
          value={freqSlider}
          action={{
            type: 'UPDATE_OSC',
            property: 'detune'
          }}
          update={(v) => { action('updated value', v) }}
        />
      </div>

    )
  });

storiesOf('Button', module)
  .add('basic', () => {
    return (
      <Button onClick={action('clicked')}>{text('Button text', 'Input')}</Button>
    )
  })
