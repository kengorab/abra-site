export default {
  label: 'Enums',
  modules: [
    {
      name: '.enums',
      label: 'enums.abra',
      code: `
enum Color {
  Red
  Green
  Blue
  RGB(red: Int, green: Int, blue: Int)
  
  func hexCode(self): String {
    if self == Color.Red "0xFF0000"
    else if self == Color.Green "0x00FF00"
    else "0x0000FF"
  }
}

Color.Red.hexCode()
`.trimStart()
    }
  ]
}
