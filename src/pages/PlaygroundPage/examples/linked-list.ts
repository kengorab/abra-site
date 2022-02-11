export default {
  label: 'Linked List (ish)',
  modules: [
    {
      name: './linked-list',
      label: 'linked-list.abra',
      code: `
type Node<T> {
  value: T
  next: Node<T>? = None
}

type LinkedList<T> {
  head: Node<T>? = None

  func push(self, item: T): LinkedList<T> { 
    if self.head |head| {
      var node = head
      while node.next |n| { node = n }
      node.next = Node(value: item)
    } else {
      self.head = Node(value: item)
    }
 
    self
  }
  
  func map<U>(self, fn: (T) => U): U[] {
    val newArr: U[] = []

    self.forEach(item => newArr.push(fn(item)))
    
    newArr
  }

  func forEach(self, fn: (T) => Unit): Unit {
    var node = self.head
    while node |n| {
      fn(n.value)
      node = n.next
    }
  }
}

val list = LinkedList<String>()
list.push("a")
  .push("bc")
  .push("def")
  .push("ghij")

list.map<Int>(item => item.length)
`.trimStart()
    }
  ]
}
