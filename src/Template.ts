import fs from 'fs-extra'
import path from 'path'
import cpy from 'cpy'

export class Template {
    protected _props: any;
    protected _name: string;
    protected _dir: string;
    protected _path: string;
    protected _content?: any;

    constructor(props: any) {
        this._props = Object.assign({}, props)
        this._name = this.props.name
        this._dir = this.props.dir
        this._path = path.resolve(this.dir, 'templates', this.name)
    }

    get props() {
        return this._props
    }

    get name() {
        return this._name
    }

    get dir() {
        return this._dir
    }

    get path() {
        return this._path
    }

    get exists() {
        return fs.existsSync(this.path)
    }
    
    get content() {
        return this._content
    }

    load(props: any) {
        return new Promise((resolve, reject) => {
            try {
                const Tpl = require(this.path)
                this._content = new Tpl(props)
                resolve(this)
            } catch (e) {
                reject(e)
            }
        })
    }

    saveGlobs(data: any) {
        return cpy(data.glob, data.dest, data.props)
    }

    save(dest: string, props: any) {
        if (!this.content || !this.content.files) {
            // Let's not break, but don't do anything
            return Promise.resolve()
        }

        // Make sure the destination is available
        fs.existsSync(dest) || fs.mkdirsSync(dest)

        // Save all the local and global globs
        return Promise.all(this.content.files.map((glob: any) => this.saveGlobs({ dest, glob, props: { cwd: this.path, parents: true }}))
                   .concat(this.content.archiveFiles.map((glob: any) => this.saveGlobs({ dest, glob, props: { cwd: this.dir, parents: true }}))))
    }
}
