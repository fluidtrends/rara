/* eslint-disable no-unused-expressions */

const savor = require('savor')
const { File } = require('../..')

savor.

add('should load a file from an adapter', (context, done) => {
    const file = new File()

    context.expect(file).to.exist
    done()
}).


run('[Rara] File')
