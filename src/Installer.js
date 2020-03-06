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

    _npm(command, options) {
        if (fs.existsSync(path.resolve(this.archive.path, 'node_modules'))) {
            return Promise.resolve({ totalTime: 0, alreadyInstalled: true })
        }

        const startTime = Date.now()
        process.chdir(this.archive.path)

        return new Promise((resolve, reject) => {
            npm.load({}, (err, n) => {
                if (err) {
                    reject(err)
                    return
                }

                n.commands[command]((error, result) => {
                    if (error) {
                        reject(error)
                        return
                    }
                    
                    const totalTime = (Date.now() - startTime)
                    resolve (Object.assign({}, result, { totalTime }))
                })
            })
        })
    }

    get npm() {
        return {
            install: (options) => this._npm('install', options)
        }
    }
}

module.exports = _