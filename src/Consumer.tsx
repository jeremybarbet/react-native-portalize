import * as React from 'react';

import { IProvider } from './Host';

interface IConsumerProps {
  children: React.ReactNode;
  manager: IProvider | null;
}

export const Consumer = ({ children, manager }: IConsumerProps): null => {
  const [key, setKey] = React.useState<number | undefined>(undefined);

  const checkManager = (): void => {
    if (!manager) {
      throw new Error('No portal manager defined');
    }
  };

  const handleInit = (): void => {
    checkManager();
    setKey(manager?.mount(children));
  };

  React.useEffect(() => {
    checkManager();
    manager?.update(key, children);
  }, [children, manager]);

  React.useEffect(() => {
    handleInit();

    return (): void => {
      checkManager();
      manager?.unmount(key);
    };
  }, []);

  return null;
};
