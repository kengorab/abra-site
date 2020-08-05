export default `
// We don't have generics yet, so this LinkedList will only work for Strings
  
type Node {
  value: String
  next: Node? = None
}

type LinkedList {
  head: Node? = None

  func push(self, item: String): LinkedList { 
    if self.head |head| {
      var node = head
      while node.next |n| { node = n }
      node.next = Node(value: item)
    } else {
      self.head = Node(value: item)
    }
 
    self
  }

  func forEach(self, fn: (String) => Unit): Unit {
    var node = self.head
    while node |n| {
      fn(n.value)
      node = n.next
    }
  }
}

val list = LinkedList()
  .push("a")
  .push("b")
  .push("c")
  .push("d")

// Iterate through the LinkedList, and push items into an array
var arr = []
list.forEach(item => arr.push(item))
arr
`.trimStart()