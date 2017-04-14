import * as fs from 'fs'
import * as shelljs from 'shelljs'

const expectedOutput =
`"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _localbuild_1 = require("../../../.localbuild");
_localbuild_1.default;
`

describe('ts project dependent on fnx should compile', () => {
  it('should compile', () => {
    const dir = shelljs.pwd()

    shelljs.cd('test/typescript/test')
    shelljs.rm('-f', 'index.js')

    const result = shelljs.exec(
      dir + '/node_modules/typescript/bin/tsc index.ts --target ES5'
    )

    if (result.code !== 0) {
      console.error(result)
      throw new Error('Exited with non-zero exit code')
    }

    const fileContents = fs.readFileSync('index.js', 'UTF-8')

    shelljs.cd(dir)

    const actual = fileContents
    const expected = expectedOutput

    expect(actual).toBe(expected)
  })
})
