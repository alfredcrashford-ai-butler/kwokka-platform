import { InjectableUnit, IocContainer } from './ioc-container';

export abstract class Module {
  public get components(): InjectableUnit[] {
    return [];
  }
}

export class TestingModule extends Module {
  public readonly container: IocContainer;

  public constructor() {
    super();
    this.container = new IocContainer();
    this.container.bindUnits(this.components);
  }

  public static setup(components: InjectableUnit[]): TestingModule {
    const TargetModule = class extends TestingModule {
      public get components(): InjectableUnit[] {
        return components;
      }
    };
    return new TargetModule();
  }
}

export abstract class BootstrapModule extends Module {
  public readonly container: IocContainer;

  public abstract bootstrap(): Promise<void>;

  public constructor() {
    super();
    this.container = new IocContainer();
    const modulesComponents = this.modules.map((el) => el.components).flat();
    const components = [...modulesComponents, ...this.components];
    this.container.bindUnits(components);
  }

  public get modules(): Module[] {
    return [];
  }
}
