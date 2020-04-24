import React, { ReactNode, useState, useImperativeHandle, forwardRef } from 'react';
import { View, StyleSheet } from 'react-native';

export interface IManagerHandles {
  mount(key: number, children: ReactNode): void;
  update(key: number, children: ReactNode): void;
  unmount(key: number): void;
}

export const Manager = forwardRef((_, ref): any => {
  const [portals, setPortals] = useState<{ key: number; children: ReactNode }[]>([]);

  useImperativeHandle(
    ref,
    (): IManagerHandles => ({
      mount(key: number, children: ReactNode): void {
        setPortals(prev => [...prev, { key, children }]);
      },

      update(key: number, children: ReactNode): void {
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
