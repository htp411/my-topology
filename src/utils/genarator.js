export default class Generator {
  static number2chartMapping = 'abcdfghijkl'

  static randomString() {
    const randomString = Math.random()
    return [...randomString.toString()]
      .map((c) => {
        if (c === '.') {
          return '-'
        }
        return Generator.number2chartMapping[+c] || '-'
      })
      .join('')
  }
}
