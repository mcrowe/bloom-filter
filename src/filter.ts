import {
  range,
  all,
  isTruthy
} from './util'


export interface IOptions {
  backend: IBackender
  hasher: IHasher
  numHashes: number
  numBits: number
  hashSeeds?: number[]
}


export interface IBackender {
  (numBits: number): IBackend
}


export interface IBackend {

  setBits(indexes: number[]): Promise<void>

  getBits(indexes: number[]): Promise<boolean[]>

}


export interface IHasher {
  (seed: number): IHash
}


export interface IHash {
  (word: string): number
}


export default class Filter {

  backend: IBackend
  hashes: IHash[] = []
  numBits: number

  constructor(options: IOptions) {
    this.numBits = options.numBits
    this.backend = options.backend(options.numBits)

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

  getIndexes(word: string): number[] {
    const indexes: number[] = []

    for (const hash of this.hashes) {
      const index = hash(word) % this.numBits
      indexes.push(index)
    }

    return indexes
  }

}