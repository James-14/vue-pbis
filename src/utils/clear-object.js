export default function clearObject(objectInfo) {
  for (let key in objectInfo) {
    objectInfo[key] = ''
  }
  return objectInfo
}