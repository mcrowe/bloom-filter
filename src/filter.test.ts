import test from 'ava'
import Filter from './filter'
import dummyHasher from './dummy-hasher'
import * as BufferBackend from './buffer-backend'


test('basics', async t => {
  const filter = new Filter({
    backend: BufferBackend.makeWithSize,
    hasher: dummyHasher,
    numHashes: 7,
    numBits: 256
  })

  t.is( await filter.test('abc'), false )

  await filter.add('abc')

  t.is( await filter.test('abc'), true )

  t.is( await filter.test('abcd'), false )
})


test('error rates', async t => {
  const filter = new Filter({
    backend: BufferBackend.makeWithSize,
    hasher: dummyHasher,
    numHashes: 7,
    numBits: 959
  })

  const words: string[] = []

  for (let i = 0; i < 100; i++) {
    words.push( randomWord() )
  }

  for (const n of words) {
    await filter.add(n)
  }

  // Should recall all
  for (const n of words) {
    t.is( await filter.test(n), true )
  }

  let n = 0
  for (let i = 0; i < 100; i++) {
    const word = randomWord()
    if (await filter.test(word)) {
      n += 1
    }
  }

  t.is( n < 15, true, 'false positives should be low')
})


function randomWord(): string {
  return Math.floor(Math.random() * 1000000).toString()
}