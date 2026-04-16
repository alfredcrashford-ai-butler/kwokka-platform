import { Request } from 'express';
import { inject, injectable, injectFromBase } from 'inversify';
import { ApiResult, Router, ValidationMiddleware } from '@kwokka/common-node';
import { OnboardingV1Controller, SignInResponse, SignUpResponse } from './onboarding-v1.controller';
import { OnboardingV1ViewModel } from './onboarding-v1.view-model';
import { CaptchaMiddleware } from '../../../middleware';

@injectable()
@injectFromBase()
export class OnboardingV1Router extends Router {
  public constructor(
    @inject(OnboardingV1Controller) private controller: OnboardingV1Controller,
    @inject(CaptchaMiddleware) private captchaMiddleware: CaptchaMiddleware,
    @inject(ValidationMiddleware) private validation: ValidationMiddleware,
  ) {
    super();
    this.post(
      '/sign-up/anon',
      [this.validation.withViewModel(OnboardingV1ViewModel.SignUpAnon)],
      this.signUpAnon,
    );
    this.post(
      '/sign-up/email',
      [this.captchaMiddleware, this.validation.withViewModel(OnboardingV1ViewModel.SignUpEmail)],
      this.signUpEmail,
    );
    this.post(
      '/sign-up/google-oauth2',
      [this.captchaMiddleware, this.validation.withViewModel(OnboardingV1ViewModel.SignUpOauth2)],
      this.signUpGoogleOauth2,
    );
    this.post(
      '/sign-up/discord-oauth2',
      [this.captchaMiddleware, this.validation.withViewModel(OnboardingV1ViewModel.SignUpOauth2)],
      this.signUpDiscordOauth2,
    );
    this.post('/sign-in/anon', [this.validation.withViewModel(OnboardingV1ViewModel.SignInAnon)], this.signInAnon);
    this.post('/sign-in/email', [this.validation.withViewModel(OnboardingV1ViewModel.SignInEmail)], this.signInEmail);
    this.post(
      '/sign-in/secret',
      [this.validation.withViewModel(OnboardingV1ViewModel.SignInSecret)],
      this.signInSecret,
    );
    this.post(
      '/sign-in/google-oauth2',
      [this.validation.withViewModel(OnboardingV1ViewModel.SignInOauth2)],
      this.signInGoogleOauth2,
    );
    this.post(
      '/sign-in/discord-oauth2',
      [this.validation.withViewModel(OnboardingV1ViewModel.SignInOauth2)],
      this.signInDiscordOauth2,
    );
    this.post(
      '/restore/email',
      [this.captchaMiddleware, this.validation.withViewModel(OnboardingV1ViewModel.RestoreEmailCredential)],
      this.restoreEmailCredential,
    );
    this.post(
      '/complete-restore/email',
      [this.validation.withViewModel(OnboardingV1ViewModel.CompleteRestoreEmailCredential)],
      this.completeRestoreEmailCredential,
    );
  }

  public signUpAnon = async (): Promise<ApiResult<SignUpResponse>> => {
    return this.controller.signUpAnon();
  };

  public signUpEmail = async (req: Request): Promise<ApiResult<SignUpResponse>> => {
    return this.controller.signUpEmail(req);
  };

  public signUpGoogleOauth2 = async (req: Request): Promise<ApiResult<SignUpResponse>> => {
    return this.controller.signUpGoogleOauth2(req);
  };

  public signUpDiscordOauth2 = async (req: Request): Promise<ApiResult<SignUpResponse>> => {
    return this.controller.signUpDiscordOauth2(req);
  };

  public signInAnon = async (req: Request): Promise<ApiResult<SignInResponse>> => {
    return this.controller.signInAnon(req);
  };

  public signInSecret = async (req: Request): Promise<ApiResult<SignInResponse>> => {
    return this.controller.signInSecret(req);
  };

  public signInEmail = async (req: Request): Promise<ApiResult<SignInResponse>> => {
    return this.controller.signInEmail(req);
  };

  public signInGoogleOauth2 = async (req: Request): Promise<ApiResult<SignInResponse>> => {
    return this.controller.signInGoogleOauth2(req);
  };

  public signInDiscordOauth2 = async (req: Request): Promise<ApiResult<SignInResponse>> => {
    return this.controller.signInDiscordOauth2(req);
  };

  public restoreEmailCredential = async (req: Request): Promise<ApiResult<void>> => {
    return this.controller.restoreEmail(req);
  };

  public completeRestoreEmailCredential = async (req: Request): Promise<ApiResult<SignUpResponse>> => {
    return this.controller.completeRestoreEmail(req);
  };
}
