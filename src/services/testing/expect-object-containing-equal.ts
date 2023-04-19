export const expectObjectContainingEqual = <Obj extends {}>(obj: Obj) => {
  const res = (Object.keys(obj) as (keyof Obj)[]).reduce((acc, key) => {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key]
      if (value && typeof value === 'object') {
        acc[key] = expectObjectContainingEqual(value)
      } else {
        acc[key] = value
      }
    }
    return acc
  }, {} as Obj)

  return expect.objectContaining(res)
}
