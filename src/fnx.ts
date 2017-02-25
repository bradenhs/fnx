import { string, complex, computed, mapOf, object, createState } from './api';

class UserDescription {
  id = string;
  firstName = string;

  /**
   * This is their last name.
   */
  lastName = string;

  dateOfBirth = complex((d: Date) => d.toUTCString(), v => new Date(v));

  fullName? = computed(() => this.firstName + ' ' + this.lastName);

  /**
   * This sets the name and is better for intellisense
   */
  setName?(first: string) {
    this.firstName = first;
  }
}

class StateDescription {
  users = mapOf(object(UserDescription));
  messages = mapOf(object(MessageDescription));
}

const initialState: StateDescription = {
  users: {},
  messages: {},
}

const state = createState(StateDescription, initialState);

class MessageDescription {
  contents = string;
  authorId = string;
  author = computed(() => state.users[this.authorId]);
}
