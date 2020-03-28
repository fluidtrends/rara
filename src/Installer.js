const npm = require('npm')
const libnpm = require('libnpm')
const fs = require('fs-extra')
const path = require('path')

class _ {
    constructor(archive) {
        this._archive = archive
    }

    get archive() {
        return this._archive
    }

    get npmManifestFile() {
        return path.resolve(this.archive.path, 'package.json')
    }

    _npm(command, options) {
        if (fs.existsSync(path.resolve(this.archive.path, 'node_modules'))) {
            return Promise.resolve({ totalTime: 0, alreadyInstalled: true })
        }

        const startTime = Date.now()

        const pkg = JSON.parse(fs.readFileSync(this.npmManifestFile, 'utf8'))
        pkg.scripts = pkg.scripts || {}
        pkg.scripts.___ = `npm ${command} ${options.join(' ')}`

        const stdout = process.stdout.write
        process.stdout.write = Function.prototype

        const opts = Object.assign({}, { 
            dir: this.archive.path,
            silent: true,
            stdio: ['ignore', 'ignore', 'ignore'],
            config: {}
        }, this.archive.npmOptions)

        return new Promise((resolve, reject) => {
            libnpm.runScript(pkg, "___", null, opts)
                     .then(() => {
                        const totalTime = (Date.now() - startTime)        
                        process.stdout.write = stdout
                        resolve ({ totalTime, installed: true })
                     }) 
                     .catch((error) => {
                        process.stdout.write = stdout
                        reject(error)
                     })
        })
    }

    install() {
        const npmManifest = this.npmManifestFile

        if (!fs.existsSync(npmManifest)) {
            return Promise.resolve({ totalTime: 0, skipped: true })
        }

        return this._npm('install', ['--loglevel=error', '--no-progress', '--silent', '--no-audit'])
    }
}

module.exports = _