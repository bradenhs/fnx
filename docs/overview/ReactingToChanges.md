## Reacting to Changes

A key part of FNX is the ability to painlessly react to updates in your data. Using principles of
[transparent reactive programming](/#transparent-reactive-programming) FNX makes listening for
changes and triggering relavant updates as simple as reading data. This is how it works:

- Simply use data from your state tree.
- By accessing a property inside of a [reaction](/docs/api/reaction.md),
[computed property](/docs/api/computed.md), or [ReactiveComponent](/docs/api/ReactiveComponent.md)
it will automatically be observed.
- When you mutate your state through [actions](/docs/api/action.md) FNX will automatically invoke
any reactions that were observing that part of the state.

[ES6 Proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
make it so FNX can do all of this completely transparently. There's no need to learn a fancy new API
to make this happen. Just mutate data. That's it - FNX takes care of the rest.
