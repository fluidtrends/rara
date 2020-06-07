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

    async _npmInstall(msg?: [string, string]) {
        if (fs.existsSync(path.resolve(this.archive.path!, 'node_modules'))) {
            return { totalTime: 0, alreadyInstalled: true }
        }

        const startTime = Date.now()
    
        const installed = await Registry.install({
            module: this.archive.archiveId,
            to: this.archive.dir
        })

        const totalTime = (Date.now() - startTime)        

        return { totalTime, installed: true, ...installed }
    }

    async install(msg?: [string, string]) {
        const npmManifest = this.npmManifestFile

        if (!fs.existsSync(npmManifest)) {
            return { totalTime: 0, skipped: true }
        }

        return this._npmInstall(msg)
    }
}