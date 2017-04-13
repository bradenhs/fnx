## Describing State

FNX requires you to describe data with models. Using this information FNX can perform helpful type
checking and serialization/deserialization of your state tree even though it may contain complex
properties such as `Date` objects. Models are described with ES6 classes. Below is an example of
a description of the state of an app:

```javascript
import fnx from 'fnx'

class Message extends fnx.Model {
  @fnx.readonly id = fnx.string
  text = fnx.string
  authorId = fnx.string

  @fnx.computed getAuthor() {
    return this.getRoot().users[this.authorId]
  }
}

class User extends fnx.Model {
  @fnx.readonly id = fnx.string
  firstName = fnx.string
  @fnx.optional lastName = fnx.string
  dateOfBirth = fnx.complex.date

  @fnx.computed getFullname() {
    return this.firstName + ' ' + this.lastName
  }

  @fnx.action changeName(firstName, lastName) {
    this.firstName = firstName
    this.lastName = lastName
  }
}

class App extends fnx.Model {
  users = fnx.mapOf(User)
  messages = fnx.mapOf(Message)

  @fnx.action addUser(id, firstName, lastName) {
    this.users[id] = {
      id, firstName, lastName
    }
  }

  @fnx.action addMessage(id, text, author) {
    this.messages[id] = {
      id, text, authorId: author.id
    }
  }
}

const app = new App({
  users: { },
  messages: { }
})
```

Refer to the api reference for questions regarding how individual parts of the api behave in the above
code. Once initialized the app object is free to be used by the rest of your application. It is
just a transparent wrapper around the core primitive values and you can interact with it in the same
way you would any other javascript object. There are several thing to keep in mind with fnx objects:

- Mutations are restricted to actions
- Properties marked with `@fnx.readonly` can never be mutated after being set originally
- An error will be thrown if you try to assign extraneous properties on an fnx.object (i.e. any
property not specified in the model)
- An error witll be thrown if you leave out properties when initializing an fnx.object (expect, of
course, when that property has been marked as optional)
- Actions, computed properties, and other methods are virtual. They are non-enumerable properties
of your state tree.
