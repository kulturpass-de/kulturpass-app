import { encodeBodyPayload } from './encode-body-payload'

describe('encode-body-payload', () => {
  it('should encode object properly', async () => {
    const res1 = encodeBodyPayload({
      my: { complex: 'payload' },
      with: ['array', 123, { nested: null }],
      andOmittedProperty: undefined,
    })
    expect(res1).toEqual({
      my: '{"complex":"payload"}',
      with: '["array",123,{"nested":null}]',
    })

    const res2 = encodeBodyPayload({
      some: 'simple_payload',
      thisShouldBeExcluded: undefined,
      another: { more: { complex: ['payload', 123] } },
      andNull: null,
    })
    expect(res2).toEqual({
      some: 'simple_payload',
      another: '{"more":{"complex":["payload",123]}}',
      andNull: 'null',
    })

    const res3 = encodeBodyPayload({
      a: { deep: { nested: 'string' }, boolean: false, number: 1234 },
      and: { some: { deep: ['array', 4, { with: 'a property', omitted: undefined }] } },
      also: { aNullValue: null, andAnUndefined: undefined },
    })
    expect(res3).toEqual({
      a: '{"deep":{"nested":"string"},"boolean":false,"number":1234}',
      and: '{"some":{"deep":["array",4,{"with":"a property"}]}}',
      also: '{"aNullValue":null}',
    })
  })
})
