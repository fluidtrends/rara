class _ {
    constructor(props) {
        this._props = Object.assign({}, props)
    }

    get props() {
        return this._props
    }

    get files() {
        return [
            "test.json",
            { assets: [
                "../../assets/text/**/*", 
                "../../assets/hello.png"
            ]}
        ]
    }
}

module.exports = _