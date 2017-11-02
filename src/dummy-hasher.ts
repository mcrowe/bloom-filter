export default function makeHash(seed: number) {
  return (word: string) => {
    const str = seed.toString() + word

    /* Simple hash function. */
    var a = 1, c = 0, h, o;
    if (str) {
        a = 0;
        for (h = str.length - 1; h >= 0; h--) {
            o = str.charCodeAt(h);
            a = (a<<6&268435455) + o + (o<<14);
            c = a & 266338304;
            a = c!==0?a^c>>21:a;
        }
    }
    return a
  }
}