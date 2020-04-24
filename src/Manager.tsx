import React, { ReactNode, PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';

export interface IManager {
  mount(key: number, children: ReactNode): void;
  update(key: number, children: ReactNode): void;
  unmount(key: number): void;
}

interface IState {
  portals: { key: number; children: ReactNode }[];
}

export class Manager extends PureComponent<{}, IState> {
  state: IState = { portals: [] };

  public mount = (key: number, children: ReactNode): void => {
    this.setState(state => ({
      portals: [...state.portals, { key, children }],
    }));
  };

  public update = (key: number, children: ReactNode): void => {
    this.setState(state => ({
      portals: state.portals.map(item => {
        if (item.key === key) {
          return { ...item, children };
        }

        return item;
      }),
    }));
  };

  public unmount = (key: number): void => {
    this.setState(state => ({
      portals: state.portals.filter(item => item.key !== key),
    }));
  };

  render(): JSX.Element[] {
    return this.state.portals.map(({ key, children }) => (
      <View key={key} collapsable={false} pointerEvents="box-none" style={StyleSheet.absoluteFill}>
        {children}
      </View>
    ));
  }
}
