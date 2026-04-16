<template>
  <div
    class="ui-menu"
    ref="menu"
    :class="{
      'ui-menu_has-card-bg': !isTransparent,
      'ui-menu_is-active': isActive,
      'ui-menu_side-bottom': side === 'bottom',
      'ui-menu_side-top': side === 'top',
    }"
    :style="{ left: offsetXStyle, top: offsetYStyle }"
  >
    <slot />
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Watch, Emit, Vue } from 'vue-facing-decorator';

  export type UiMenuStickSide = 'center' | 'top' | 'bottom';

  const SCALE_FACTOR = 0.8;

  @Component
  export default class UiMenu extends Vue {
    @Prop({ default: true })
    public isCloseOnScroll: boolean;

    @Prop({ default: false })
    public isTransparent: boolean;

    @Prop()
    public triggerElement: Element;

    @Prop({ default: 'center' })
    public side: UiMenuStickSide;

    @Prop({ default: false })
    public isOutside: boolean;

    @Prop({ default: true })
    public isReactingToTrigger: boolean;

    public isActive: boolean = false;

    private offsetX: number = 50;

    private offsetY: number = 50;

    private triggerElementClickListener: any;

    public get offsetYStyle(): string {
      return `${this.offsetY}%`;
    }

    public get offsetXStyle(): string {
      return `${this.offsetX}%`;
    }

    public close() {
      this.isActive = false;
    }

    public show() {
      this.isActive = true;
    }

    private scrollListener() {
      if (this.isActive) {
        if (this.isCloseOnScroll) {
          this.isActive = false;
        } else {
          this.calculateOffset();
        }
      }
    }

    private windowResizeListener() {
      if (this.isActive) {
        this.calculateOffset();
      }
    }

    private outerClickListener(event: MouseEvent): void {
      if (!this.isReactingToTrigger) {
        return;
      }

      const menuElement = this.$refs.menu as Element;
      const target = event.target as Element;
      const targetIsActivator = this.triggerElement === target;
      const targetIsActivatorChild = this.triggerElement.contains(target);
      if (!menuElement.contains(target) && !targetIsActivator && !targetIsActivatorChild) {
        this.isActive = false;
      }
    }

    public created() {
      // must use hook so that the function references to proxy when calls `this`
      this.triggerElementClickListener = () => {
        if (!this.isReactingToTrigger) {
          return;
        }
        this.isActive = !this.isActive;
      };
    }

    public mounted() {
      if (this.triggerElement) {
        this.triggerElement.addEventListener('click', this.triggerElementClickListener);
      }

      window.addEventListener('resize', this.windowResizeListener);
      document.addEventListener('scroll', this.scrollListener);
      document.addEventListener('click', this.outerClickListener);
    }

    public beforeUnmount() {
      if (this.triggerElement) {
        this.triggerElement.removeEventListener('click', this.triggerElementClickListener);
      }

      window.removeEventListener('resize', this.windowResizeListener);
      document.removeEventListener('scroll', this.scrollListener);
      document.removeEventListener('click', this.outerClickListener);
    }

    @Watch('isActive')
    public watchIsActiveChange(value: boolean) {
      if (value) {
        this.calculateOffset();
      }

      this.onOpen(value);
    }

    @Emit('open')
    public onOpen(value: boolean): boolean {
      return value;
    }

    @Watch('triggerElement')
    public onTriggerElementChange(newValue: Element, oldValue: Element): void {
      if (newValue) {
        newValue.addEventListener('click', this.triggerElementClickListener);
      }
      if (oldValue) {
        oldValue.removeEventListener('click', this.triggerElementClickListener);
      }
    }

    /**
     * Returns point of center of trigger element.
     * @method getTriggerCenter
     * @return {{x: number, y: number}}
     * @private
     */
    private getTriggerCenter(): { x: number; y: number } {
      const triggerRect = this.triggerElement.getBoundingClientRect();

      const x = triggerRect.left + triggerRect.width / 2;
      let y = triggerRect.top + triggerRect.height / 2;

      if (this.side === 'top') {
        y = triggerRect.top;
      } else if (this.side === 'bottom') {
        y = triggerRect.bottom;
      }

      return { x, y };
    }

    /**
     * @method calculateOffset
     * @param {number} scaleFactor
     * @private
     */
    private calculateOffset() {
      const triggerCenter = this.getTriggerCenter();
      const { width, height } = (this.$refs.menu as Element).getBoundingClientRect();

      // when menu is hidden, it has transform: scale(scaleFactor) so when we calculate the height
      // and width we need to divide the given height width from bounding client rect by scaleFactor
      // in order to obtain the sizes of the menu in opened state
      const scaledWidth = width / SCALE_FACTOR;
      const scaledHeight = height / SCALE_FACTOR;

      const { clientWidth, clientHeight } = document.documentElement;

      const xPosition = triggerCenter.x;
      let yPosition = triggerCenter.y;

      if (!this.isOutside) {
        if (this.side === 'top') {
          yPosition = triggerCenter.y + scaledHeight / 2;
        } else if (this.side === 'bottom') {
          yPosition = triggerCenter.y - scaledHeight / 2;
        }
      }

      const { x, y } = UiMenu.clampAll(xPosition, yPosition, scaledWidth, scaledHeight, clientWidth, clientHeight);

      this.setOffset(x, y, clientWidth, clientHeight);
    }

    /**
     * Sets `offsetX` and `offsetY` values as a percent.
     * @method setOffset
     * @param {number} x
     * @param {number} y
     * @param {number} clientWidth
     * @param {number} clientHeight
     * @private
     */
    private setOffset(x: number, y: number, clientWidth: number, clientHeight: number) {
      this.offsetX = (x / clientWidth) * 100;
      this.offsetY = (y / clientHeight) * 100;
    }

    /**
     * Uses `clamp` method to both given dimensions.
     * @method clampAll
     * @param {number} posX
     * @param {number} posY
     * @param {number} width
     * @param {number} height
     * @param {number} screenWidth
     * @param {number} screenHeight
     * @return {{x: number, y: number}}
     * @private
     */
    private static clampAll(
      posX: number,
      posY: number,
      width: number,
      height: number,
      screenWidth: number,
      screenHeight: number,
    ): { x: number; y: number } {
      const x = UiMenu.clamp(posX, width, screenWidth);
      const y = UiMenu.clamp(posY, height, screenHeight);

      return { x, y };
    }

    /**
     * Clamps size value in the way that `position` (+/-) `size/2` more than zero.
     * @method clamp
     * @param {number} position
     * @param {number} size
     * @param {number} max
     * @return {number}
     * @private
     */
    private static clamp(position: number, size: number, max: number): number {
      let x: number;
      if (position - size / 2 < 0) {
        x = size / 2;
      } else if (position + size / 2 > max) {
        x = max - size / 2;
      } else {
        x = position;
      }
      return x;
    }
  }
</script>

<style scoped lang="scss">
  $anim-time: 100ms;
  $transform-transition: transform UiTransition(bounce) $anim-time;

  .ui-menu {
    @include UiBorderRadius(lg);
    @include UiShadow(1);
    position: fixed;
    left: 50%;
    right: 50%;
    z-index: -1;
    pointer-events: none;

    width: fit-content;
    max-width: 100vw;

    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0;

    @include UiTheme() {
      background-color: UiColor(shade-700);
      border: 2px solid UiColor(shade-100);
    }

    &_side-bottom {
      transform-origin: bottom;
    }

    &_side-top {
      transform-origin: top;
    }

    &_is-active {
      z-index: 100;
      opacity: 1;

      transform: translate(-50%, -50%) scale(1);
      pointer-events: auto;

      transition:
        $transform-transition,
        opacity linear $anim-time;
    }
  }
</style>
