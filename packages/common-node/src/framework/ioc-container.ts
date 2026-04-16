import { Container } from 'inversify';

export type InjectableUnit<T = any> = T | { identifier: T; implementer: T };

export interface IocContainerConfig {
  units: InjectableUnit[];
}

export class IocContainer {
  private container: Container;

  public constructor() {
    this.container = new Container();
  }

  public get<T>(identifier: any): T {
    return this.container.get<T>(identifier);
  }

  public bindUnits(units: InjectableUnit[]): void {
    (units || []).forEach((unit: InjectableUnit) => {
      if (unit.identifier && unit.implementer) {
        this.bindSingleton(this.container, unit);
      } else if (!unit.identifier && !unit.implementer) {
        this.bindSingleton(this.container, { identifier: unit, implementer: unit });
      }
    });
  }

  private bindSingleton(container: Container, unit: InjectableUnit): void {
    container.bind(unit.identifier).to(unit.implementer).inSingletonScope();
  }
}
