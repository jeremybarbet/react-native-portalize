import React, { ReactNode } from 'react';

import { Consumer } from './Consumer';
import { Context } from './Host';

interface IPortalProps {
  children: ReactNode;
}

export const Portal = ({ children }: IPortalProps): JSX.Element => (
  <Context.Consumer>
    {(manager): any => <Consumer manager={manager}>{children}</Consumer>}
  </Context.Consumer>
);
