import * as React from 'react';
import { View, ViewStyle } from 'react-native';

import { useKey } from './hooks/useKey';
import { Manager, IManagerHandles } from './Manager';

interface IHostProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export interface IProvider {
  mount(children: React.ReactNode, style?: ViewStyle): string;
  update(key?: string, children?: React.ReactNode, style?: ViewStyle): void;
  unmount(key?: string): void;
}

export const Context = React.createContext<IProvider | null>(null);

export const Host = ({ children, style }: IHostProps): JSX.Element => {
  const managerRef = React.useRef<IManagerHandles>(null);
  const queue: {
    type: 'mount' | 'update' | 'unmount';
    key: string;
    children?: React.ReactNode;
    style?: ViewStyle;
  }[] = [];
  const { generateKey, removeKey } = useKey();

  React.useEffect(() => {
    while (queue.length && managerRef.current) {
      const action = queue.pop();

      if (action) {
        switch (action.type) {
          case 'mount':
            managerRef.current?.mount(action.key, action.children, action.style);
            break;
          case 'update':
            managerRef.current?.update(action.key, action.children, action.style);
            break;
          case 'unmount':
            managerRef.current?.unmount(action.key);
            break;
        }
      }
    }
  }, []);

  const mount = (children: React.ReactNode, style?: ViewStyle): string => {
    const key = generateKey();

    if (managerRef.current) {
      managerRef.current.mount(key, children, style);
    } else {
      queue.push({ type: 'mount', key, children, style });
    }

    return key;
  };

  const update = (key: string, children: React.ReactNode, style?: ViewStyle): void => {
    if (managerRef.current) {
      managerRef.current.update(key, children, style);
    } else {
      const op = { type: 'mount' as 'mount', key, children, style };
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

  const unmount = (key: string): void => {
    if (managerRef.current) {
      managerRef.current.unmount(key);
      removeKey(key);
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
