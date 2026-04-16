import { AuthAPI } from '../auth';
import { GameAPI } from '../game';
import { KwokkaSdkNodeConfig } from '../config';
import { GameServerAPI } from './game-server-api';

describe(GameServerAPI, () => {
  let authMock: AuthAPI;
  let gameMock: GameAPI;
  let sdkConfig: KwokkaSdkNodeConfig;
  let client: GameServerAPI;

  beforeEach(() => {
    authMock = {} as any;
    gameMock = {} as any;
    sdkConfig = {
      clientId: 'clientId',
      secret: 'secret',
      endpoint: 'https://example.com',
      logger: {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
        debug: jest.fn(),
      },
    };
    client = new GameServerAPI(sdkConfig, authMock, gameMock);
  });

  it('exists', () => {
    expect(GameServerAPI).toBeTruthy();
  });

  it('can be created', () => {
    expect(client).toBeTruthy();
  });

  describe('setupGameServer()', () => {
    it('exists', () => {
      expect(client.setupGameServer).toBeTruthy();
    });
  });

  // TODO: add tests https://mygameapp.atlassian.net/browse/KWOKKA-395
});
