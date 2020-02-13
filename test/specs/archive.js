/* eslint-disable no-unused-expressions */

const savor = require('savor')
const { Archive, File } = require('../..')
const fs = require('fs-extra')

savor.

add('should not load a missing archive', (context, done) => {
    const archive = new Archive({ dir: context.dir, id: 'test-archive' })

    savor.promiseShouldFail(archive.load(), done, (error) => {
        context.expect(error.message).to.equal(Archive.ERRORS.CANNOT_LOAD('it does not exist'))
    })
}).

add('should not load an archive with invalid files', (context, done) => {
    const archive = new Archive({ dir: context.dir, id: 'invalid-archive' })
    savor.addAsset('assets/invalid-archive', 'invalid-archive', context)

    savor.promiseShouldFail(archive.load(), done, (error) => {
        context.expect(error.message.startsWith(File.ERRORS.CANNOT_LOAD())).to.be.true
    })
}).

add('should load a valid archive', (context, done) => {
    const archive = new Archive({ dir: context.dir, id: 'test-archive' })
    savor.addAsset('assets/test-archive', 'test-archive', context)

    savor.promiseShouldSucceed(archive.load(), done, (output) => {
        context.expect(archive.files.length).to.equal(7)
    })
}).

run('[Rara] Archive')
