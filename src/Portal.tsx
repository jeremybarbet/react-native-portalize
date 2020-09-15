import * as React from 'react';
import { ViewStyle } from 'react-native';

import { Consumer } from './Consumer';
import { Context } from './Host';

interface IPortalProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const Portal = ({ children, style }: IPortalProps): JSX.Element => (
  <Context.Consumer>
    {(manager): JSX.Element => (
      <Consumer manager={manager} style={style}>
        {children}
      </Consumer>
    )}
  </Context.Consumer>
);
