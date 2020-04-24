import { ReactNode, Component } from 'react';

import { IProvider } from './Host';

interface IProps {
  children: ReactNode;
  manager: IProvider | null;
}

export class Consumer extends Component<IProps> {
  key: any = undefined;

  async componentDidMount(): Promise<void> {
    this.checkManager();

    await Promise.resolve();

    this.key = this.props.manager?.mount(this.props.children);
  }

  componentDidUpdate(): void {
    this.checkManager();

    this.props.manager?.update(this.key, this.props.children);
  }

  componentWillUnmount(): void {
    this.checkManager();

    this.props.manager?.unmount(this.key);
  }

  checkManager(): void {
    if (!this.props.manager) {
      throw new Error('No portal manager defined');
    }
  }

  render(): null {
    return null;
  }
}
