import savor, {
    Context,
    Completion
} from 'savor'

import { 
    Archive,
    Registry
} from '../../src'

savor.

add('should handle npm load error',  (context: Context, done: Completion)=> {
    const archive = new Archive({ dir: context.dir, id: 'test-archive' })
    const stub = context.stub(Registry, 'extract').callsFake(() => Promise.resolve({ version: '1' }))
    const stub2 = context.stub(Registry, 'manifest').callsFake(() => Promise.resolve({ version: '1' }))
    const stub3 = context.stub(Registry, 'install').callsFake(() => Promise.reject(new Error('oops')))

    savor.addAsset('assets/test-archive', 'test-archive/1/test-archive', context)

    savor.promiseShouldFail(archive.install(), done, (error) => {
        context.expect(error.message).to.equal('oops')
        stub.restore()
        stub2.restore()
        stub3.restore()
    })
}).


add('should install dependencies',  (context: Context, done: Completion)=> {
    const archive = new Archive({ dir: context.dir, id: 'test-archive' })
    const stub = context.stub(Registry, 'extract').callsFake(() => Promise.resolve({ version: '1' }))
    const stub2 = context.stub(Registry, 'manifest').callsFake(() => Promise.resolve({ version: '1' }))
    const stub3 = context.stub(Registry, 'install').callsFake(() => Promise.resolve('ok'))

    savor.addAsset('assets/test-archive', 'test-archive/1/test-archive', context)

    savor.promiseShouldSucceed(archive.install(), done, (result) => {
        context.expect(result.installed).to.be.true

        stub.restore()
        stub2.restore()
        stub3.restore()
    })
}).


run('[Rara] Installer')
