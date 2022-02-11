export default {
  label: 'Greeting',
  modules: [
    {
      name: './greeting',
      label: 'greeting.abra',
      code: `
val greeting = "Hello"

func greet(recipient: String): String = greeting + ", " + recipient

val languageName = "Abra"
greet(languageName)
`.trimStart()
    }
  ]
}
