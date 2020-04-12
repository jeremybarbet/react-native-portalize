import * as React from 'react';

import { Consumer } from './Consumer';
import { Context } from './Host';

interface IPortalProps {
  children: React.ReactNode;
}

export const Portal = ({ children }: IPortalProps) => (
  <Context.Consumer>
    {manager => <Consumer manager={manager}>{children}</Consumer>}
  </Context.Consumer>
);
