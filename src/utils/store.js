import { createStore } from 'redux'
import reducer from '../reducers'

export const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

export const saveProject = () => {
  const downloadLink = document.createElement('a')
  downloadLink.href = `data:text/json;charset=utf-8,${encodeURIComponent( JSON.stringify(store.getState()) )}`
  downloadLink.download = `${Date.now()}.keystack`
  downloadLink.click()
}

export const loadProject = () => {
  const fileUpload = document.createElement('input')
  fileUpload.type = "file"
  fileUpload.onchange = (e) => {
    const file = [...e.target.files][0]
    readFile(file).then((jsonObject) => {
      console.log(jsonObject)
      store.dispatch({
        type: 'LOAD_STATE',
        value: jsonObject
      })
    })
  }
  fileUpload.click()
}

const readFile = (file) => {
  return new Promise(function(resolve, reject) {
    let reader = new FileReader()
    reader.addEventListener('load', () => {
      const data = JSON.parse(reader.result)
      resolve(data)
    }, false)
    reader.readAsText(file)
  });
}
