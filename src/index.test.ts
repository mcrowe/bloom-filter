import test from 'ava'
// import { doSomething } from './index'

import {
  range,
  all,
  isTruthy
} from './util'


interface IOptions {
  backend: IBackend
  hasher: IHasher
  numHashes: number
  numBits: number
  hashSeeds?: number[]
}


interface IBackend {

  setBits(indexes: number[]): Promise<void>

  getBits(indexes: number[]): Promise<boolean[]>

}

interface IHasher {
  (seed: number): IHash
}


interface IHash {
  (word: string): number
}


class BloomFilter {

  backend: IBackend
  hashes: IHash[] = []

  constructor(options: IOptions) {
    this.backend = options.backend

    const seeds = options.hashSeeds || range(options.numHashes)

    this.hashes = seeds.map(options.hasher)
  }

  async test(word: string): Promise<boolean> {
    const indexes = this.getIndexes(word)
    const bits = await this.backend.getBits(indexes)
    return all(bits, isTruthy)
  }

  async add(word: string): Promise<void> {
    const indexes = this.getIndexes(word)
    await this.backend.setBits(indexes)
  }

  private getIndexes(word: string): number[] {
    const indexes: number[] = []

    for (const hash of this.hashes) {
      indexes.push( hash(word) )
    }

    return indexes
  }

}


function basicHasher(seed: number) {
  return (word: string) => {
    const str = seed + word
    let h = 0

    for (let i = 0; i < str.length; i++) {
      h += str.charCodeAt(i)
    }

    return h
  }
}


class BufferBackend implements IBackend {

  buffer: Buffer

  constructor(bits: number) {
    this.buffer = Buffer.alloc(Math.ceil(bits / 8))
  }

  async getBits(indexes: number[]): Promise<boolean[]> {
    const bits: boolean[] = []

    for (const index of indexes) {
      bits.push(this.getBit(index))
    }

    return bits
  }

  async setBits(indexes: number[]) {
    for (const index of indexes) {
      this.setBit(index)
    }
  }

  setBit(index: number) {
    const byte = Math.floor(index / 8)
    const shift = index % 8

    this.buffer[byte] = this.buffer[byte] | (0x1 << shift)
  }

  getBit(index: number): boolean {
    const byte = Math.floor(index / 8)
    const shift = index % 8

    return (this.buffer[byte] & (0x1 << shift)) !== 0
  }

}


test('BufferBackend', t => {

  const backend = new BufferBackend(256)

  backend.setBit(0)
  backend.setBit(9)

  t.is(backend.getBit(0), true)
  t.is(backend.getBit(1), false)
  t.is(backend.getBit(9), true)
  t.is(backend.getBit(11), false)
})


test('BloomFilter', t => {
  const backend = new BufferBackend(256)

  const filter = new BloomFilter({
    backend: backend,
    hasher: basicHasher,
    numHashes: 7,
    numBits: 256
  })

})