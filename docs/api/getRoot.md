## `getRoot`

Signature:

```javascript
this.getRoot() // where this is an instance of the state tree
```

Inside of a class method on your state tree `getRoot` can be used to retrieve
a reference to the root of your state tree. This is useful is many situations.
An example of it is shown below:

```javascript
import fnx from 'fnx'

class Note extends fnx.Model {
  @fnx.readonly id = fnx.string
  text = fnx.string
  authorId = fnx.string
  @fnx.computed getAuthor() {
    return this.getRoot().users[this.authorId]
  }
}

class User extends fnx.Model {
  @fnx.readonly id = fnx.string
  name = fnx.string
}

class App extends fnx.Model {
  notes = fnx.mapOf(fnx.object(Note))
  users = fnx.mapOf(fnx.object(User))
}

const app = new App({
  notes: { },
  users: { }
})
```

By instantiating the App model any property accessed through the app object
(e.g. app.notes['someid'].getAuthor()) will use app as the value returned by
`getRoot()`.
