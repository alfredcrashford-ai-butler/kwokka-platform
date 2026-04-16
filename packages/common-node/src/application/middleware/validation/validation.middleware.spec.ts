import { LoggerService } from '../../service';
import { ValidationConfig } from './validation-config';
import { ValidationMiddleware } from './validation.middleware';

describe('ValidationMiddleware', () => {
  let loggerMock: LoggerService;

  beforeEach(() => {
    loggerMock = { info: jest.fn(), error: jest.fn(), warn: jest.fn(), debug: jest.fn(), withPrefix: jest.fn() };
  });

  it('exists', () => {
    expect(ValidationMiddleware).toBeTruthy();
  });

  it('can be created', () => {
    expect(new ValidationMiddleware(loggerMock, new ValidationConfig({}))).toBeTruthy();
  });

  describe('perform()', () => {
    it('exists', () => {
      expect(new ValidationMiddleware(loggerMock, new ValidationConfig({})).perform).toBeTruthy();
    });
  });
});
