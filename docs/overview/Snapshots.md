## Snapshots

Snapshots allow you to capture your state tree at a specific point in time. They can then later
be applied back to your state tree to restore your state to a previous value. What's more snapshots
can be constructed in a completely serializable way. This means they can easily be persisted and
transported. Coupled [reactions](/docs/api/reaction.md) snapshots can give you a reliable
persistence system with practically no code.

```javascript
reaction(() => {
  const snapshot = app.getSnapshot({ asString: true })
  persistAStringBlob(snapshot)
})
```

And then when you are first initializing your app:

```javascript
const app = new App({ ... })

getPersistedStringBlob(snapshot => {
  app.applySnapshot(snapshot)
})
```

Relevant methods:

- [getSnapshot](/docs/api/getSnapshot.md)
- [applySnapshot](/docs/api/applySnapshot.md)

Of course, such an approach probably isn't satisfactory for most situations but it does give you an
idea about the power of snapshotting your state. (Note similiar patterns could be applied but in a
more efficient way with [middlware](/docs/overview/Middleware.md) and the
[applyDiffs](/docs/api/applyDiffs.md) method.)
