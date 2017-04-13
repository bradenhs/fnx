## `applySnapshot`

Signature:

```javascript
stateTreeInstance.applySnapshot(snapshot: string | object, options?: { asJSON: boolean})
// where stateTreeInstance is an fnx.object, fnx.arrayOf, or fnx.mapOf
```

Use applySnapshot to set a specific part of the state tree to a fnx snapshot.

```javascript
import fnx from 'fnx'

class Person extends fnx.Model {
  firstName = fnx.string
  lastName = fnx.string
  dateOfBirth = fnx.complex.date
}

const person = new Person({
  firstName: 'foo',
  lastName: 'bar',
  dateOfBirth: new Date(0)
})

person.applySnapshot({
  firstName: 'foo2',
  lastName: 'bar2',
  dateOfBirth: new Date(1000)
})

person.getSnapshot({ asString: true })
// '{"firstName":"foo2","lastName":"bar2","dateOfBirth":"Thu, 01 Jan 1970 00:00:01 GMT"}'

person.applySnapshot({
  firstName: 'foo3',
  lastName: 'bar3',
  dateOfBirth: 'Thu, 01 Jan 1970 00:00:05 GMT'
}, { asJSON: true })

person.getSnapshot({ asString: true })
// '{"firstName":"foo3","lastName":"bar3","dateOfBirth":"Thu, 01 Jan 1970 00:00:05 GMT"}'

person.applySnapshot(
  '{"firstName":"foo4","lastName":"bar4","dateOfBirth":"Thu, 01 Jan 1970 00:00:09 GMT"}'
)

person.getSnapshot({ asString: true })
// '{"firstName":"foo4","lastName":"bar4","dateOfBirth":"Thu, 01 Jan 1970 00:00:09 GMT"}'
```

As seen above `applySnapshot` can be used in three ways:

- Applying a snapshot with a js object that has complex properties in their complex form
- Applying a snapshot with a js object that has complex properties in their primitive form
- Applying a snapshot with a string

The output of `getSnapshot` can be used when applying a snapshot and that is probably most common,
but as shown above, you can easily create your own objects to pass into `appySnapshot`.
