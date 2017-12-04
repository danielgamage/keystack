export default {

    //
    // colors
    //

    grey_7: `#FDFCFB`,
    grey_6: `#E8E9EB`,
    grey_5: `#CDD1D3`,
    grey_4: `#949496`,
    grey_3: `#87878B`,
    grey_2: `#7C7C7F`,
    grey_1: `#5A5A5F`,
    grey_0: `#444649`,

    orange: `#ff9800`,
    orange_bright: `#ffa850`,

    accents: {
      orange: {
        dark: `#FF9800`,
        light: `#FFA850`,
      },
      red: {
        dark: `#F6736A`,
        light: `#FF9089`,
      },
      magenta: {
        dark: `#F067AB`,
        light: `#FF89C4`,
      },
      purple: {
        dark: `#9B7FF2`,
        light: `#BBA5FF`,
      },
      blue: {
        dark: `#67A0FA`,
        light: `#90BBFF`,
      },
      aqua: {
        dark: `#1AD3CC`,
        light: `#7BE4E0`,
      },
      green: {
        dark: `#7DD35B`,
        light: `#A8F489`,
      },
      yellow: {
        dark: `#FFD149`,
        light: `#FFEA77`,
      }
    },

    //
    // fonts
    //

    'sans': `'Source Sans Pro', sans-serif`,
    'sc': `'Source Sans Pro', sans-serif`,

    //
    // selectors
    //

    selectors: {
      svg_elements: `line, rect, path, circle, polygon, polyline`,
    },

    //
    // mixins
    //

    mixins: {
      sc: `
        font-family: 'Source Sans Pro', sans-serif;
        text-transform: uppercase;
        font-weight: 600;
        font-size: 0.8rem;
        letter-spacing: 0.2em;
        word-spacing: 0.1em;
        line-height: 1rem;
      `,

      button_reset: `
        line-height: 1;
        padding: 0;
        appearance: none;
        border: 0;
        cursor: pointer;
        background: none;
      `,

      button: `
        @extend %button-reset;
        padding: 0.2rem 0.4rem 0.25rem;
        background: $grey-1;
        color: $grey-6;
        border-radius: $radius;
        @extend %sc;
        &:hover,
        &:focus {
          background: $grey-2;
        }
      `,

      hidden_but_focusable: `
        position: absolute;
        width: 0;
        height: 0;
        overflow: hidden;
        display: block;
        opacity: 0;
      `,
    },

    'sc_mixin': `
      font-family: 'Source Sans Pro', sans-serif;
      text-transform: uppercase;
      font-weight: 600;
      font-size: 0.8rem;
      letter-spacing: 0.2em;
      word-spacing: 0.1em;
      line-height: 1rem;
    `,

    // appearance
    'radius': `0.2rem`,

    // media queries
    'vw-med': 'min-width: 36rem',
}
