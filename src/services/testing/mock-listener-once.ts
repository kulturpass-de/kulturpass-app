// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type Last<T extends any[]> = T extends [...infer I, infer L] ? L : never

export const mockListenerOnce = <Result extends { unsubscribe: () => void }, Params extends any[]>(
  jestFn: (...args: Params) => Result,
): { current?: Last<Params> } => {
  const callback: { current?: Last<Params> } = {}

  ;(jestFn as Partial<jest.Mock>).mockImplementationOnce?.((...params) => {
    callback.current = params[params.length - 1]
    return { unsubscribe: () => {} }
  })

  return callback
}
