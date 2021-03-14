export default {
  label: 'Fibonacci',
  modules: [
    {
      name: '.fibonacci',
      label: 'fibonacci.abra',
      code: `
func fib(n: Int): Int {
  if (n == 0) {
    0
  } else if (n == 1) {
    1
  } else {
    fib(n - 2) + fib(n - 1)
  }
}

fib(12)
`.trimStart()
    }
  ]
}
