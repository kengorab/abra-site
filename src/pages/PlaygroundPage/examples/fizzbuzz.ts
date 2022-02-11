export default {
  label: 'Fizzbuzz',
  modules: [
    {
      name: './fizzbuzz',
      label: 'fizzbuzz.abra',
      code: `
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
    }
  ]
}
