<template>
  <div style="display: none;">
    <div :id="elementId"></div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';
  import { injectScript } from '@/utils/inject';
  import { CaptchaError } from '@/errors/captcha.error';

  const H_CAPTCHA_JS = 'https://js.hcaptcha.com/1/api.js';
  const H_CAPTCHA_JS_ID = 'kwokka-h-captcha-script';
  const H_CAPTCHA_ELEMENT_ID = 'kwokka-h-captcha-element';

  @Component
  export default class Captcha extends Vue {
    @Prop({ required: true })
    public hcaptchakey: string;

    public readonly elementId = H_CAPTCHA_ELEMENT_ID;

    private captchaId: string;

    private readyPromise: Promise<void>;

    private onInitSuccessFn: () => any;

    private onInitFailureFn: () => any;

    private get captcha(): any {
      return (window as any).hcaptcha;
    }

    public created(): void {
      this.readyPromise = new Promise((resolve, reject) => {
        this.onInitSuccessFn = resolve;
        this.onInitFailureFn = reject;
      });
    }

    public async mounted() {
      try {
        await this.initJs();
        this.renderCaptcha();
        this.onInitSuccessFn();
      } catch (error) {
        this.onInitFailureFn();
      }
    }

    public async execute(): Promise<string> {
      try {
        await this.readyPromise;
        const { response } = await this.captcha.execute(this.captchaId, { async: true });
        return response;
      } catch (error: any) {
        throw new CaptchaError(error);
      }
    }

    private renderCaptcha() {
      this.captchaId = this.captcha.render(this.elementId, { sitekey: this.hcaptchakey, size: 'invisible' });
    }

    private async initJs() {
      const existingElement = document.getElementById(H_CAPTCHA_JS_ID);
      if (!existingElement) {
        await injectScript(H_CAPTCHA_JS, H_CAPTCHA_JS_ID);
      }
    }
  }
</script>
