# Portalize

[![npm version](https://badge.fury.io/js/react-native-portalize.svg)](https://badge.fury.io/js/react-native-portalize)

The simplest way to render anything on top of the rest.

This component is extracted from [`react-native-paper`](https://github.com/callstack/react-native-paper/tree/master/src/components/Portal) and has been simplified for the purpose of [`react-native-modalize`](https://github.com/jeremybarbet/react-native-modalize).

## Installation

```bash
yarn add react-native-portalize
```

## Usage

```tsx
import React from 'react';
import { View, Text } from 'react-native';
import { Host, Portal } from 'react-native-portalize';

export const MyApp = () => (
  <Host>
    <View>
      <Text>Some copy here and there...</Text>

      <Portal>
        <Text>A portal on top of the rest</Text>
      </Portal>
    </View>
  </Host>
);
```
