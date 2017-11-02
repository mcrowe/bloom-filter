import test from 'ava'
import * as BufferBackend from './buffer-backend'
import * as fs from 'fs'


test('BufferBackend:basics', t => {
  const backend = BufferBackend.makeWithSize(256)

  backend.setBit(0)
  backend.setBit(9)

  t.is(backend.getBit(0), true)
  t.is(backend.getBit(1), false)
  t.is(backend.getBit(9), true)
  t.is(backend.getBit(11), false)
})


test('BufferBackend:persistance', t => {
  const backend = BufferBackend.makeWithSize(1024)

  backend.setBit(100)

  const filename = '/tmp/buffer.dat'

  fs.writeFileSync(filename, backend.getBuffer())

  const loadedBuffer = fs.readFileSync('/tmp/buffer.dat')

  const loadedBackend = BufferBackend.makeWithBuffer(loadedBuffer)

  t.is(loadedBackend.getBit(100), true)
  t.is(loadedBackend.getBit(101), false)
})