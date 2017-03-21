var shelljs = require('shelljs')
var version = require('../package.json').version
var fs = require('fs')

// Install fnx as if it were a local package
console.log('packing')
shelljs.exec('npm pack')
console.log('clearing .localbuild')
shelljs.rm('-rf', './.localbuild')
shelljs.mkdir('-p', './.localbuild')
console.log('extracting package to .localbuild')
shelljs.exec('tar -xf fnx-' + version + '.tgz -C ./.localbuild --strip 1')
shelljs.cd('./.localbuild')
console.log('renaming localBuild from fnx to fnx-local')
const package = JSON.parse(shelljs.cat('package.json'))
package.name = 'fnx-local'
delete package.devDependencies
fs.writeFileSync('package.json', JSON.stringify(package))
console.log('Running npm link')
shelljs.exec('npm link')
shelljs.cd('..')
console.log('Adding fnx-local to project')
shelljs.exec('npm link fnx-local')
console.log('Removing tar')
shelljs.rm('fnx-' + version + '.tgz')
console.log('Done')
