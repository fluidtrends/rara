import ejs from 'ejs'
import fs from 'fs-extra'
import path from 'path'
import {
    IDataFile
} from '.'

export class DataFile implements IDataFile {
    public static ERRORS = {
        CANNOT_LOAD: (reason: string) => reason ? `Cannot load file because ${reason}` : `Cannot load file`,
        CANNOT_SAVE: (reason: string) => reason ? `Cannot save file because ${reason}` : `Cannot save file`
    }    

    public static TYPES = {
        ASSET: "ASSET_TYPE",
        IMAGE: ["PNG", "JPG", "JPEG", "GIF", "SVG"],
        JSON: ["JSON"],
        JAVASCRIPT: ["JS"],
        CSS: ["CSS"],
        MARKDOWN: ["MD"]
    }

    public static NONCOMPILABLE_TYPES = [ DataFile.TYPES.ASSET, DataFile.TYPES.IMAGE ]

    protected _props: any;
    protected _type?: string | string[];

    constructor(props?: any) {
        this._props = Object.assign({}, props)
    }

    get props() {
        return this._props
    }

    get filepath() {
        return this.props.filepath
    }

    get dir () {
        return this.props.dir
    }

    get path() {
        return (!this.dir || !this.filepath) ? "" : path.resolve(this.dir, this.filepath)
    }

    get exists() {
        return this.path && fs.existsSync(path.resolve(this.path))
    }

    get type () {
        return this._type || DataFile.TYPES.ASSET
    }

    detectType () {
        if (this._type) {
            // Not necessary
            return 
        }

        // Figure out the file's extension
        const ext = path.extname(this.path).toUpperCase().substring(1)

        for (let [type, values] of Object.entries(DataFile.TYPES)) {
            if (values.includes(ext)) {
                // Looks like we recognize this type
                this._type = values
                return 
            }
        }
    }

    get isCompilable() {
        return !DataFile.NONCOMPILABLE_TYPES.includes(this.type)
    }

    compile(args: any, options: any = {}) {
        if (!this.isCompilable) {
            // No need to compile
            return Promise.resolve()
        }

        return new Promise((resolve, reject) => {
            try {
                // Attempt to load the file 
                const content = fs.readFileSync(this.path, 'utf8')

                if (!content) {
                    // Next let's make sure we stop right here for empty files
                    resolve("")
                    return
                }

                // Try to parse the file and catch syntax errors
                const template = ejs.compile(content, {})

                // Finally, let's see if we can validate it
                const output = template(args)

                // We're good
                resolve(options.json ? JSON.parse(output) : output)
            } catch (error) {
                reject(new Error(DataFile.ERRORS.CANNOT_LOAD(error.message)))
            }
        })
    }

    async load(args?: any, options = {}) {
        if (!this.exists) {
            // First make sure the file exists
            return Promise.reject(new Error(DataFile.ERRORS.CANNOT_LOAD('it does not exist')))
        }

        // Let's see if this is a recognized file y]type 
        this.detectType()

        // Compile the file if necessary
        return this.compile(args, options)
    }

    async copy(dest: string) {
        // Create sub directories if necessary
        const dir = path.resolve(dest, path.dirname(this.filepath))
        fs.existsSync(dir) || fs.mkdirs(dir)

        return new Promise((resolve, reject) => {
            // Let's move the file over
            fs.copySync(this.path, path.resolve(dest, this.filepath))
            
            resolve()
        })    
    }

    async save(dest?: string, args = {}) {
        if (!this.exists) {
            // First make sure the file exists
            return Promise.reject(new Error(DataFile.ERRORS.CANNOT_SAVE('it does not exist')))
        }
        
        if (!fs.existsSync(dest!)) {
            // First make sure the destination location
            return Promise.reject(new Error(DataFile.ERRORS.CANNOT_SAVE('the destination does not exist')))
        }

        // Let's see if this is a recognized file type 
        this.detectType()

        if (!this.isCompilable) {
            // Let's move the file over
            return this.copy(dest!)
        }

        // Create sub directories if necessary
        const dir = path.resolve(dest!, path.dirname(this.filepath))
        fs.existsSync(dir) || fs.mkdirsSync(dir)

        // Load and then save it
        return this.load(args).then((output: any) => {
            fs.writeFileSync(path.resolve(dest!, this.filepath), output, 'utf8')
        })
    }
}
