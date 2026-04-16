import { GameEntity } from './game.entity';

describe(GameEntity, () => {
  let game: GameEntity;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    game = new GameEntity({ key: 'key', applicationAccountId: '123' });
  });

  it('exists', () => {
    expect(GameEntity).toBeTruthy();
  });

  it('works', () => {
    expect(game).toBeTruthy();
  });

  describe('isAvailable()', () => {
    it('exists', () => {
      expect(game.isAvailable).toBeInstanceOf(Function);
    });

    it('returns true for any date if date boundaries are not set', () => {
      const spy = jest.spyOn(Date, 'now').mockReturnValue(0);
      expect(game.isAvailable()).toEqual(true);

      spy.mockReturnValue(999999999999999);
      expect(game.isAvailable()).toEqual(true);

      spy.mockReturnValue(Infinity);
      expect(game.isAvailable()).toEqual(true);
    });

    it('returns true for date after lower date boundary', () => {
      const now = Date.now();
      game.availableSince = new Date(now);
      jest.spyOn(Date, 'now').mockReturnValue(now + 10000);

      expect(game.isAvailable()).toEqual(true);
    });

    it('returns false for date after lower date boundary', () => {
      const now = Date.now();
      game.availableSince = new Date(now);
      jest.spyOn(Date, 'now').mockReturnValue(now - 10000);

      expect(game.isAvailable()).toEqual(false);
    });

    it('returns true for date before lower date boundary', () => {
      const now = Date.now();
      game.availableTill = new Date(now);
      jest.spyOn(Date, 'now').mockReturnValue(now - 10000);

      expect(game.isAvailable()).toEqual(true);
    });

    it('returns false for date after lower date boundary', () => {
      const now = Date.now();
      game.availableTill = new Date(now);
      jest.spyOn(Date, 'now').mockReturnValue(now + 10000);

      expect(game.isAvailable()).toEqual(false);
    });
  });


  describe('isAvailabilityRangeValid()', () => {
    it('returns true if availableSince is not provided', () => {
      game.availableSince = undefined;
      game.availableTill = new Date(10000000);

      expect(game.isAvailabilityRangeValid()).toEqual(true);
    });

    it('returns true if availableTill is not provided', () => {
      game.availableTill = undefined;
      game.availableSince = new Date(10000000);

      expect(game.isAvailabilityRangeValid()).toEqual(true);
    });

    it('returns true if availableSince is before availableTill', () => {
      game.availableSince = new Date(10000000);
      game.availableTill = new Date(20000000);

      expect(game.isAvailabilityRangeValid()).toEqual(true);
    });

    it('returns false if availableSince is after availableTill', () => {
      game.availableSince = new Date(30000000);
      game.availableTill = new Date(20000000);

      expect(game.isAvailabilityRangeValid()).toEqual(false);
    });
  });
});
