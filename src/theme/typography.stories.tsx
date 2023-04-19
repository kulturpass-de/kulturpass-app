import React from 'react'
import { storiesOf } from '@storybook/react-native'
import { StyleSheet, Text, View } from 'react-native'
import { textStyles } from './typography'

storiesOf('Typography', module).add('Basic', () => {
  return (
    <View>
      {Object.entries(textStyles).map(object => {
        const key = object[0]
        const value = object[1]
        return (
          <View style={style.textContainer} key={key}>
            <Text style={value}>{key}</Text>
          </View>
        )
      })}
    </View>
  )
})

const style = StyleSheet.create({
  textContainer: { borderWidth: 1, borderColor: '#ccc', backgroundColor: '#ddd', marginVertical: 2 },
})
