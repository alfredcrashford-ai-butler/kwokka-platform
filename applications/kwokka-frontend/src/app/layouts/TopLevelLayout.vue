<template>
  <div class="top-level-layout">
    <UiHeader>
      <div class="top-level-layout__header-container">
        <router-link to="/">
          <UiLogo class="top-level-layout__logo" size="sm" mobileSize="xs" />
        </router-link>

        <button class="top-level-layout__avatar" :ref="(el) => (userMenuButton = el)">
          <KwokkaAvatar
            :styles="{
              avatar: {
                fontFamily: 'inherit',
              },
            }"
            :endpoint="configService.frontendConfig.avatarGateway"
            :accountId="accessService.accountId"
            :accessToken="accessService.getAccessToken()"
          />
        </button>

        <UiMenu class="top-level-layout__user-menu" side="top" :triggerElement="userMenuButton">
          <router-link to="/settings" class="ui-link-reset">
            <UiButton class="top-level-layout__user-item" type="transparent" shape="sharp" tabindex="-1">
              <UiIcon name="settings" />
              {{ $t('general.settings') }}
            </UiButton>
          </router-link>
          <SignOutButton class="top-level-layout__user-item" type="transparent" shape="sharp" />
        </UiMenu>
      </div>
    </UiHeader>

    <main class="top-level-layout__main">
      <slot></slot>
    </main>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-facing-decorator';
  import { KwokkaAvatar } from '@kwokka/avatar-vue';
  import { LazyInject } from '@/ioc';
  import UiHeader from '@/app/ui-kit/UiHeader.vue';
  import UiButton from '@/app/ui-kit/UiButton.vue';
  import UiMenu from '@/app/ui-kit/UiMenu.vue';
  import UiIcon from '@/app/ui-kit/UiIcon.vue';
  import UiLogo from '@/app/ui-kit/UiLogo.vue';
  import SignOutButton from '@/app/components/SignOutButton.vue';
  import { AccessService } from '@/service/access/access.service';
  import { ConfigService } from '@/service/config/config.service';

  @Component({
    components: {
      UiHeader,
      UiButton,
      UiMenu,
      UiIcon,
      UiLogo,
      SignOutButton,
      KwokkaAvatar,
    },
  })
  export default class TopLevelLayout extends Vue {
    public userMenuButton: any = null;

    @LazyInject(ConfigService)
    public configService: ConfigService;

    @LazyInject(AccessService)
    public accessService: AccessService;
  }
</script>

<style scoped lang="scss">
  .top-level-layout {
    display: flex;
    flex-direction: column;
    min-height: 100%;
    @include UiBackgroundPattern();

    &__main {
      @include UiLayout();
      @include UiMargin(15, top);
      @include UiMargin(15, bottom);

      display: flex;
      flex-direction: column;
    }

    &__avatar {
      $height: $grid-step * 11;
      height: $height;
      width: $height * 3;

      cursor: pointer;
      background: none;

      @include UiTheme() {
        color: UiColor(shade-100);
      }

      &:hover,
      &:focus-visible {
        filter: brightness(1.1);
      }

      &:active {
        filter: brightness(1.25);
      }
    }

    &__user-menu {
      @include UiPadding(3, top);
      @include UiPadding(3, bottom);
      display: flex;
      flex-direction: column;
    }

    &__user-item {
      justify-content: flex-start;
      width: 100%;
      white-space: nowrap;
      @include UiMediaTablet() {
        max-width: $grid-step * 80;
      }
    }

    &__header-container {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
</style>
