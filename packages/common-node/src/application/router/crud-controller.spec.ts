import { injectable, injectFromBase } from 'inversify';
import { Adapter, PublicProps } from '@kwokka/utils';
import { Entity } from '@kwokka/entities';
import { CrudController } from './crud-controller';
import { TestingModule } from '../../framework';
import { ConfigService, LoggerService, WinstonLoggerService } from '../service';
import { ConfigServiceMock } from '../../../test/__mocks__';

@injectable()
@injectFromBase()
class ChildController extends CrudController<Entity> {
  protected get adapter(): Adapter<Entity, PublicProps<Entity>> {
    throw new Error('Not implemented.');
  }
}

describe(CrudController, () => {
  it('exists', () => {
    expect(CrudController).toBeTruthy();
  });

  it('child class can use logger', () => {
    const testingModule = TestingModule.setup([
      ChildController,
      { identifier: ConfigService, implementer: ConfigServiceMock },
      { identifier: LoggerService, implementer: WinstonLoggerService },
    ]);
    const controller = testingModule.container.get<ChildController>(ChildController);
    expect(controller['logger']).toBeTruthy();
  });

  // TODO: add tests https://mygameapp.atlassian.net/browse/KWOKKA-395
});
