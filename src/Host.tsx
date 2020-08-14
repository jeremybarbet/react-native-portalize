import * as React from 'react';
import { View, ViewStyle } from 'react-native';

import { Manager, IManagerHandles } from './Manager';

interface IHostProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export interface IProvider {
  mount(children: React.ReactNode): number;
  update(key?: number, children?: React.ReactNode): void;
  unmount(key?: number): void;
}

export const Context = React.createContext<IProvider | null>(null);

export const Host = ({ children, style }: IHostProps): JSX.Element => {
  const managerRef = React.useRef<IManagerHandles>(null);
  const queue: {
    type: 'mount' | 'update' | 'unmount';
    key: number;
    children?: React.ReactNode;
  }[] = [];

  React.useEffect(() => {
    while (queue.length && managerRef.current) {
      const action = queue.pop();

      if (action) {
        switch (action.type) {
          case 'mount':
            managerRef.current?.mount(action.key, action.children);
            break;
          case 'update':
            managerRef.current?.update(action.key, action.children);
            break;
          case 'unmount':
            managerRef.current?.unmount(action.key);
            break;
        }
      }
    }
  }, []);

  const mount = (children: React.ReactNode): number => {
    const key = `portal_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    if (managerRef.current) {
      managerRef.current.mount(key, children);
    } else {
      queue.push({ type: 'mount', key, children });
    }

    return key;
  };

  const update = (key: number, children: React.ReactNode): void => {
    if (managerRef.current) {
      managerRef.current.update(key, children);
    } else {
      const op = { type: 'mount' as 'mount', key, children };
      const index = queue.findIndex(
        o => o.type === 'mount' || (o.type === 'update' && o.key === key),
      );

      if (index > -1) {
        queue[index] = op;
      } else {
        queue.push(op);
      }
    }
  };

  const unmount = (key: number): void => {
    if (managerRef.current) {
      managerRef.current.unmount(key);
    } else {
      queue.push({ type: 'unmount', key });
    }
  };

  return (
    <Context.Provider value={{ mount, update, unmount }}>
      <View style={[{ flex: 1 }, style]} collapsable={false} pointerEvents="box-none">
        {children}
      </View>

      <Manager ref={managerRef} />
    </Context.Provider>
  );
};
