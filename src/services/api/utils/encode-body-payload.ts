export const encodeBodyPayload = <BodyPayload extends {}>(bodyPayload: BodyPayload) => {
  const bodyPayloadWithEncodedValues = Object.fromEntries(
    Object.entries(bodyPayload)
      .filter(([_key, value]) => value !== undefined)
      .map(([key, value]) => {
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          return [key, value.toString()]
        }

        return [key, JSON.stringify(value)]
      }),
  )

  return bodyPayloadWithEncodedValues
}
