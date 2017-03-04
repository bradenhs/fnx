import {
  readonly, string, computed, action, createObservable,
  mapOf, object,
} from '../src/fnx'

class User {
  @readonly id = string

  firstName = string
  lastName = string

  fullName? = computed((user: User) => user.firstName + ' ' + user.lastName)

  changeName? = action((user: User) => (firstName, lastName) => {
    user.firstName = firstName
    user.lastName = lastName
    user.toString()
  })
}

class Message {
  @readonly id = string
  @readonly authorId = string

  contents = string

  author? = computed((message: Message, root: State) => root.users[message.authorId])

  /**
   * Hello there
   */
  updateMessage? = action((message: Message) => (contents: string) => {
    message.contents = contents
  })
}

class State {
  users = mapOf(object(User))
  messages = mapOf(object(Message))
}

const initialState: State = {
  users: {},
  messages: {}
}

const state = createObservable(State, initialState)

console.log(state.toString())
