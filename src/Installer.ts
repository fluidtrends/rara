import fs from 'fs'
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

    async _npm(command: string, options: any) {
        if (fs.existsSync(path.resolve(this.archive.path!, 'node_modules'))) {
            return { totalTime: 0, alreadyInstalled: true }
        }

        const startTime = Date.now()
        const cwd = process.cwd()
        process.chdir(this.archive.path!)
        
        await Registry.npm(`${command} ${options.join(' ')}`)

        const totalTime = (Date.now() - startTime)        
        process.chdir(cwd)

        return { totalTime, installed: true }
    }

    async install() {
        const npmManifest = this.npmManifestFile

        if (!fs.existsSync(npmManifest)) {
            return { totalTime: 0, skipped: true }
        }

        return this._npm('install', ['--only=prod', '--no-warnings', '--loglevel=error', '--no-progress', '--silent', '--no-audit'])
    }
}