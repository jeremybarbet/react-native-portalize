import * as React from 'react';
import { View, StyleSheet } from 'react-native';

export interface IManagerHandles {
  mount(key: number, children: React.ReactNode): void;
  update(key?: number, children?: React.ReactNode): void;
  unmount(key?: number): void;
}

export const Manager = React.forwardRef((_, ref): any => {
  const [portals, setPortals] = React.useState<{ key: number; children: React.ReactNode }[]>([]);

  React.useImperativeHandle(
    ref,
    (): IManagerHandles => ({
      mount(key: number, children: React.ReactNode): void {
        setPortals(prev => [...prev, { key, children }]);
      },

      update(key: number, children: React.ReactNode): void {
        setPortals(prev =>
          prev.map(item => {
            if (item.key === key) {
              return { ...item, children };
            }

            return item;
          }),
        );
      },

      unmount(key: number): void {
        setPortals(prev => prev.filter(item => item.key !== key));
      },
    }),
  );

  return portals.map(({ key, children }) => (
    <View key={key} collapsable={false} pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      {children}
    </View>
  ));
});
