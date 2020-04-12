import * as React from 'react';
import { View } from 'react-native';

import { Manager, IManager } from './Manager';

interface IProps {
  children: React.ReactNode;
}

export interface IProvider {
  mount(children: React.ReactNode): number;
  update(key: number, children: React.ReactNode): void;
  unmount(key: number): void;
}

export const Context = React.createContext<IProvider | null>(null);

export class Host extends React.Component<IProps> {
  nextKey: number = 0;
  queue: { type: 'mount' | 'update' | 'unmount'; key: number; children?: React.ReactNode }[] = [];
  manager: IManager | null = null;

  componentDidMount() {
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

  mount = (children: React.ReactNode) => {
    const key = this.nextKey++;

    if (this.manager) {
      this.manager.mount(key, children);
    } else {
      this.queue.push({ type: 'mount', key, children });
    }

    return key;
  };

  update = (key: number, children: React.ReactNode) => {
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

  unmount = (key: number) => {
    if (this.manager) {
      this.manager.unmount(key);
    } else {
      this.queue.push({ type: 'unmount', key });
    }
  };

  render() {
    const { children } = this.props;

    return (
      <Context.Provider value={{ mount: this.mount, update: this.update, unmount: this.unmount }}>
        <View style={{ flex: 1 }} collapsable={false} pointerEvents="box-none">
          {children}
        </View>

        <Manager ref={el => (this.manager = el)} />
      </Context.Provider>
    );
  }
}
