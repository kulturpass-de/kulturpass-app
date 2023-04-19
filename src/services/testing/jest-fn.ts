export const jestFn = <MockedFunction extends (...args: any[]) => any>(implementation?: MockedFunction) =>
  jest.fn<ReturnType<MockedFunction>, Parameters<MockedFunction>>(implementation)
