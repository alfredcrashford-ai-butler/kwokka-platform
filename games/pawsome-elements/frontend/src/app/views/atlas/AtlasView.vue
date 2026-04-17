<template>
  <MenuLayout class="atlas-view">
    <div class="atlas-view__container">
      <div class="atlas-view__navigation">
        <UiCircleButton
          class="atlas-view__back-button ui-hide_portrait"
          icon="arrow-left"
          @click="$router.replace({ name: routeName.Main })"
        />
        <AtlasNavigationItem
          class="atlas-view__navigation-item"
          :class="{ 'atlas-view__navigation-item_active': $route.name === routeName.Equipment }"
          imageUrl="/static/atlas/nav_equipment.webp"
          :caption="$t('atlas.equipment.title')"
          @click="$router.replace({ name: routeName.Equipment })"
        />
        <AtlasNavigationItem
          class="atlas-view__navigation-item"
          :class="{ 'atlas-view__navigation-item_active': $route.name === routeName.SkillTree }"
          imageUrl="/static/atlas/nav_skill_tree.webp"
          :caption="$t('atlas.skillTree.title')"
          @click="$router.replace({ name: routeName.SkillTree })"
        />
        <AtlasNavigationItem
          class="atlas-view__navigation-item"
          :class="{ 'atlas-view__navigation-item_active': $route.name === routeName.EssenceMultipliers }"
          imageUrl="/static/atlas/nav_essence_multipliers.webp"
          :caption="$t('atlas.essenceMultipliers.title')"
          @click="$router.replace({ name: routeName.EssenceMultipliers })"
        />
        <AtlasNavigationItem
          class="atlas-view__navigation-item"
          :class="{ 'atlas-view__navigation-item_active': $route.name === routeName.Journey }"
          imageUrl="/static/atlas/nav_journey.webp"
          :caption="$t('atlas.journey.title')"
          @click="$router.replace({ name: routeName.Journey })"
        />
        <!-- <AtlasNavigationItem
          class="atlas-view__navigation-item"
          :class="{ 'atlas-view__navigation-item_active': $route.name === routeName.Treasury }"
          imageUrl="/static/atlas/nav_crypt.webp"
          :caption="$t('atlas.crypt.title')"
          @click="$router.replace({ name: routeName.Treasury })"
        /> -->
      </div>
      <TitleCard :heading="$t('atlas.heading')" :isBackButtonShown="false" class="atlas-view__main">
        <UiCircleButton
          class="atlas-view__back-button ui-hide_landscape"
          icon="arrow-left"
          @click="$router.replace({ name: routeName.Main })"
        />
        <div class="atlas-view__content">
          <router-view v-slot="{ Component }">
            <FadeTransition>
              <component :is="Component" />
            </FadeTransition>
          </router-view>
        </div>
      </TitleCard>
    </div>
  </MenuLayout>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-facing-decorator';
  import MenuLayout from '@/app/components/MenuLayout.vue';
  import TitleCard from '@/app/components/TitleCard.vue';
  import { UiCircleButton } from '@/app/ui-kit';
  import AtlasNavigationItem from './components/AtlasNavigationItem.vue';
  import FadeTransition from '@/app/transitions/FadeTransition.vue';
  import { RouteName } from '@/app/route-name';

  @Component({
    components: {
      MenuLayout,
      AtlasNavigationItem,
      TitleCard,
      UiCircleButton,
      FadeTransition,
    },
  })
  export default class AtlasView extends Vue {
    public routeName = RouteName;
  }
</script>

<style lang="scss">
  .atlas-view {
    &.v-enter-active {
      transition-duration: 600ms;

      .atlas-view__navigation {
        animation-name: UiAnimationFadeIn, UiAnimationSlideInLeft;
        animation-timing-function: linear, ease-out;
        animation-duration: 400ms;
      }

      .atlas-view__main {
        animation-name: UiAnimationFadeIn, UiAnimationSlideInRight;
        animation-timing-function: linear, ease-out;
        animation-duration: 400ms;
        animation-delay: 200ms;
      }
    }

    &.v-leave-active {
      transition-duration: 500ms;

      .atlas-view__navigation {
        animation-name: UiAnimationFadeOut, UiAnimationSlideOutLeft;
        animation-timing-function: linear, ease-out;
        animation-duration: 500ms;
      }

      .atlas-view__main {
        animation-name: UiAnimationFadeOut, UiAnimationSlideOutRight;
        animation-timing-function: linear, ease-out;
        animation-duration: 500ms;
      }
    }
  }
</style>

<style scoped lang="scss">
  .atlas-view {
    &__container {
      display: flex;
      height: 100%;
      width: 100%;
      @include UiGap(2);

      @include UiMediaPortrait() {
        flex-direction: column-reverse;
      }
    }

    &__navigation {
      position: relative;
      flex-shrink: 0;
      height: calc(100% - UiSpacing(10));
      align-self: flex-end;
      width: UiSpacing(32);
      display: grid;
      grid-template-columns: 100%;
      grid-template-rows: repeat(4, minmax(0, 1fr));
      background: UiColor(secondary-900) linear-gradient(UiColor(shade-900, 0.4), UiColor(shade-900, 0.8));
      @include UiBorderRadius(2);
      @include UiPadding(4);
      @include UiGap(2);
      @include UiDropShadow(3);
      animation-fill-mode: both;

      @include UiMediaPortrait() {
        height: UiSpacing(32);
        width: 100%;
        flex-direction: row;
        grid-template-rows: 100%;
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }

      &::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 1;
        pointer-events: none;
        border-style: solid;
        border-image-source: url('/static/ui/frame_2.webp');
        border-image-slice: 60;
        border-width: UiSpacing(4);
      }
    }

    &__navigation-item {
      width: 100%;
      transition: transform ease 100ms;

      &_active {
        filter: brightness(1.2) !important;
        transform: scale(1.05);
      }

      @include UiMediaPortrait() {
        height: 100%;
        width: auto;
      }
    }

    &__back-button {
      position: absolute;
      top: 0;
      left: 0;
      transform: translate(-25%, -25%);
      z-index: 1000;
    }

    &__main {
      flex-grow: 1;
      animation-fill-mode: both;
    }

    &__content {
      background: UiColor(shade-900);
      height: 100%;
    }
  }
</style>
