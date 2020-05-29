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

        process.chdir(this.archive.path!)
        await Registry.npm('install --only=prod --silent --no-warnings --no-progress')

        const totalTime = (Date.now() - startTime)        
        return { totalTime, installed: true }
    }

    async install() {
        const npmManifest = this.npmManifestFile

        if (!fs.existsSync(npmManifest)) {
            return { totalTime: 0, skipped: true }
        }

        return this._npm('install', ['--loglevel=error', '--no-progress', '--silent', '--no-audit'])
    }
}