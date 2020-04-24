import { ReactNode, useEffect } from 'react';

import { IProvider } from './Host';

interface IConsumerProps {
  children: ReactNode;
  manager: IProvider | null;
}

export const Consumer = ({ children, manager }: IConsumerProps): null => {
  let key: number | undefined = undefined;

  const checkManager = (): void => {
    if (!manager) {
      throw new Error('No portal manager defined');
    }
  };

  const handleInit = async (): Promise<void> => {
    checkManager();

    await Promise.resolve();

    key = manager?.mount(children);
  };

  useEffect(() => {
    if (key) {
      checkManager();

      manager?.update(key, children);
    }
  }, [children, manager]);

  useEffect(() => {
    handleInit();

    return (): void => {
      if (key) {
        checkManager();

        manager?.unmount(key);
      }
    };
  }, []);

  return null;
};
