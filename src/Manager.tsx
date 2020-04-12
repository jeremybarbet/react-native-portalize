import * as React from 'react';
import { View, StyleSheet } from 'react-native';

export interface IManager {
  mount(key: number, children: React.ReactNode): void;
  update(key: number, children: React.ReactNode): void;
  unmount(key: number): void;
}

interface IState {
  portals: { key: number; children: React.ReactNode }[];
}

export class Manager extends React.PureComponent<{}, IState> {
  state: IState = { portals: [] };

  public mount = (key: number, children: React.ReactNode) => {
    this.setState(state => ({
      portals: [...state.portals, { key, children }],
    }));
  };

  public update = (key: number, children: React.ReactNode) => {
    this.setState(state => ({
      portals: state.portals.map(item => {
        if (item.key === key) {
          return { ...item, children };
        }

        return item;
      }),
    }));
  };

  public unmount = (key: number) => {
    this.setState(state => ({
      portals: state.portals.filter(item => item.key !== key),
    }));
  };

  render() {
    return this.state.portals.map(({ key, children }) => (
      <View key={key} collapsable={false} pointerEvents="box-none" style={StyleSheet.absoluteFill}>
        {children}
      </View>
    ));
  }
}
