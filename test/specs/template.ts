import savor, {
    Context,
    Completion
} from 'savor'

import { 
    Archive,
    Registry,
    Template
} from '../../src'

import fs from 'fs-extra'
import path from 'path'

savor.

add('should find a valid template in an archive', (context: Context, done: Completion) => {
    const archive = new Archive({ dir: context.dir, id: 'test-archive', version: '1' })
    const stub = context.stub(Registry, 'extract').callsFake(() => Promise.resolve({ version: '1' }))
    const stub2 = context.stub(Registry, 'manifest').callsFake(() => Promise.resolve({ version: '1' }))

    savor.addAsset('assets/test-archive', 'test-archive/1/test-archive', context)

    savor.promiseShouldSucceed(archive.load(), done, (output) => {
        stub.restore()
        stub2.restore()
      
        context.expect(archive.templates.default).to.exist
        context.expect(archive.templates.default.name).to.equal('default')
        context.expect(archive.templates.default.exists).to.be.true
    })
}).

add('should load a valid template from an archive', (context: Context, done: Completion) => {
    const archive = new Archive({ dir: context.dir, id: 'test-archive', version: '1' })
    const stub = context.stub(Registry, 'extract').callsFake(() => Promise.resolve({ version: '1' }))
    const stub2 = context.stub(Registry, 'manifest').callsFake(() => Promise.resolve({ version: '1' }))

    savor.addAsset('assets/test-archive', 'test-archive/1/test-archive', context)

    const props = { test: "1234" }
    savor.promiseShouldSucceed(archive.load().then(() => archive.templates.default.load(props)), done, (template) => {
        stub.restore()
        stub2.restore()
        context.expect(template.content.props.test).to.equal(props.test)
        context.expect(template.content.files.length).to.equal(1)
    })
}).

add('should ignore saving a template without files', (context: Context, done: Completion) => {
    const archive = new Archive({ dir: context.dir, id: 'test-archive', version: '1' })
    const stub = context.stub(Registry, 'extract').callsFake(() => Promise.resolve({ version: '1' }))
    const stub2 = context.stub(Registry, 'manifest').callsFake(() => Promise.resolve({ version: '1' }))

    savor.addAsset('assets/test-archive', 'test-archive/1/test-archive', context)

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

add('should save a template to a destination', (context: Context, done: Completion) => {
    const archive = new Archive({ dir: context.dir, id: 'test-archive', version: '1' })
    const stub = context.stub(Registry, 'extract').callsFake(() => Promise.resolve({ version: '1' }))
    const stub2 = context.stub(Registry, 'manifest').callsFake(() => Promise.resolve({ version: '1' }))

    savor.addAsset('assets/test-archive', 'test-archive/1/test-archive', context)

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
