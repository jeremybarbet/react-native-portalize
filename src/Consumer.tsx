import * as React from 'react';

import { IProvider } from './Host';

interface IProps {
  children: React.ReactNode;
  manager: IProvider | null;
}

export class Consumer extends React.Component<IProps> {
  key: any = undefined;

  async componentDidMount() {
    this.checkManager();

    await Promise.resolve();

    this.key = this.props.manager?.mount(this.props.children);
  }

  componentDidUpdate() {
    this.checkManager();

    this.props.manager?.update(this.key, this.props.children);
  }

  componentWillUnmount() {
    this.checkManager();

    this.props.manager?.unmount(this.key);
  }

  checkManager() {
    if (!this.props.manager) {
      throw new Error('No portal manager defined');
    }
  }

  render() {
    return null;
  }
}
