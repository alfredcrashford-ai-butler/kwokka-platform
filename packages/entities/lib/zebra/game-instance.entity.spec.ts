import { GameInstanceEntity, GameInstanceEntityStatus } from './game-instance.entity';

describe(GameInstanceEntity, () => {
  let gameInstance: GameInstanceEntity;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    gameInstance = new GameInstanceEntity({
      gameId: '123',
      lobbyId: '123',
      lobbySettings: {},
      status: GameInstanceEntityStatus.Initial,
      state: { publicState: {}, playerState: {}, privateState: {} },
      playerIds: [],
    });
  });

  it('exists', () => {
    expect(GameInstanceEntity).toBeTruthy();
  });

  it('works', () => {
    expect(gameInstance).toBeTruthy();
  });

  it('sets up default values when falsy values are provided', () => {
    gameInstance = new GameInstanceEntity({
      gameId: '123',
      lobbyId: '123',
      lobbySettings: undefined as any,
      status: undefined as any,
      state: undefined as any,
      playerIds: undefined as any,
    });

    expect(gameInstance.status).toEqual(GameInstanceEntityStatus.Initial);
    expect(gameInstance.lobbySettings).toEqual({});
    expect(gameInstance.state).toEqual({ publicState: {}, privateState: {}, playerState: {} });
    expect(gameInstance.playerIds).toEqual([]);
  });

  describe('addPlayer()', () => {
    it('exists', () => {
      expect(gameInstance.addPlayer).toBeInstanceOf(Function);
    });

    it('adds player to playerIds and sets up player state', () => {
      gameInstance.addPlayer('1', { isHost: true });

      expect(gameInstance.playerIds).toContain('1');
      expect(gameInstance.state.playerState['1']).toEqual({ isHost: true });
    });
  });

  describe('removePlayer()', () => {
    it('exists', () => {
      expect(gameInstance.removePlayer).toBeInstanceOf(Function);
    });

    it('removes player from playerIds and player state', () => {
      gameInstance.playerIds = ['1', '2', '3'];
      gameInstance.state.playerState = { ['1']: { isHost: false }, ['2']: { isHost: true }, ['3']: { isHost: false } };

      gameInstance.removePlayer('2');

      expect(gameInstance.playerIds).not.toContain('2');
      expect(gameInstance.state.playerState['2']).toEqual(undefined);
    });
  });
});
