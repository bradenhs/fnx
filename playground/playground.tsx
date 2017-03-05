import {
  readonly, string, computed, action, createObservable,
  mapOf, object,
} from '../src/fnx'

class User {
  @readonly id = string

  firstName = string
  lastName = string

  fullName = computed(user => user.firstName + ' ' + user.lastName)

  changeName = action(user => (firstName, lastName) => {
    user.firstName = firstName
    user.lastName = lastName
  })
}

class Message {
  @readonly id = string
  @readonly authorId = string

  contents = string

  author = computed((message, root) => root.users[message.authorId])

  updateMessage = action(message => contents => {
    message.contents = contents
  })
}

class State {
  @readonly users = mapOf(object(User))
  messages = mapOf(object(Message))
}

const initialState: State = {
  users: {},
  messages: {}
}

const state = createObservable(State, initialState)

console.log(state.toString())
