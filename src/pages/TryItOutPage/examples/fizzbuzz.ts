export default `
// Hint: Check the console for println outputs!

for a in range(1, 101) {
  if a % 15 == 0 {
    println("Fizzbuzz")
  } else if a % 3 == 0 {
    println("Fizz")
  } else if a % 5 == 0 {
    println("Buzz")
  } else {
    println(a)
  }
}`.trimStart()