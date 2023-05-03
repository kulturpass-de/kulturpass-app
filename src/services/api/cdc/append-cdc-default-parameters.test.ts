import { appendCdcDefaultParameters } from './append-cdc-default-parameters'

describe('append-cdc-default-parameters', () => {
  it('should append targetEnv, timestamp and nonce', async () => {
    const res = appendCdcDefaultParameters({ irrelevantProperty: 'should remain as is' })

    expect(res).toHaveProperty('irrelevantProperty', 'should remain as is')
    expect(res).toHaveProperty('targetEnv', 'mobile')
    expect(res).toHaveProperty('timestamp')
    expect(res).toHaveProperty('nonce')
  })

  it('should overwrite targetEnv, timestamp and nonce', async () => {
    const res = appendCdcDefaultParameters({
      irrelevantProperty: 'should remain as is',
      targetEnv: 'another',
      timestamp: 0,
      nonce: 1,
    })

    expect(res).toHaveProperty('irrelevantProperty', 'should remain as is')
    expect(res).toHaveProperty('targetEnv', 'mobile')
    expect(res).toHaveProperty('timestamp')
    expect(res.timestamp).not.toBe(0)
    expect(res).toHaveProperty('nonce')
    expect(res.nonce).not.toBe(1)
  })
})
