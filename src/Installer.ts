import fs from 'fs-extra'
import path from 'path'

import {
    Archive,
    Registry
} from '.'

export class Installer {
    protected _archive: Archive;
    
    constructor(archive: Archive) {
        this._archive = archive
    }

    get archive() {
        return this._archive
    }

    get npmManifestFile() {
        return path.resolve(this.archive.path!, 'package.json')
    }

    _npm(command: string, options: any) {
        if (fs.existsSync(path.resolve(this.archive.path!, 'node_modules'))) {
            return Promise.resolve({ totalTime: 0, alreadyInstalled: true })
        }

        const startTime = Date.now()

        const pkg = JSON.parse(fs.readFileSync(this.npmManifestFile, 'utf8'))
        pkg.scripts = pkg.scripts || {}
        pkg.scripts.___ = `npm ${command} ${options.join(' ')}`

        const stdout = process.stdout.write
        process.stdout.write = Function.prototype as any;

        const opts = Object.assign({}, { 
            path: this.archive.path,
            pkg, 
            event: "___",
            silent: true,
            stdio: ['ignore', 'ignore', 'ignore'],
            config: {}
        }, this.archive.npmOptions)

        return new Promise((resolve, reject) => {
            Registry.runScript(opts)
                     .then(() => {
                        const totalTime = (Date.now() - startTime)        
                        process.stdout.write = stdout
                        resolve ({ totalTime, installed: true })
                     }) 
                     .catch((error: Error) => {
                        process.stdout.write = stdout
                        reject(error)
                     })
        })
    }

    install(options: any) {
        const npmManifest = this.npmManifestFile

        if (!fs.existsSync(npmManifest)) {
            return Promise.resolve({ totalTime: 0, skipped: true })
        }

        return this._npm('install', ['--loglevel=error', '--no-progress', '--silent', '--no-audit'])
    }
}