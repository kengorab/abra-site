export default `
val greeting = "Hello"

func greet(recipient: String) = greeting + ", " + recipient

val languageName = "Abra"
greet(languageName)
`.trimStart()