/* eslint-disable no-unused-expressions */

const savor = require('savor')
const { Template, Archive } = require('../..')
const path = require('path')
const fs = require('fs-extra')
const npm = require('libnpm')

savor.

add('should find a valid template in an archive', (context, done) => {
    const archive = new Archive({ dir: context.dir, id: 'test-archive', version: '1' })
    const stub = context.stub(npm, 'extract').callsFake(() => Promise.resolve({ version: '1' }))
    const stub2 = context.stub(npm, 'manifest').callsFake(() => Promise.resolve({ version: '1' }))

    savor.addAsset('assets/test-archive', 'test-archive/1', context)

    savor.promiseShouldSucceed(archive.load(), done, (output) => {
        stub.restore()
        stub2.restore()
      
        context.expect(archive.templates.default).to.exist
        context.expect(archive.templates.default.name).to.equal('default')
        context.expect(archive.templates.default.exists).to.be.true
    })
}).

add('should handle an invalid template in an archive', (context, done) => {
    const archive = new Archive({ dir: context.dir, id: 'test-archive', version: '1' })
    const stub = context.stub(npm, 'extract').callsFake(() => Promise.resolve({ version: '1' }))
    const stub2 = context.stub(npm, 'manifest').callsFake(() => Promise.resolve({ version: '1' }))

    savor.addAsset('assets/test-archive2', 'test-archive/1', context)

    savor.promiseShouldFail(archive.load().then(() => archive.templates.default.load()), done, (error) => {
        stub.restore()
        stub2.restore()
        context.expect(error.message).to.exist
    })
}).

add('should load a valid template from an archive', (context, done) => {
    const archive = new Archive({ dir: context.dir, id: 'test-archive', version: '1' })
    const stub = context.stub(npm, 'extract').callsFake(() => Promise.resolve({ version: '1' }))
    const stub2 = context.stub(npm, 'manifest').callsFake(() => Promise.resolve({ version: '1' }))

    savor.addAsset('assets/test-archive', 'test-archive/1', context)

    const props = { test: "1234" }
    savor.promiseShouldSucceed(archive.load().then(() => archive.templates.default.load(props)), done, (template) => {
        stub.restore()
        stub2.restore()
        context.expect(template.content.props.test).to.equal(props.test)
        context.expect(template.content.files.length).to.equal(1)
    })
}).

add('should ignore saving a template without files', (context, done) => {
    const archive = new Archive({ dir: context.dir, id: 'test-archive', version: '1' })
    const stub = context.stub(npm, 'extract').callsFake(() => Promise.resolve({ version: '1' }))
    const stub2 = context.stub(npm, 'manifest').callsFake(() => Promise.resolve({ version: '1' }))

    savor.addAsset('assets/test-archive', 'test-archive/1', context)

    const props = { test: "1234" }
    const saveProps = {}
    const dest = path.resolve(context.dir, 'dest')

    context.expect(fs.existsSync(dest)).to.be.false
    savor.promiseShouldSucceed(
                    archive.load()
                           .then(() => archive.templates.second.load(props)
                           .then(() => archive.templates.second.save(dest, saveProps))), done, (template) => {
        stub.restore()
        stub2.restore()
        context.expect(fs.existsSync(dest)).to.be.false
    })
}).

add('should save a template to a destination', (context, done) => {
    const archive = new Archive({ dir: context.dir, id: 'test-archive', version: '1' })
    const stub = context.stub(npm, 'extract').callsFake(() => Promise.resolve({ version: '1' }))
    const stub2 = context.stub(npm, 'manifest').callsFake(() => Promise.resolve({ version: '1' }))

    savor.addAsset('assets/test-archive', 'test-archive/1', context)

    const props = { test: "1234" }
    const saveProps = {}
    const dest = path.resolve(context.dir, 'dest')

    context.expect(fs.existsSync(dest)).to.be.false
    savor.promiseShouldSucceed(
                    archive.load()
                           .then(() => archive.templates.default.load(props)
                           .then(() => archive.templates.default.save(dest, saveProps))), done, (template) => {
        stub.restore()
        stub2.restore()
        context.expect(fs.existsSync(dest)).to.be.true        
        context.expect(fs.existsSync(path.resolve(dest, 'test.json'))).to.be.true
        context.expect(fs.existsSync(path.resolve(dest, 'assets'))).to.be.true
        context.expect(fs.existsSync(path.resolve(dest, 'assets', 'hello.png'))).to.be.true
    })
}).

run('[Rara] Template')
