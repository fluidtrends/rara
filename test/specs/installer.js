/* eslint-disable no-unused-expressions */

const savor = require('savor')
const { Archive, File } = require('../..')
const path = require('path')
const fs = require('fs-extra')
const npm = require('libnpm')
const npmcore = require('npm')

savor.

add('should handle npm load error', (context, done) => {
    const archive = new Archive({ dir: context.dir, id: 'test-archive' })
    const stub = context.stub(npm, 'extract').callsFake(() => Promise.resolve({ version: '1' }))
    const stub2 = context.stub(npm, 'manifest').callsFake(() => Promise.resolve({ version: '1' }))
    const stub3 = context.stub(npmcore, 'load').callsFake((options, cb) => cb(new Error('oops')))

    savor.addAsset('assets/test-archive', 'test-archive/1', context)

    savor.promiseShouldFail(archive.installDependencies(), done, (error) => {
        context.expect(error.message).to.equal('oops')
        stub.restore()
        stub2.restore()
        stub3.restore()
    })
}).

add('should handle npm deps download error', (context, done) => {
    const archive = new Archive({ dir: context.dir, id: 'test-archive' })
    const stub = context.stub(npm, 'extract').callsFake(() => Promise.resolve({ version: '1' }))
    const stub2 = context.stub(npm, 'manifest').callsFake(() => Promise.resolve({ version: '1' }))
    const stub3 = context.stub(npmcore, 'load').callsFake((options, cb) => cb(null, {
        commands: {
            install: (cb) => cb(new Error('oops'))
        }
    }))

    savor.addAsset('assets/test-archive', 'test-archive/1', context)

    savor.promiseShouldFail(archive.installDependencies(), done, (error) => {
        context.expect(error.message).to.equal('oops')
        stub.restore()
        stub2.restore()
        stub3.restore()
    })
}).

add('should handle npm deps download error', (context, done) => {
    const archive = new Archive({ dir: context.dir, id: 'test-archive' })
    const stub = context.stub(npm, 'extract').callsFake(() => Promise.resolve({ version: '1' }))
    const stub2 = context.stub(npm, 'manifest').callsFake(() => Promise.resolve({ version: '1' }))
    const stub3 = context.stub(npmcore, 'load').callsFake((options, cb) => cb(null, {
        commands: {
            install: (cb) => cb(null, { test: "1234" })
        }
    }))

    savor.addAsset('assets/test-archive', 'test-archive/1', context)

    savor.promiseShouldSucceed(archive.installDependencies(), done, (data) => {
        context.expect(data.test).to.equal('1234')
        context.expect(data.totalTime).to.exist
        stub.restore()
        stub2.restore()
        stub3.restore()
    })
}).


run('[Rara] Installer')
