const generateID = () => {
  const max = 16777216
  const min = 8
  const ID = `${new Date().getTime()}-${Math.floor(Math.random() * (max - min)) + min}`
  return ID
}

export default generateID
