const path = require('path')
const fs = require('fs-extra')
const cpy = require('cpy')

class _ {
    constructor(props) {
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

    load(props) {
        return new Promise((resolve, reject) => {
            try {
                const Template = require(this.path)
                this._content = new Template(props)
                resolve(this)
            } catch (e) {
                reject(e)
            }
        })
    }

    saveGlobs({ dest, glob, props }) {
        return cpy(glob, dest, props)
    }

    save(dest, props) {
        if (!this.content || !this.content.files) {
            // Let's not break, but don't do anything
            return Promise.resolve()
        }

        // Make sure the destination is available
        fs.existsSync(dest) || fs.mkdirsSync(dest)

        // Save all the local and global globs
        return Promise.all(this.content.files.map(glob => this.saveGlobs({ dest, glob, props: { cwd: this.path, parents: true }}))
                   .concat(this.content.archiveFiles.map(glob => this.saveGlobs({ dest, glob, props: { cwd: this.dir, parents: true }}))))
    }
}

module.exports = _