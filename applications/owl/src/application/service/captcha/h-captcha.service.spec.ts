import { ConfigService, HttpService, LoggerService, TestingModule } from '@kwokka/common-node';
import { HCaptchaService } from './h-captcha.service';
import { HttpMockService } from '../../../../test/mocks/http-mock.service';
import { LoggerServiceMock } from '../../../../test/mocks/logger.service';

describe(HCaptchaService, () => {
  let service: HCaptchaService;
  let testingModule: TestingModule;

  beforeEach(() => {
    testingModule = TestingModule.setup([
      { identifier: HttpService, implementer: HttpMockService },
      ConfigService,
      { identifier: LoggerService, implementer: LoggerServiceMock },
      HCaptchaService,
    ]);
    const configService = testingModule.container.get<ConfigService>(ConfigService);
    jest.spyOn(configService, 'get').mockReturnValue('secret');
    service = testingModule.container.get(HCaptchaService);
  });

  it('exists', () => {
    expect(service).toBeTruthy();
  });

  describe('verify()', () => {
    it('exists', () => {
      expect(service.verify).toBeTruthy();
    });

    it('returns true if hcaptcha verifies the captcha', async () => {
      const httpService = testingModule.container.get<HttpService>(HttpService);
      jest.spyOn(httpService, 'post').mockResolvedValue({ success: true });
      expect(await service.verify('captcha')).toEqual(true);
    });

    it('returns false if hcaptcha fails to verify the captcha', async () => {
      const httpService = testingModule.container.get<HttpService>(HttpService);
      jest.spyOn(httpService, 'post').mockResolvedValue({ success: false });
      expect(await service.verify('captcha')).toEqual(false);
    });

    it('returns false if request to hcaptcha fails with error', async () => {
      const httpService = testingModule.container.get<HttpService>(HttpService);
      jest.spyOn(httpService, 'post').mockRejectedValue('error');
      expect(await service.verify('captcha')).toEqual(false);
    });
  });
});
