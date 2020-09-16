import * as React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

export interface IManagerHandles {
  mount(key: string, children: React.ReactNode, style?: ViewStyle): void;
  update(key?: string, children?: React.ReactNode, style?: ViewStyle): void;
  unmount(key?: string): void;
}

export const Manager = React.forwardRef((_, ref): any => {
  const [portals, setPortals] = React.useState<
    { key: string; children: React.ReactNode; style?: ViewStyle }[]
  >([]);

  React.useImperativeHandle(
    ref,
    (): IManagerHandles => ({
      mount(key: string, children: React.ReactNode, style?: ViewStyle): void {
        setPortals(prev => [...prev, { key, children, style }]);
      },

      update(key: string, children: React.ReactNode, style?: ViewStyle): void {
        setPortals(prev =>
          prev.map(item => {
            if (item.key === key) {
              return { ...item, children, style };
            }

            return item;
          }),
        );
      },

      unmount(key: string): void {
        setPortals(prev => prev.filter(item => item.key !== key));
      },
    }),
  );

  return portals.map(({ key, children, style }, index: number) => (
    <View
      key={`react-native-portalize-${key}-${index}`}
      collapsable={false}
      pointerEvents="box-none"
      style={[StyleSheet.absoluteFill, style]}
    >
      {children}
    </View>
  ));
});
