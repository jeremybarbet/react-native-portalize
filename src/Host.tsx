import React, { ReactNode, Component, createContext } from 'react';
import { View, ViewStyle } from 'react-native';

import { Manager, IManager } from './Manager';

interface IProps {
  children: ReactNode;
  style?: ViewStyle;
}

export interface IProvider {
  mount(children: ReactNode): number;
  update(key: number, children: ReactNode): void;
  unmount(key: number): void;
}

export const Context = createContext<IProvider | null>(null);

export class Host extends Component<IProps> {
  nextKey = 0;
  queue: { type: 'mount' | 'update' | 'unmount'; key: number; children?: ReactNode }[] = [];
  manager: IManager | null = null;

  componentDidMount(): void {
    const manager = this.manager;
    const queue = this.queue;

    while (queue.length && manager) {
      const action = queue.pop();

      if (action) {
        switch (action.type) {
          case 'mount':
            manager.mount(action.key, action.children);
            break;
          case 'update':
            manager.update(action.key, action.children);
            break;
          case 'unmount':
            manager.unmount(action.key);
            break;
        }
      }
    }
  }

  mount = (children: ReactNode): number => {
    const key = this.nextKey++;

    if (this.manager) {
      this.manager.mount(key, children);
    } else {
      this.queue.push({ type: 'mount', key, children });
    }

    return key;
  };

  update = (key: number, children: ReactNode): void => {
    if (this.manager) {
      this.manager.update(key, children);
    } else {
      const op = { type: 'mount' as 'mount', key, children };
      const index = this.queue.findIndex(
        o => o.type === 'mount' || (o.type === 'update' && o.key === key),
      );

      if (index > -1) {
        this.queue[index] = op;
      } else {
        this.queue.push(op);
      }
    }
  };

  unmount = (key: number): void => {
    if (this.manager) {
      this.manager.unmount(key);
    } else {
      this.queue.push({ type: 'unmount', key });
    }
  };

  render(): JSX.Element {
    const { children, style } = this.props;

    return (
      <Context.Provider value={{ mount: this.mount, update: this.update, unmount: this.unmount }}>
        <View style={[{ flex: 1 }, style]} collapsable={false} pointerEvents="box-none">
          {children}
        </View>

        <Manager ref={(el): any => (this.manager = el)} />
      </Context.Provider>
    );
  }
}
