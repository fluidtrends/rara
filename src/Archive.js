const fs = require('fs-extra')
const path = require('path')
const readDir = require('fs-readdir-recursive')
const File = require('./File')

class _ {
    constructor(props) {
        this._props = Object.assign({}, props)
    }

    get props() {
        return this._props
    }

    get id() {
        return this.props.id
    }

    get dir () {
        return this.props.dir
    }

    get path() {
        return (!this.dir || !this.id) ? null : path.resolve(this.dir, this.id)
    }

    get exists() {
        return this.path && fs.existsSync(path.resolve(this.path))
    }

    get files() {
        return this._files
    }

    load() {
        if (!this.exists) {
            // First make sure the archive exists
            return Promise.reject(new Error(_.ERRORS.CANNOT_LOAD('it does not exist')))
        }

        // List out all the files
        this._files = readDir(path.resolve(this.path)).map(filepath => new File({ dir: this.path, filepath: filepath }))

        // Let's actually load all the files
        return Promise.all(this.files.map(file => file.load()))                
    }
}

_.ERRORS = {
    CANNOT_LOAD: (reason) => reason ? `Cannot load archive because ${reason}` : `Cannot load archive`
}

module.exports = _