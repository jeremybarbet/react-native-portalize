import * as React from 'react';
import { ViewStyle } from 'react-native';

import { IProvider } from './Host';

interface IConsumerProps {
  children: React.ReactNode;
  manager: IProvider | null;
  style?: ViewStyle;
}

export const Consumer = ({ children, manager, style }: IConsumerProps): null => {
  const key = React.useRef<string | undefined>(undefined);

  const checkManager = (): void => {
    if (!manager) {
      throw new Error('No portal manager defined');
    }
  };

  const handleInit = (): void => {
    checkManager();
    key.current = manager?.mount(children, style);
  };

  React.useEffect(() => {
    checkManager();
    manager?.update(key.current, children, style);
  }, [children, manager, style]);

  React.useEffect(() => {
    handleInit();

    return (): void => {
      checkManager();
      manager?.unmount(key.current);
    };
  }, []);

  return null;
};
