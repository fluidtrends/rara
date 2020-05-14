import savor, {
    Context,
    Completion
} from 'savor'

import { 
    DataFile 
} from '../../src'

import fs from 'fs-extra'
import path from 'path'

savor.

add('should not load a file without a path', (context: Context, done: Completion) => {
    const file = new DataFile()

    savor.promiseShouldFail(file.load(), done, (error) => {
        context.expect(error.message).to.equal(DataFile.ERRORS.CANNOT_LOAD('it does not exist'))
    })
}).

add('should not load a file with an invalid path', (context: Context, done: Completion) => {
    const file = new DataFile()

    savor.promiseShouldFail(file.load(), done, (error) => {
        context.expect(error.message).to.equal(DataFile.ERRORS.CANNOT_LOAD('it does not exist'))
    })
}).

add('should load but not parse empty files', (context: Context, done: Completion) => {
    const file = new DataFile({ dir: context.dir, filepath: 'empty.json' })
    savor.addAsset('assets/empty.json', 'empty.json', context)

    savor.promiseShouldSucceed(file.load(), done, (output) => {
        context.expect(output).to.be.empty
    })
}).

add('should not load a file with syntax errors', (context: Context, done: Completion) => {
    const file = new DataFile({ path: 'invalid.json' })
    savor.addAsset('assets/invalid.json', 'invalid.json', context)

    savor.promiseShouldFail(file.load(), done, (error) => {
        context.expect(error.message.startsWith(DataFile.ERRORS.CANNOT_LOAD(""))).to.be.true
    })
}).

add('should load a valid file with some defaults', (context: Context, done: Completion) => {
    const file = new DataFile({ dir: context.dir, filepath: 'test.json' })
    savor.addAsset('assets/test.json', 'test.json', context)

    savor.promiseShouldSucceed(file.load({ info: "hello12345" }, { json: true }), done, (output) => {
        context.expect(output.username).to.be.equal('hello')
        context.expect(output.info).to.be.equal('hello12345')
        context.expect(output.description).to.be.equal('default')
    })
}).

add('should load a valid file and fill in custom tags', (context: Context, done: Completion) => {
    const file = new DataFile({ dir: context.dir, filepath: 'test.json' })
    savor.addAsset('assets/test.json', 'test.json', context)

    savor.promiseShouldSucceed(file.load({ description: "blue", info: "hello12345" }, { json: true }), done, (output) => {
        context.expect(output.username).to.be.equal('hello')
        context.expect(output.info).to.be.equal('hello12345')
        context.expect(output.description).to.be.equal('blue')
    })
}).

add('should not save a missing file', (context: Context, done: Completion) => {
    const file = new DataFile({ dir: context.dir, filepath: 'test.json' })

    savor.promiseShouldFail(file.save(), done, (error) => {
        context.expect(error.message).to.equal(DataFile.ERRORS.CANNOT_SAVE('it does not exist'))
    })
}).

add('should not save a file to a missing destination', (context: Context, done: Completion) => {
    const file = new DataFile({ dir: context.dir, filepath: 'hello.png' })
    savor.addAsset('assets/hello.png', 'hello.png', context)

    savor.promiseShouldFail(file.save(), done, (error) => {
        context.expect(error.message).to.equal(DataFile.ERRORS.CANNOT_SAVE('the destination does not exist'))
    })
}).

add('should save a non compilable file to a destination', (context: Context, done: Completion) => {
    const file = new DataFile({ dir: context.dir, filepath: 'hello.png' })
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

add('should save a compilable file to a destination', (context: Context, done: Completion) => {
    const file = new DataFile({ dir: context.dir, filepath: 'test.json' })
    savor.addAsset('assets/test.json', 'test.json', context)

    const dest = path.resolve(context.dir, 'temp-test')
    fs.mkdirsSync(dest)

    // Make sure it's not saved yet
    context.expect(fs.existsSync(path.resolve(dest, 'test.json'))).to.be.false

    savor.promiseShouldSucceed(file.save(dest, { info: "test" }), done, () => {
        // Make sure it was saved
        context.expect(fs.existsSync(path.resolve(dest, 'test.json'))).to.be.true

        // Let's also make sure it has been compiled ok
        const content = JSON.parse(fs.readFileSync(path.resolve(dest, 'test.json'), 'utf8'))
        context.expect(content.username).to.equal('hello')
    })
}).


run('[Rara] DataFile')
