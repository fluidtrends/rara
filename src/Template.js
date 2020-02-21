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

    saveGlobs(dest, glob) {
        const destDir = path.resolve(dest, Object.keys(glob)[0])
        fs.existsSync(destDir) || fs.mkdirsSync(destDir)

        const files = Object.values(glob)[0]
        return cpy(files, destDir, { cwd: this.path })
    }

    save(dest, props) {
        if (!this.content || !this.content.files) {
            // Let's not break, but don't do anything
            return Promise.resolve()
        }

        fs.existsSync(dest) || fs.mkdirsSync(dest)

        return Promise.all(this.content.files.map(glob => {
            if ("string" === typeof glob) {
                return cpy(glob, dest, { cwd: this.path })
            }
      
            return this.saveGlobs(dest, glob)
        }))
    }
}

module.exports = _