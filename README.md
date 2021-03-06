# bloom-filter

Persistance and hash-function agnostic bloom filter for Javascript and Typescript.

## Usage

> npm install @mcrowe/bloom-filter --save

```js
import {
  BloomFilter,
  BufferBackend,
  DummyHasher
} from '@mcrowe/bloom-filter'


(async function() {


  const filter = new BloomFilter({
    backend: BufferBackend,
    hasher: DummyHasher,
    numHashes: 7,
    numBits: 512
  })

  await filter.add('abc')

  if (await filter.test('abc')) {
    console.log('it works!')
  }


})()


```

## Development

Install npm modules:

> npm install

Run tests:

> npm test

## Release

Release a new version:

> bin/release.sh

This will publish a new version to npm, as well as push a new tag up to github.
