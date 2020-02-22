/* eslint-disable no-unused-expressions */

const savor = require('savor')
const { File } = require('../..')
const path = require('path')
const fs = require('fs-extra')

savor.

add('should not load a file without a path', (context, done) => {
    const file = new File()

    savor.promiseShouldFail(file.load(), done, (error) => {
        context.expect(error.message).to.equal(File.ERRORS.CANNOT_LOAD('it does not exist'))
    })
}).

add('should not load a file with an invalid path', (context, done) => {
    const file = new File()

    savor.promiseShouldFail(file.load(), done, (error) => {
        context.expect(error.message).to.equal(File.ERRORS.CANNOT_LOAD('it does not exist'))
    })
}).

add('should not load a file with syntax errors', (context, done) => {
    const file = new File({ path: 'invalid.json' })
    savor.addAsset('assets/invalid.json', 'invalid.json', context)

    savor.promiseShouldFail(file.load(), done, (error) => {
        context.expect(error.message.startsWith(File.ERRORS.CANNOT_LOAD())).to.be.true
    })
}).

add('should not save a missing file', (context, done) => {
    const file = new File({ dir: context.dir, filepath: 'test.json' })

    savor.promiseShouldFail(file.save(), done, (error) => {
        context.expect(error.message).to.equal(File.ERRORS.CANNOT_SAVE('it does not exist'))
    })
}).


add('should specify the right adapter type', (context, done) => {
    const file = new File({ dir: context.dir, filepath: 'test.json' })
    savor.addAsset('assets/test.json', 'test.json', context)

    savor.promiseShouldSucceed(file.load(), done, (error) => {
        context.expect(file.adapter).to.equal('JSON')
    })
}).

add('should not save a file to a missing destination', (context, done) => {
    const file = new File({ dir: context.dir, filepath: 'hello.png' })
    savor.addAsset('assets/hello.png', 'hello.png', context)

    savor.promiseShouldFail(file.save(), done, (error) => {
        context.expect(error.message).to.equal(File.ERRORS.CANNOT_SAVE('the destination does not exist'))
    })
}).

add('should save a non compilable file to a destination', (context, done) => {
    const file = new File({ dir: context.dir, filepath: 'hello.png' })
    savor.addAsset('assets/hello.png', 'hello.png', context)

    const dest = path.resolve(context.dir, 'temp-test')
    fs.mkdirsSync(dest)

    // Make sure it's not saved yet
    context.expect(fs.existsSync(path.resolve(dest, 'hello.png'))).to.be.false

    savor.promiseShouldSucceed(file.save(dest), done, () => {
        // Make sure it was saved
        context.expect(fs.existsSync(path.resolve(dest, 'hello.png'))).to.be.true
    })
}).

run('[Rara] File')
