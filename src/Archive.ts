import fs from 'fs-extra'
import path from 'path'
import readDir from 'fs-readdir-recursive'

import {
    DataFile, 
    Template,
    Logger,
    Registry,
    Installer
} from '.'

export class Archive {
    protected _props: any;
    protected _installer: Installer;
    protected _logger: Logger;
    protected _version?: string;
    protected _manifest?: any;
    protected _files?: DataFile[];
    protected _templates?: any;

    public static ERRORS = {
        CANNOT_LOAD: (reason: string) => reason ? `Cannot load archive because ${reason}` : `Cannot load archive`
    }
    
    public static IGNORES = [
        "node_modules", 
        "test",
        "package.json",
        "package-lock.json",
        "assets/text/intro.md"
    ]

    constructor(props: any) {
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

    async initialize() { 
        if (this.version) {
            // No need to fetch the version
            return undefined
        }

        const manifest = await Registry.manifest(this.archiveId)
        
        this._version = `${manifest.version}`
        this._manifest = Object.assign({}, manifest)
    }

    async installDependencies() {
        await this.initialize()
        return this.installer.install()
    }

    async download () {
        await this.initialize()
        return await Registry.extract(this.archiveId, this.path!)
    }

    loadTemplates() {
        const templatesDir = path.resolve(this.path!, 'templates')
        this._templates = {}
        fs.existsSync(templatesDir) && fs.readdirSync(templatesDir).map(name => this._templates[name] = new Template({ dir: this.path, name }))
    }

    ignoreFileIfNecessary(f: string) {
        return Archive.IGNORES.filter(i => f.startsWith(i)).length === 0
    }

    async loadFiles() {
        // List out all the files
        const rawFiles =  readDir(path.resolve(this.path!)).filter(f => this.ignoreFileIfNecessary(f))

        // Look for the ones we care about
        this._files = rawFiles.map(filepath => new DataFile({ dir: this.path!, filepath: filepath }))

        // Let's actually load all the files
        return Promise.all(this.files!.map(file => file.load())).then(() => this)
    }

    async load() {
        return this.initialize().then(() => {
            if (!this.exists) {
                // First make sure the archive exists
                return Promise.reject(new Error(Archive.ERRORS.CANNOT_LOAD('it does not exist')))
            }

            // Let's look up templates, if any
            this.loadTemplates()

            // Load up all the files we care about
            return this.loadFiles()
        })
    }

    async save(dest: string, args = {}) {
        // Make sure the destination exists
        fs.existsSync(dest) || fs.mkdirsSync(dest)

        return this.load().then(() => Promise.all(this.files!.map(file => file.save(dest, args)))) 
    }
}