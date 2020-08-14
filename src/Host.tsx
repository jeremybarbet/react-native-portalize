import * as React from 'react';
import { View, ViewStyle } from 'react-native';

import { Manager, IManagerHandles } from './Manager';

interface IHostProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export interface IProvider {
  mount(children: React.ReactNode): string;
  update(key?: string, children?: React.ReactNode): void;
  unmount(key?: string): void;
}

export const Context = React.createContext<IProvider | null>(null);

export const Host = ({ children, style }: IHostProps): JSX.Element => {
  const managerRef = React.useRef<IManagerHandles>(null);
  const queue: {
    type: 'mount' | 'update' | 'unmount';
    key: string;
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

  //Keep track of all the keys we've generated to ensure uniqueness
  let usedKeys: Array<string> = [];

  //Makes a magical random key
  const keyGenerator = (): string => {
    return `portalize_${Math.random().toString(36).substr(2, 16)}-${Math.random()
      .toString(36)
      .substr(2, 16)}-${Math.random().toString(36).substr(2, 16)}`;
  };

  //Keeps making new keys until a unique one has been found
  const getNewKey = (): string => {
    let foundUniqueKey = false;
    let newKey = '';
    let tries = 0;
    while (!foundUniqueKey && tries < 5) {
      //limit number of tries to stop endless loop of pain
      tries++;
      newKey = keyGenerator();
      if (!usedKeys.includes(newKey)) {
        foundUniqueKey = true;
        usedKeys.push(newKey);
      }
    }

    return newKey;
  };

  const mount = (children: React.ReactNode): string => {
    const key = getNewKey();

    if (managerRef.current) {
      managerRef.current.mount(key, children);
    } else {
      queue.push({ type: 'mount', key, children });
    }

    return key;
  };

  const update = (key: string, children: React.ReactNode): void => {
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

  const unmount = (key: string): void => {
    if (managerRef.current) {
      managerRef.current.unmount(key);
      usedKeys = usedKeys.filter(k => k !== key); //remove our key to make it 'available' again
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
