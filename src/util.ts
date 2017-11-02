export function range(n: number): number[] {
  const xs: number[] = []

  for (let i = 0; i < n; i++) {
    xs.push(i)
  }

  return xs
}


export function all<T>(xs: T[], predicate: (x: T) => boolean): boolean {
  for (const x of xs) {
    if (!predicate(x)) {
      return false
    }
  }

  return true
}


export function isTruthy<T>(x: T): boolean {
  return !!x
}