const walk = (el, path) => {
  const array = path.split('.')
  array.map(pathSegment => {
    el = el[pathSegment]
  })
  return el
}

const removeDuplicates = (array, path) => {
  return array.filter((el, i, arr) => {
    return arr.map(mapObj => (
      walk(mapObj, path)
    )).indexOf(walk(el, path)) === i;
  });
}

export default removeDuplicates
