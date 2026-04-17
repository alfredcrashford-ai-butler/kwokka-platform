import { Container } from 'inversify';
import getDecorators from 'inversify-inject-decorators';

export type InjectableUnit<T = any> =
  | T
  | {
      identifier: T;
      implementer: T;
    };

export interface IocContainerConfig {
  units: InjectableUnit[];
}

export function initIocContainer(config: IocContainerConfig) {
  const container = new Container();
  const { lazyInject } = getDecorators(container);

  (config.units || []).forEach((unit: InjectableUnit) => {
    if (unit.identifier && unit.implementer) {
      container.bind(unit.identifier).to(unit.implementer).inSingletonScope();
    } else if (!unit.identifier && !unit.implementer) {
      container.bind(unit).to(unit).inSingletonScope();
    }
  });

  return { container, decorators: { LazyInject: lazyInject } };
}
