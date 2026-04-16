import { injectable } from 'inversify';
import { AuthServiceMock, ErrorTrackerServiceMock, LoggerServiceMock } from '../../../test/__mocks__';
import { TestingModule } from '../../framework/module';
import { Router } from '../router';
import { AuthService, ConfigService } from '../service';
import { ErrorTrackerService } from '../service/error-tracker';
import { LoggerService } from '../service/logger';
import { HttpServer } from './http-server';

@injectable()
class TestRouter extends Router {}

describe(HttpServer, () => {
  let testingModule: TestingModule;

  beforeEach(() => {
    jest.spyOn(ConfigService.prototype, 'get').mockReturnValue('8000');
    testingModule = TestingModule.setup([
      HttpServer,
      TestRouter,
      { identifier: ErrorTrackerService, implementer: ErrorTrackerServiceMock },
      { identifier: LoggerService, implementer: LoggerServiceMock },
      { identifier: AuthService, implementer: AuthServiceMock },
      ConfigService,
    ]);
  });

  afterEach(() => jest.restoreAllMocks());

  it('exists', () => {
    expect(HttpServer).toBeTruthy();
  });

  it('works', () => {
    expect(testingModule.container.get(HttpServer)).toBeTruthy();
  });

  describe('start()', () => {
    it('exists', () => {
      const httpServer = testingModule.container.get<HttpServer>(HttpServer);
      expect(httpServer.start).toBeTruthy();
    });

    it('sets up express server', async () => {
      const httpServer = testingModule.container.get<HttpServer>(HttpServer);
      const testRouter = testingModule.container.get<TestRouter>(TestRouter);
      httpServer.addRouter('/', testRouter);
      const result = await httpServer.start();
      expect(httpServer.app).toBeTruthy();
      expect(result).toEqual('Listening to 8000 port');
      await httpServer.stop();
    });
  });

  describe('addRouter()', () => {
    it('exists', () => {
      const httpServer = testingModule.container.get<HttpServer>(HttpServer);
      expect(httpServer.addRouter).toBeTruthy();
    });
  });
});
