## @action

Actions decorate methods on your model and indicate which parts of your code can mutate the state of
your application.

```javascript
import fnx from 'fnx'

class Person extends fnx.Model {
  firstName = fnx.string
  lastName = fnx.string

  @fnx.action
  changeName(firstName, lastName) {
    this.firstName = firstName
    this.lastName = lastName
  }
}
```

Given the above example, we know that only the `changeName` method on the `Person` model may actually
mutate the first and last names. After instantiating the `Person` model the `changeName` method will
be available for use.

```javascript
// continued from above

const person = new Person({
  firstName: 'foo',
  lastName: 'bob'
})

person.changeName('foo2', 'bar2')

person.firstName // foo2
person.lastName // bar2
```

Actions may return values and they may be called from within one another. Only after the last action
has finished executing, however, will any reactions be run. Also middleware only runs when the first
action is called. If that action invokes any other actions middleware will not be run around them.
Nested actions are essentially transactions.
