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

**Example with `react-native-modalize` and `react-navigation`**

```tsx
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Modalize } from 'react-native-modalize';
import { Host, Portal } from 'react-native-portalize';

const Tab = createBottomTabNavigator();

const ExamplesScreen = () => {
  const modalRef = useRef<Modalize>(null);

  const onOpen = () => {
    modalRef.current?.open();
  };

  return (
    <>
      <TouchableOpacity onPress={onOpen}>
        <Text>Open the modal</Text>
      </TouchableOpacity>

      <Portal>
        <Modalize ref={modalRef}>...your content</Modalize>
      </Portal>
    </>
  );
};

const SettingsScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Settings screen</Text>
  </View>
);

export const App = () => (
  <NavigationContainer>
    <Host>
      <Tab.Navigator>
        <Tab.Screen name="Examples" component={ExamplesScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </Host>
  </NavigationContainer>
);
```

## Props

### Host

- `children`

A React node that will be most likely wrapping your whole app.

| Type | Required |
| ---- | -------- |
| node | Yes      |

- `style`

Optional props to define the style of the Host component.

| Type  | Required |
| ----- | -------- |
| style | No       |

### Portal

- `children`

The React node you want to display on top of the rest.

| Type | Required |
| ---- | -------- |
| node | Yes      |
