const fs = require('fs-extra')
const path = require('path')
const readDir = require('fs-readdir-recursive')
const File = require('./File')
const Template = require('./Template')
const Installer = require('./Installer')
const Logger = require('./Logger')
const libnpm = require('libnpm')

class _ {
    constructor(props) {
        this._props = Object.assign({}, props)
        this._installer = new Installer(this)
        this._logger = new Logger(props)
    }

    get props() {
        return this._props
    }

    get installer() {
        return this._installer
    }

    get logger() {
        return this._logger
    }

    get id() {
        return this.props.id
    }

    get archiveId() {
        return this.id + (this.version ? `@${this.version}` : "")
    }

    get version() {
        return this.props.version || this._version
    }

    get dir () {
        return this.props.dir
    }

    get path() {
        return (!this.dir || !this.id || !this.version) ? null : path.resolve(this.dir, this.id, this.version, this.id)
    }

    get exists() {
        return this.path && fs.existsSync(path.resolve(this.path))
    }

    get files() {
        return this._files
    }

    get templates() {
        return this._templates
    }

    get manifest() {
        return this._manifest
    }

    get npmOptions() {
        return { log: this.logger.raw }
    }

    initialize() { 
        if (this.version) {
            // No need to fetch the version
            return Promise.resolve()
        }

        return libnpm.manifest(this.archiveId, this.npmOptions).then((manifest) => {
            this._version = `${manifest.version}`
            this._manifest = Object.assign({}, manifest)
        })
    }

    installDependencies() {
        return this.initialize()
                   .then(() => this.installer.npm.install(this.npmOptions))
    }

    load() {
        return this.initialize().then(() => {
            if (!this.exists) {
                // First make sure the archive exists
                return Promise.reject(new Error(_.ERRORS.CANNOT_LOAD('it does not exist')))
            }

            // Let's look up templates, if any
            const templatesDir = path.resolve(this.path, 'templates')
            this._templates = {}
            fs.existsSync(templatesDir) && fs.readdirSync(templatesDir).map(name => this._templates[name] = new Template({ dir: this.path, name }))

            // List out all the files
            this._files = readDir(path.resolve(this.path)).map(filepath => new File({ dir: this.path, filepath: filepath }))

            // Let's actually load all the files
            return Promise.all(this.files.map(file => file.load())).then(() => this)
        })
    }

    save(dest, args = {}) {
        // Make sure the destination exists
        fs.existsSync(dest) || fs.mkdirsSync(dest)

        return this.load().then(() => Promise.all(this.files.map(file => file.save(dest, args)))) 
    }

    download () {
        return this.initialize()
                   .then(() => libnpm.extract(this.archiveId, this.path, this.npmOptions))
    }
}

_.ERRORS = {
    CANNOT_LOAD: (reason) => reason ? `Cannot load archive because ${reason}` : `Cannot load archive`
}

module.exports = _
