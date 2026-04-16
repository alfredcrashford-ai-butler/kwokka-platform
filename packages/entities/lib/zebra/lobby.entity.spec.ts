import { LobbyEntity } from './lobby.entity';

describe(LobbyEntity, () => {
  let lobby: LobbyEntity;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    lobby = new LobbyEntity({ key: 'key', gameId: '123', minPlayers: 2, maxPlayers: 2, config: {} });
  });

  it('exists', () => {
    expect(LobbyEntity).toBeTruthy();
  });

  it('works', () => {
    expect(lobby).toBeTruthy();
  });

  describe('isAvailable()', () => {
    it('exists', () => {
      expect(lobby.isAvailable).toBeInstanceOf(Function);
    });

    it('returns true for any date if date boundaries are not set', () => {
      const spy = jest.spyOn(Date, 'now').mockReturnValue(0);
      expect(lobby.isAvailable()).toEqual(true);

      spy.mockReturnValue(999999999999999);
      expect(lobby.isAvailable()).toEqual(true);

      spy.mockReturnValue(Infinity);
      expect(lobby.isAvailable()).toEqual(true);
    });

    it('returns true for date after lower date boundary', () => {
      const now = Date.now();
      lobby.availableSince = new Date(now);
      jest.spyOn(Date, 'now').mockReturnValue(now + 10000);

      expect(lobby.isAvailable()).toEqual(true);
    });

    it('returns false for date after lower date boundary', () => {
      const now = Date.now();
      lobby.availableSince = new Date(now);
      jest.spyOn(Date, 'now').mockReturnValue(now - 10000);

      expect(lobby.isAvailable()).toEqual(false);
    });

    it('returns true for date before lower date boundary', () => {
      const now = Date.now();
      lobby.availableTill = new Date(now);
      jest.spyOn(Date, 'now').mockReturnValue(now - 10000);

      expect(lobby.isAvailable()).toEqual(true);
    });

    it('returns false for date after lower date boundary', () => {
      const now = Date.now();
      lobby.availableTill = new Date(now);
      jest.spyOn(Date, 'now').mockReturnValue(now + 10000);

      expect(lobby.isAvailable()).toEqual(false);
    });
  });

  describe('isAvailabilityRangeValid()', () => {
    it('returns true if availableSince is not provided', () => {
      lobby.availableSince = undefined;
      lobby.availableTill = new Date(10000000);

      expect(lobby.isAvailabilityRangeValid()).toEqual(true);
    });

    it('returns true if availableTill is not provided', () => {
      lobby.availableTill = undefined;
      lobby.availableSince = new Date(10000000);

      expect(lobby.isAvailabilityRangeValid()).toEqual(true);
    });

    it('returns true if availableSince is before availableTill', () => {
      lobby.availableSince = new Date(10000000);
      lobby.availableTill = new Date(20000000);

      expect(lobby.isAvailabilityRangeValid()).toEqual(true);
    });

    it('returns false if availableSince is after availableTill', () => {
      lobby.availableSince = new Date(30000000);
      lobby.availableTill = new Date(20000000);

      expect(lobby.isAvailabilityRangeValid()).toEqual(false);
    });
  });

  describe('isPlayerRangeValid()', () => {
    it('returns false if minPlayers is not provided', () => {
      lobby.minPlayers = undefined as any;
      lobby.maxPlayers = 2;

      expect(lobby.isPlayerRangeValid()).toEqual(false);
    });

    it('returns false if maxPlayers is not provided', () => {
      lobby.minPlayers = 2;
      lobby.maxPlayers = undefined as any;

      expect(lobby.isPlayerRangeValid()).toEqual(false);
    });

    it('returns false if minPlayers is more than maxPlayers', () => {
      lobby.minPlayers = 3;
      lobby.maxPlayers = 2;

      expect(lobby.isPlayerRangeValid()).toEqual(false);
    });

    it('returns true if minPlayers is less than maxPlayers', () => {
      lobby.minPlayers = 2;
      lobby.maxPlayers = 4;

      expect(lobby.isPlayerRangeValid()).toEqual(true);
    });
  });
});
