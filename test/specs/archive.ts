import savor, {
    Context,
    Completion
} from 'savor'

import { 
    Archive,
    Registry,
    DataFile 
} from '../../src'

savor.

add('should not load a missing archive', (context: Context, done: Completion) => {
    const archive = new Archive({ dir: context.dir, id: 'test-archive' })
    const stub = context.stub(Registry, 'manifest').callsFake(() => Promise.resolve({ version: '1' }))

    savor.promiseShouldFail(archive.load(), done, (error) => {
        stub.restore()
        context.expect(error.message).to.equal(Archive.ERRORS.CANNOT_LOAD('it does not exist'))
    })
}).

add('should not load an archive with invalid files', (context: Context, done: Completion) => {
    const archive = new Archive({ dir: context.dir, id: 'invalid-archive', version: '1' })
    const stub = context.stub(Registry, 'extract').callsFake(() => Promise.resolve({ version: '1' }))
    const stub2 = context.stub(Registry, 'manifest').callsFake(() => Promise.resolve({ version: '1' }))

    savor.addAsset('assets/invalid-archive', 'invalid-archive/1/invalid-archive', context)

    savor.promiseShouldFail(archive.load(), done, (error) => {
        stub.restore()
        stub2.restore()
        context.expect(error.message.startsWith(DataFile.ERRORS.CANNOT_LOAD(""))).to.be.true
    })
}).

add('should load a valid archive', (context: Context, done: Completion) => {
    const archive = new Archive({ dir: context.dir, id: 'test-archive', version: '1' })
    const stub = context.stub(Registry, 'extract').callsFake(() => Promise.resolve({ version: '1' }))
    const stub2 = context.stub(Registry, 'manifest').callsFake(() => Promise.resolve({ version: '1' }))

    savor.addAsset('assets/test-archive', 'test-archive/1/test-archive', context)

    savor.promiseShouldSucceed(archive.load(), done, (output) => {
        stub.restore()
        stub2.restore()
        context.expect(archive.files?.length).to.equal(9)
    })
}).

add('should download the latest version', (context: Context, done: Completion) => {
    const archive = new Archive({ dir: context.dir, id: 'test-archive' })
    const stub = context.stub(Registry, 'extract').callsFake(() => Promise.resolve({ version: '1' }))
    const stub2 = context.stub(Registry, 'manifest').callsFake(() => Promise.resolve({ version: '1' }))

    savor.addAsset('assets/test-archive', 'test-archive/1/test-archive', context)

    savor.promiseShouldSucceed(archive.download(), done, (output) => {
        context.expect(archive.version).to.equal('1')
        context.expect(archive.manifest.version).to.equal('1')
        stub.restore()
        stub2.restore()
    })
}).

add('should build the archive ID correctly', (context: Context, done: Completion) => {
    const archive = new Archive({ dir: context.dir, id: 'test-archive' })
    const stub = context.stub(Registry, 'manifest').callsFake(() => Promise.resolve({ version: '1.0.0' }))

    savor.promiseShouldSucceed(archive.initialize(), done, (output) => {
        context.expect(archive.archiveId).to.equal('test-archive@1.0.0')
        stub.restore()
    })
}).

add('should download a specific package version', (context: Context, done: Completion) => {
    const archive = new Archive({ dir: context.dir, id: 'rara', version: '1.1.3' })
    const stub = context.stub(Registry, 'extract').callsFake(() => Promise.resolve({ version: '1.1.3' }))
    const stub2 = context.stub(Registry, 'manifest').callsFake(() => Promise.resolve({ version: '1.1.3' }))

    savor.addAsset('assets/test-archive', 'test-archive/1/test-archive', context)

    savor.promiseShouldSucceed(archive.download(), done, (output) => {
        context.expect(archive.version).to.equal('1.1.3')
        stub.restore()
        stub2.restore()
    })
}).

run('[Rara] Archive')
