var shelljs = require('shelljs')
var version = require('../package.json').version
var fs = require('fs')

const s = shelljs

// Copy over umd build

console.log('Copying over umd build')

s.rm('-rf', './playground/umd')
s.mkdir('./playground/umd')
s.cp('-r', './umd/*', './playground/umd')

// Install fnx as if it were a local package

console.log('packing')

s.exec('npm pack')

console.log('clearing .localbuild')

s.rm('-rf', './.localbuild')
s.mkdir('-p', './.localbuild')

console.log('extracting package to .localbuild')

s.exec('tar -xf fnx-' + version + '.tgz -C ./.localbuild --strip 1')
s.cd('./.localbuild')

console.log('renaming localBuild from fnx to fnx-local')

const package = JSON.parse(s.cat('package.json'))
package.name = 'fnx-local'
delete package.devDependencies
fs.writeFileSync('package.json', JSON.stringify(package))

console.log('Running npm link')

s.exec('npm link')
s.cd('..')

console.log('Adding fnx-local to project')

s.exec('npm link fnx-local')

console.log('Removing tar')

s.rm('fnx-' + version + '.tgz')

console.log('Done')
