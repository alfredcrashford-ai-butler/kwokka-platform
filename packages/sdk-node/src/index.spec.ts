import { KwokkaSdkNodeClient, type GameServerConfig, type KwokkaSdkNodeConfig, type GameControllerHookParam, GameController } from './index';

describe('@kwokka/sdk-node', () => {
  it('all imports work', () => {
    expect(KwokkaSdkNodeClient).toBeTruthy();
    expect({} as GameServerConfig).toBeTruthy();
    expect({} as KwokkaSdkNodeConfig).toBeTruthy();
    expect({} as GameController).toBeTruthy();
    expect({} as GameControllerHookParam.PlayerAction).toBeTruthy();
    expect({} as GameControllerHookParam.PlayerConnected).toBeTruthy();
    expect({} as GameControllerHookParam.PlayerDisconnected).toBeTruthy();
  });
});
