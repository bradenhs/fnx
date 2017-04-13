## `getSnapshot`

Signature:

```javascript
stateTreeInstance.getSnapshot(options?: { asString?: boolean, asJSON?: boolean })
// where stateTreeInstance is an fnx.object, fnx.arrayOf, or fnx.mapOf
```

`getSnapshot` returns an immutable snapshot of the state tree from the point it is called.

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
  dateOfBirth: new Date(9000)
})

person.getSnapshot() // { firstName: 'foo', lastName: 'bar', dateOfBirth: }
person.getSnapshot({ asJSON: true })
person.getSnapshot({ asString: true })
```

The `getSnapshot` function is a built-in computed method on the state tree. This means the results
of `getSnapshot` are cached and when it is called and only the parts of the state tree whose
cache's were invalidated are recomputed. When not using the `{ asString: true }` option fnx is able
to use structural sharing between snapshots. Since snapshots are just composed of other snapshots
unmodified snapshotted children are shared among their containing snapshots.
