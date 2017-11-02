/**
 * Make a buffer backend from an existing buffer.
 *
 * @param buffer Initial buffer
 */
export function makeWithBuffer(buffer: Buffer) {

  return {

      getBuffer(): Buffer {
        return buffer
      },

      async getBits(indexes: number[]): Promise<boolean[]> {
        const bits: boolean[] = []

        for (const index of indexes) {
          bits.push(this.getBit(index))
        }

        return bits
      },

      async setBits(indexes: number[]) {
        for (const index of indexes) {
          this.setBit(index)
        }
      },

      setBit(index: number) {
        const byte = Math.floor(index / 8)
        const shift = index % 8
        buffer[byte] = buffer[byte] | (0x1 << shift)
      },

      getBit(index: number): boolean {
        const byte = Math.floor(index / 8)
        const shift = index % 8

        return (buffer[byte] & (0x1 << shift)) !== 0
      }
    }

}


/**
 * Make a buffer backend with the given size.
 *
 * @param size Number of bits
 */
export function makeWithSize(size: number) {
  const buffer = Buffer.alloc(Math.ceil(size / 8))
  return makeWithBuffer(buffer)
}