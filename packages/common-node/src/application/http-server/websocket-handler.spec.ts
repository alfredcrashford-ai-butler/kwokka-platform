import { injectable, injectFromBase } from 'inversify';
import { WebsocketHandler } from './websocket-handler';
import { TestingModule } from '../../framework/module';
import { ConfigService, LoggerService } from '../service';
import { LoggerServiceMock } from '../../../test/__mocks__';

@injectable()
@injectFromBase()
class TestWebsocketHandler extends WebsocketHandler {
  protected handleMessage = jest.fn();
  protected onConnected = jest.fn();
  protected onDisconnected = jest.fn();
  public addClient(client: any) {
    this.clients.push(client);
  }
}

describe(WebsocketHandler, () => {
  let testingModule: TestingModule;

  beforeEach(() => {
    jest.spyOn(ConfigService.prototype, 'get').mockReturnValue('http://api.kwokka.co');
    testingModule = TestingModule.setup([
      TestWebsocketHandler,
      { identifier: LoggerService, implementer: LoggerServiceMock },
      ConfigService,
    ]);
  });

  afterEach(() => jest.restoreAllMocks());

  it('exists', () => {
    expect(WebsocketHandler).toBeTruthy();
  });

  describe('connect()', () => {
    it('exists', () => {
      const handler = testingModule.container.get<TestWebsocketHandler>(TestWebsocketHandler);
      expect(handler.connect).toBeTruthy();
    });

    it('sets up ws connection', () => {
      const handler = testingModule.container.get<TestWebsocketHandler>(TestWebsocketHandler);
      const request: any = { url: 'http://api.kwokka.co/zebra/game-instances?sessionId=1&groupId=2' };
      const socket: any = {};
      const head: any = {};
      const authInfo: any = {};
      const handleUpgrade = jest.fn();
      const handleUpgradeSpy = jest.spyOn(handler['wss'], 'handleUpgrade').mockImplementation(handleUpgrade);
      const emit = jest.fn();
      const emitSpy = jest.spyOn(handler['wss'], 'emit').mockImplementation(emit);

      handler.connect(request, socket, head, authInfo);
      const upgradeCallback = handleUpgrade.mock.calls[0][3];
      upgradeCallback({ close: jest.fn(), on: jest.fn() });

      expect(emitSpy).toHaveBeenCalled();
      expect(handleUpgradeSpy).toHaveBeenCalled();
    });
  });

  describe('clients', () => {
    it('returns list of clients', () => {
      const handler = testingModule.container.get<TestWebsocketHandler>(TestWebsocketHandler);
      const clients = [{ account: { id: 'A' } }, { account: { id: 'B' } }, {}];
      handler.addClient(clients[0]);
      handler.addClient(clients[1]);
      handler.addClient(clients[2]);
      expect(handler.clients).toEqual(clients);
    });
  });

  describe('broadcastByClientId()', () => {
    it('exists', () => {
      const handler = testingModule.container.get<TestWebsocketHandler>(TestWebsocketHandler);
      expect(handler.broadcastByClientId).toBeTruthy();
    });
  });

  describe('broadcastByClient()', () => {
    it('exists', () => {
      const handler = testingModule.container.get<TestWebsocketHandler>(TestWebsocketHandler);
      expect(handler.broadcastByClient).toBeTruthy();
    });
  });

  describe('broadcastByAccountsIds()', () => {
    it('exists', () => {
      const handler = testingModule.container.get<TestWebsocketHandler>(TestWebsocketHandler);
      expect(handler.broadcastByAccountsIds).toBeTruthy();
    });
  });

  describe('broadcastBySessionId()', () => {
    it('exists', () => {
      const handler = testingModule.container.get<TestWebsocketHandler>(TestWebsocketHandler);
      expect(handler.broadcastBySessionId).toBeTruthy();
    });
  });
});
