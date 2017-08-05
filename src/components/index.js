// const req = require.context('./', true, /\.vue$|\.jsx/)
//
// let demos = {}
//
// const convertToTitleCase = (string) => {
//   return string[0].toUpperCase() + string.substr(1)
// }
//
// req.keys().map((filename) => {
//   const pathFragments = filename
//     .replace('./', '')
//     .replace('.jsx', '')
//     .split('/')
//
//   const componentName = pathFragments[
//     pathFragments.length - 1
//   ]
//
//   demos[componentName] = filename
// })
//
// console.log(demos)
//
// Object.keys(demos).map((key) => {
//   console.log('——————————')
//   console.log(key, demos[key])
//   console.log(req(demos[key]))
//   demos[key] = req(demos[key])
// })
//
// console.log(demos)
//
// export default demos

export {default as Icon} from './elements/Icon'
export {default as Kbd} from './elements/Kbd'

export {default as Button} from './forms/Button'
export {default as NumericInput} from './forms/NumericInput'

export {default as MIDI} from './ui/MIDI'
