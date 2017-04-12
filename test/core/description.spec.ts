/**
 * Use this file for constructing new test suites without having to worry about
 * running all the tests every single time.
 *
 * Run with `yarn run playground` or `yarn run p`
 */

import { cloneDeep } from 'lodash'
import {
  action, arrayOf, boolean, complex, computed, mapOf, Model,
  number, object, oneOf, optional, readonly, string,
} from '../../src/api'
import { descriptionTypes, parseDescription } from '../../src/core'
import { catchErrType } from '../testHelpers'

const baseExpectedDescription = {
  readonly: true,
  optional: false,
  properties: { },
  type: descriptionTypes.object,
}

describe('parseDescription', () => {
  it('should parse empty description correctly', () => {
    class Description extends Model<Description> { }

    const actual = parseDescription(Description)
    const expected = cloneDeep(baseExpectedDescription)

    expect(actual).toEqual(expected)
  })

  it('should parse readonly properties correctly', () => {
    class Description extends Model<Description> {
      @readonly readonlyString = string
    }

    const actual = parseDescription(Description)
    const expected = cloneDeep(baseExpectedDescription)

    expected.properties = {
      readonlyString: {
        readonly: true,
        optional: false,
        type: descriptionTypes.string
      }
    }

    expect(actual).toEqual(expected)
  })

  it('should parse mixed readonly and non-readonly properties correctly', () => {
    class Description extends Model<Description> {
      @readonly readonlyString = string
      nonReadonlyString = string
    }

    const actual = parseDescription(Description)
    const expected = cloneDeep(baseExpectedDescription)

    expected.properties = {
      readonlyString: {
        readonly: true,
        optional: false,
        type: descriptionTypes.string,
      },
      nonReadonlyString: {
        readonly: false,
        optional: false,
        type: descriptionTypes.string,
      }
    }

    expect(actual).toEqual(expected)
  })

  it('should parse optional properties correctly', () => {
    class Description extends Model<Description> {
      @optional optionalString = string
    }

    const actual = parseDescription(Description)
    const expected = cloneDeep(baseExpectedDescription)

    expected.properties = {
      optionalString: {
        readonly: false,
        optional: true,
        type: descriptionTypes.string
      }
    }

    expect(actual).toEqual(expected)
  })

  it('should parse mixed optional and non-optional properties correctly', () => {
    class Description extends Model<Description> {
      @optional optionalString = string
      nonOptionalString = string
    }

    const actual = parseDescription(Description)
    const expected = cloneDeep(baseExpectedDescription)

    expected.properties = {
      optionalString: {
        readonly: false,
        optional: true,
        type: descriptionTypes.string,
      },
      nonOptionalString: {
        readonly: false,
        optional: false,
        type: descriptionTypes.string,
      }
    }

    expect(actual).toEqual(expected)
  })

  it('should throw when trying to parse a string', () => {
    const actual = catchErrType(() => (parseDescription as any)(''))
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should throw when trying to parse a number', () => {
    const actual = catchErrType(() => (parseDescription as any)(0))
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should throw when trying to parse a boolean', () => {
    const actual = catchErrType(() => (parseDescription as any)(false))
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should throw when trying to parse an object', () => {
    const actual = catchErrType(() => (parseDescription as any)({}))
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should parse action correctly', () => {
    class Description extends Model<Description> {
      firstName = string
      @action changeFirstName() { }
    }

    const actual = parseDescription(Description)
    const expected = cloneDeep(baseExpectedDescription)

    expected.properties = {
      firstName: {
        readonly: false,
        optional: false,
        type: descriptionTypes.string,
      },
      changeFirstName: {
        type: descriptionTypes.action, fn: (Description.prototype.changeFirstName as any).fn
      }
    }

    expect(actual).toEqual(expected)
  })

  it('should parse arrayOf number correctly', () => {
    class Description extends Model<Description> {
      nums = arrayOf(number)
    }

    const actual = parseDescription(Description)
    const expected = cloneDeep(baseExpectedDescription)

    expected.properties = {
      nums: {
        type: descriptionTypes.arrayOf,
        readonly: false,
        optional: false,
        kind: {
          readonly: false,
          optional: false,
          type: descriptionTypes.number,
        }
      }
    }

    expect(actual).toEqual(expected)
  })

  it('should parse arrayOf object correctly', () => {
    class Person extends Model<Description> {
      firstName = string
    }
    class Description extends Model<Description> {
      people = arrayOf(object(Person))
    }

    const actual = parseDescription(Description)
    const expected = cloneDeep(baseExpectedDescription)

    expected.properties = {
      people: {
        type: descriptionTypes.arrayOf,
        readonly: false,
        optional: false,
        kind: {
          readonly: false,
          optional: false,
          type: descriptionTypes.object,
          properties: {
            firstName: {
              readonly: false,
              optional: false,
              type: descriptionTypes.string
            }
          }
        }
      }
    }

    expect(actual).toEqual(expected)
  })

  it('should parse boolean correctly', () => {
    class Description extends Model<Description> {
      bool = boolean
    }

    const actual = parseDescription(Description)
    const expected = cloneDeep(baseExpectedDescription)

    expected.properties = {
      bool: {
        readonly: false,
        optional: false,
        type: descriptionTypes.boolean
      }
    }

    expect(actual).toEqual(expected)
  })

  it('should parse complex correctly', () => {
    const serialize = (d: Date) => d.toUTCString()
    const deserialize = (v: string) => new Date(v)
    class Description extends Model<Description> {
      date = complex(serialize, deserialize)
    }

    const actual = parseDescription(Description)
    const expected = cloneDeep(baseExpectedDescription)

    expected.properties = {
      date: {
        readonly: false,
        optional: false,
        type: descriptionTypes.complex,
        serialize,
        deserialize
      }
    }

    expect(actual).toEqual(expected)
  })

  it('should throw if trying to decorate wrong thing with computed', () => {
    const actual = catchErrType(() => {
      class Description extends Model<Description> {
        @(computed as any) two = string
      }
    })
    const expected = TypeError

    expect(actual).toBe(expected)
  })

  it('should throw if trying to decorate wrong thing with action', () => {
    const actual = catchErrType(() => {
      class Description extends Model<Description> {
        @(action as any) two = string
      }
    })
    const expected = TypeError

    expect(actual).toBe(expected)
  })

  it('should parse computed correctly', () => {
    class Description extends Model<Description> {
      @computed zero() {
        return 0
      }
    }

    const actual = parseDescription(Description)
    const expected = cloneDeep(baseExpectedDescription)

    expected.properties = {
      zero: {
        type: descriptionTypes.computed,
        fn: (Description.prototype.zero as any).fn
      }
    }

    expect(actual).toEqual(expected)
  })

  it('should parse mapOf number correctly', () => {
    class Description extends Model<Description> {
      nums = mapOf(number)
    }

    const actual = parseDescription(Description)
    const expected = cloneDeep(baseExpectedDescription)

    expected.properties = {
      nums: {
        type: descriptionTypes.mapOf,
        readonly: false,
        optional: false,
        kind: {
          readonly: false,
          optional: false,
          type: descriptionTypes.number,
        }
      }
    }

    expect(actual).toEqual(expected)
  })

  it('should parse mapOf object correctly', () => {
    class Person extends Model<Description> {
      firstName = string
    }
    class Description extends Model<Description> {
      people = mapOf(object(Person))
    }

    const actual = parseDescription(Description)
    const expected = cloneDeep(baseExpectedDescription)

    expected.properties = {
      people: {
        type: descriptionTypes.mapOf,
        readonly: false,
        optional: false,
        kind: {
          readonly: false,
          optional: false,
          type: descriptionTypes.object,
          properties: {
            firstName: {
              readonly: false,
              optional: false,
              type: descriptionTypes.string
            }
          }
        }
      }
    }

    expect(actual).toEqual(expected)
  })

  it('should parse number correctly', () => {
    class Description extends Model<Description> {
      num = number
    }

    const actual = parseDescription(Description)
    const expected = cloneDeep(baseExpectedDescription)

    expected.properties = {
      num: {
        readonly: false,
        optional: false,
        type: descriptionTypes.number
      }
    }

    expect(actual).toEqual(expected)
  })

  it('should parse object correctly', () => {
    class Person extends Model<Description> {
      firstName = string
    }
    class Description extends Model<Description> {
      person = object(Person)
    }

    const actual = parseDescription(Description)
    const expected = cloneDeep(baseExpectedDescription)

    expected.properties = {
      person: {
        readonly: false,
        optional: false,
        type: descriptionTypes.object,
        properties: {
          firstName: {
            readonly: false,
            optional: false,
            type: descriptionTypes.string
          }
        }
      }
    }

    expect(actual).toEqual(expected)
  })

  it('should parse oneOf correctly', () => {
    class Person extends Model<Description> {
      firstName = string
    }
    class Description extends Model<Description> {
      one = oneOf(object(Person), number, string)
    }

    const actual = parseDescription(Description)
    const expected = cloneDeep(baseExpectedDescription)

    expected.properties = {
      one: {
        readonly: false,
        optional: false,
        type: descriptionTypes.oneOf,
        kinds: [
          {
            type: descriptionTypes.object,
            readonly: false,
            optional: false,
            properties: {
              firstName: {
                type: descriptionTypes.string,
                readonly: false,
                optional: false,
              }
            }
          },
          {
            type: descriptionTypes.number,
            readonly: false,
            optional: false,
          },
          {
            type: descriptionTypes.string,
            readonly: false,
            optional: false,
          }
        ]
      }
    }

    expect(actual).toEqual(expected)
  })

  it('should parse string correctly', () => {
    class Description extends Model<Description> {
      str = string
    }

    const actual = parseDescription(Description)
    const expected = cloneDeep(baseExpectedDescription)

    expected.properties = {
      str: {
        readonly: false,
        optional: false,
        type: descriptionTypes.string
      }
    }

    expect(actual).toEqual(expected)
  })

  it('should parse a mix of all types correctly', () => {
    const serialize = (d: Date) => d.toUTCString()
    const deserialize = (v: string) => new Date(v)

    class User extends Model<State> {
      @readonly id = string
      firstName = string
      @optional lastName = string
      favoriteColors = arrayOf(string)
      cool = boolean
      dateOfBirth = complex(serialize, deserialize)
      @action changeName(firstName: string, lastName: string) {
        this.firstName = firstName
        this.lastName = lastName
      }
    }

    class Message extends Model<State> {
      @readonly id = string
      authorId = string
      contents = string
      @readonly @optional awesome = oneOf(string, boolean)
      @computed author() {
      }
      likes = number
    }

    class State extends Model<State> {
      users = mapOf(object(User))
      messages = mapOf(object(Message))
    }

    const actual = parseDescription(State)
    const expected = cloneDeep(baseExpectedDescription)

    expected.properties = {
      messages: {
        type: descriptionTypes.mapOf,
        readonly: false,
        optional: false,
        kind: {
          type: descriptionTypes.object,
          readonly: false,
          optional: false,
          properties: {
            author: {
              type: descriptionTypes.computed,
              fn: (Message.prototype.author as any).fn,
            },
            likes: {
              readonly: false,
              optional: false,
              type: descriptionTypes.number,
            },
            id: {
              readonly: true,
              optional: false,
              type: descriptionTypes.string
            },
            authorId: {
              readonly: false,
              optional: false,
              type: descriptionTypes.string
            },
            contents: {
              readonly: false,
              optional: false,
              type: descriptionTypes.string,
            },
            awesome: {
              readonly: true,
              optional: true,
              type: descriptionTypes.oneOf,
              kinds: [
                {
                  type: descriptionTypes.string,
                  readonly: false,
                  optional: false,
                },
                {
                  type: descriptionTypes.boolean,
                  readonly: false,
                  optional: false,
                }
              ]
            }

          }
        }
      },
      users: {
        type: descriptionTypes.mapOf,
        readonly: false,
        optional: false,
        kind: {
          type: descriptionTypes.object,
          readonly: false,
          optional: false,
          properties: {
            id: {
              readonly: true,
              optional: false,
              type: descriptionTypes.string,
            },
            firstName: {
              readonly: false,
              optional: false,
              type: descriptionTypes.string,
            },
            lastName: {
              readonly: false,
              optional: true,
              type: descriptionTypes.string,
            },
            favoriteColors: {
              readonly: false,
              optional: false,
              type: descriptionTypes.arrayOf,
              kind: {
                readonly: false,
                optional: false,
                type: descriptionTypes.string,
              },
            },
            cool: {
              readonly: false,
              optional: false,
              type: descriptionTypes.boolean,
            },
            dateOfBirth: {
              readonly: false,
              optional: false,
              type: descriptionTypes.complex,
              serialize,
              deserialize
            },
            changeName: {
              type: descriptionTypes.action,
              fn: (User.prototype.changeName as any).fn
            }
          }
        }
      }
    }

    expect(actual).toEqual(expected)
  })
})
