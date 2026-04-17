<template>
  <div
    class="cards-fan"
    ref="fan"
    :style="{
      '--cards-fan--hover-grow-factor': hoverGrowFactor,
      '--cards-fan--focus-grow-factor': focusGrowFactor,
      pointerEvents: isInterractable ? null : 'none',
    }"
    :data-fan-id="fanId"
    @contextmenu="$event.preventDefault()"
  >
    <div class="cards-fan__card-wrapper cards-fan__card-wrapper_invisible" v-if="data[0]" data-card-example>
      <div class="cards-fan__ref-h cards-fan__ref-h_start" ref="cardRefHStart"></div>
      <div class="cards-fan__ref-h cards-fan__ref-h_end" ref="cardRefHEnd"></div>
      <div class="cards-fan__ref-v cards-fan__ref-v_start" ref="cardRefVStart"></div>
      <div class="cards-fan__ref-v cards-fan__ref-v_end" ref="cardRefVEnd"></div>
      <component :is="cardComponent" :data="data[0]"></component>
    </div>
    <div class="cards-fan__ref-h cards-fan__ref-h_start" ref="fanRefHStart"></div>
    <div class="cards-fan__ref-h cards-fan__ref-h_end" ref="fanRefHEnd"></div>
    <div
      class="cards-fan__card-wrapper"
      v-for="(item, i) in data"
      :key="dataKey ? item[dataKey] : i"
      :class="{
        'cards-fan__card-wrapper_is-hovered': hoverableIndex === i,
        'cards-fan__card-wrapper_is-focused': focusedIndex === i,
      }"
      :style="{
        zIndex: draggableIndex === i || focusedIndex === i ? 1 : null,
        transform: `translate3d(0, 0, 0) translateX(${translateX[i]}px) translateY(${translateY[i]}px) rotateZ(${rotateZ[i]}deg)`,
      }"
      :data-card="dataKey ? item[dataKey] : i"
    >
      <div class="cards-fan__card-animation-wrapper">
        <div
          class="cards-fan__card-wrapper-draggable"
          :class="{ 'cards-fan__card-wrapper-draggable_is-dragged': draggableIndex === i }"
          :style="{
            transform:
              draggableIndex === i
                ? `translate3d(0, 0, 0)  rotateZ(${draggableRotateZ}deg) translateX(${draggableTranslateX}px) translateY(${draggableTranslateY}px) scale(${draggableGrowFactor})`
                : undefined,
          }"
          @pointerdown="onDragStart($event, i)"
          @pointerup="onCardPointerUp($event, i)"
        >
          <div
            class="cards-fan__card-wrapper-hoverable"
            @pointerenter="onPointerEnter(i)"
            @pointerleave="onPointerLeave(i)"
          >
            <component :is="cardComponent" :data="item"></component>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Ref, Vue, Watch } from 'vue-facing-decorator';
  import { FunctionUtil, StringUtil, UuidUtil } from '@kwokka/utils';
  import { LazyInject } from '@/ioc';
  import { DOMService } from '@/service';
  import { resizeObserver } from '@/util';

  const CLICK_DETECTION_MS = 200;
  const FOCUSED_SELECTOR = '.cards-fan__card-wrapper_is-focused';
  const FAN_SELECTOR = '.cards-fan[data-fan-id="{{fanId}}"]';

  @Component({
    emits: ['drop', 'dragstart', 'selectCard', 'focusCard', 'blurCard'],
  })
  export default class CardsFan<T = any> extends Vue {
    @Ref()
    public fan: HTMLDivElement;

    @Ref()
    public cardRefHStart: HTMLDivElement;

    @Ref()
    public cardRefHEnd: HTMLDivElement;

    @Ref()
    public cardRefVStart: HTMLDivElement;

    @Ref()
    public cardRefVEnd: HTMLDivElement;

    @Ref()
    public fanRefHStart: HTMLDivElement;

    @Ref()
    public fanRefHEnd: HTMLDivElement;

    @Prop({ default: 8 })
    public rotationFactor: number;

    @Prop({ default: -0.15 })
    public verticalOffsetFactor: number;

    @Prop({ default: 3 })
    public draggableGrowFactor: number;

    @Prop({ default: 2 })
    public focusGrowFactor: number;

    @Prop({ default: 2 })
    public hoverGrowFactor: number;

    @Prop({ default: 0.03 })
    public pushTranslateFactor: number;

    @Prop({ default: 3 })
    public pushRotateFactor: number;

    @Prop({ default: true })
    public isInterractable: boolean;

    @Prop({ default: true })
    public isDraggable: boolean;

    @Prop({ default: true })
    public isClickable: boolean;

    @Prop({ required: true })
    public cardComponent: typeof Vue;

    @Prop({ required: true })
    public data: T[];

    @Prop({ default: null })
    public dataKey: string;

    @LazyInject(DOMService)
    public domService: DOMService;

    public fanId: string;

    public hoverableIndex: number = null;
    public draggableIndex: number = null;
    public focusedIndex: number = null;
    public draggableTranslateX: number = null;
    public draggableTranslateY: number = null;
    public draggableRotateZ: number = null;
    public translateX: number[] = [];
    public translateY: number[] = [];
    public rotateZ: number[] = [];
    private cleanupResizeObserver: Function;
    private width: number;
    private cardWidth: number;
    private cardHeight: number;
    private pointerMoveListener = null;
    private pointerUpListener = null;
    private pointerDownOutsideListener = null;
    private possibleDragTimeout: number;

    @Watch('data.length', {})
    public onDataChange(): void {
      this.calculateTransforms();
    }

    @Watch('hoverableIndex')
    public onHoverableIndexChange(): void {
      this.calculateTransforms();
    }

    public created(): void {
      this.fanId = UuidUtil.generate();
    }

    public onPointerMove(event: PointerEvent): void {
      if (!this.isInterractable) {
        return;
      }

      if (this.draggableIndex === null) {
        return;
      }

      const selector = StringUtil.format(FAN_SELECTOR, { fanId: this.fanId });
      const fanRect = this.domService.getBoundingClientRect(selector);
      this.draggableTranslateX =
        event.clientX - this.translateX[this.draggableIndex] - this.cardWidth / 2 - fanRect.left;
      this.draggableTranslateY =
        event.clientY - this.translateY[this.draggableIndex] - this.cardHeight / 2 - fanRect.top;
    }

    public onDragEnd(event: DragEvent): void {
      if (!this.isInterractable || !this.isDraggable) {
        return;
      }

      if (this.draggableIndex !== null) {
        const x = event.clientX;
        const y = event.clientY;
        const item = this.data[this.draggableIndex];
        this.draggableIndex = null;
        this.hoverableIndex = null;
        this.$emit('drop', { x, y, item });
      }
    }

    public onPointerDownOutside(event: PointerEvent) {
      if (!this.isInterractable) {
        return;
      }

      const focusedElement = this.$el.querySelector(FOCUSED_SELECTOR);
      if (focusedElement && !focusedElement.contains(event.target)) {
        this.blurCard();
      }
    }

    public onDragStart(event: PointerEvent, index: number): void {
      if (!this.isInterractable) {
        return;
      }

      event.preventDefault();
      this.possibleDragTimeout = setTimeout(() => {
        clearTimeout(this.possibleDragTimeout);
        this.possibleDragTimeout = null;
        if (!this.isDraggable) {
          return;
        }
        this.draggableIndex = index;
        this.draggableTranslateX = 0;
        this.draggableTranslateY = 0;
        this.draggableRotateZ = -this.rotateZ[index];
        this.blurCard();
        this.$emit('dragstart', this.data[index]);
      }, CLICK_DETECTION_MS);
    }

    public onCardPointerUp(event: PointerEvent, index: number): void {
      if (!this.isInterractable) {
        return;
      }

      if (this.possibleDragTimeout) {
        clearTimeout(this.possibleDragTimeout);
        this.possibleDragTimeout = null;
        event.preventDefault();
        if (this.focusedIndex === index) {
          this.blurCard();
          this.$emit('selectCard', this.data[index]);
        } else {
          this.focusCard(index);
        }
      }
    }

    public onPointerEnter(index: number): void {
      this.hoverableIndex = index;
      if (this.hoverableIndex !== this.focusedIndex) {
        this.blurCard();
      }
    }

    public onPointerLeave(index: number): void {
      if (this.hoverableIndex === index) {
        this.hoverableIndex = null;
      }
      if (this.focusedIndex === index) {
        this.blurCard();
      }
    }

    public mounted(): void {
      this.cleanupResizeObserver = resizeObserver(this.fan, FunctionUtil.debounce(this.onResize.bind(this), 200));
      this.onResize();
      this.pointerMoveListener = this.onPointerMove.bind(this);
      document.addEventListener('pointermove', this.pointerMoveListener);
      this.pointerUpListener = this.onDragEnd.bind(this);
      document.addEventListener('pointerup', this.pointerUpListener);
      this.pointerDownOutsideListener = this.onPointerDownOutside.bind(this);
      document.addEventListener('pointerdown', this.pointerDownOutsideListener);
    }

    public beforeUnmount(): void {
      if (this.cleanupResizeObserver) {
        this.cleanupResizeObserver();
      }
      document.removeEventListener('pointermove', this.pointerMoveListener);
      document.removeEventListener('pointerup', this.pointerUpListener);
      document.removeEventListener('pointerdown', this.pointerDownOutsideListener);
    }

    public focusCard(index: number): void {
      this.focusedIndex = index;
      this.hoverableIndex = index;
      this.$emit('focusCard', this.data[index]);
    }

    public blurCard(): void {
      if (typeof this.focusedIndex === 'number') {
        this.focusedIndex = null;
        this.hoverableIndex = null;
        this.$emit('blurCard');
      }
    }

    private onResize(): void {
      this.width = this.calculateDistance(this.fanRefHStart, this.fanRefHEnd);
      const card = this.fan.querySelector('[data-card-example]');
      if (card) {
        this.cardWidth = this.calculateDistance(this.cardRefHStart, this.cardRefHEnd);
        this.cardHeight = this.calculateDistance(this.cardRefVStart, this.cardRefVEnd);
      }
      this.calculateTransforms();
    }

    private calculateDistance(ref1: HTMLDivElement, ref2: HTMLDivElement): number {
      const ref1Rect = ref1.getBoundingClientRect();
      const ref2Rect = ref2.getBoundingClientRect();
      const x1 = ref1Rect.x + ref1Rect.width / 2;
      const y1 = ref1Rect.y + ref1Rect.height / 2;
      const x2 = ref2Rect.x + ref2Rect.width / 2;
      const y2 = ref2Rect.y + ref2Rect.height / 2;
      const resX = x2 - x1;
      const resY = y2 - y1;
      return Math.sqrt(resX * resX + resY * resY);
    }

    private calculateTransforms(): void {
      if (!this.data.length) {
        this.translateX = [];
        return;
      }
      if (this.data.length * this.cardWidth > this.width) {
        this.calculateCompactTransforms();
      } else {
        this.calculateCenteredTransforms();
      }
    }

    private calculateCompactTransforms(): void {
      // calculate translateX
      const rightmostTranslate = this.width - this.cardWidth;
      const itemLastIndex = this.data.length - 1;
      this.translateX = this.data.map(
        (_, i) => (i / itemLastIndex) * rightmostTranslate + this.calculateHoverTranslation(this.hoverableIndex, i),
      );

      // calculcate tranlateY
      this.calculateTranslateY();

      // calculate rotation
      this.calculateRotateZ();
    }

    private calculateTranslateY(): void {
      if (this.data.length <= 1) {
        this.translateY = [0];
        return;
      }

      const itemLastIndex = this.data.length - 1;
      const itemCentralIndex = itemLastIndex / 2;
      const distanceFromCenter = (i) => Math.abs(itemCentralIndex - i);
      const verticalOffsetFactor = (this.verticalOffsetFactor * this.cardHeight) / itemCentralIndex;
      this.translateY = this.data.map((_, i) => verticalOffsetFactor * (itemCentralIndex - distanceFromCenter(i)));
    }

    private calculateRotateZ(): void {
      if (this.data.length <= 1) {
        this.rotateZ = [0];
        return;
      }

      const itemLastIndex = this.data.length - 1;
      const itemCentralIndex = itemLastIndex / 2;
      this.rotateZ = this.data.map(
        (_, i) =>
          ((i - itemCentralIndex) * this.rotationFactor) / itemCentralIndex +
          this.calculateHoverRotation(this.hoverableIndex, i),
      );
    }

    private calculateHoverTranslation(hoverableIndex: number, index: number): number {
      if (hoverableIndex === null || this.hoverableIndex === index) {
        return 0;
      }

      // const pushFactor = this.pushTranslateFactor;
      const pushFactor = this.pushTranslateFactor + this.pushTranslateFactor * this.data.length * 0.75;

      return index > hoverableIndex ? pushFactor * this.cardWidth : -pushFactor * this.cardWidth;
    }

    private calculateHoverRotation(hoverableIndex: number, index: number): number {
      if (hoverableIndex === null || this.hoverableIndex === index) {
        return 0;
      }

      return index > hoverableIndex ? this.pushRotateFactor : -this.pushRotateFactor;
    }

    private calculateCenteredTransforms(): void {
      const itemLastIndex = this.data.length - 1;
      const itemCentralIndex = itemLastIndex / 2;
      this.translateX = this.data.map(
        (_, i) =>
          (this.width - this.cardWidth) / 2 +
          (i - itemCentralIndex) * this.cardWidth +
          this.calculateHoverTranslation(this.hoverableIndex, i),
      );

      // calculcate tranlateY
      this.calculateTranslateY();

      // calculate rotation
      this.calculateRotateZ();
    }
  }
</script>

<style scoped lang="scss">
  .cards-fan {
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
    touch-action: none;

    &__card-animation-wrapper {
      position: relative;
      height: 100%;
      width: 100%;
      animation-timing-function: UiTransition(spring);
      animation-composition: add;
      will-change: transform;
      transform-style: preserve-3d;

      @include UiInlineAnimation(500ms) {
        from {
          transform: translate3d(0, 0, 0) scale(0);
        }
        to {
          transform: translate3d(0, 0, 0) scale(1);
        }
      }
    }

    &__card-wrapper {
      position: absolute;
      height: 100%;
      transition:
        transform ease 300ms,
        z-index linear 300ms;
      z-index: 0;
      will-change: transform;
      transform-style: preserve-3d;

      &_is-hovered:not(.cards-fan__card-wrapper_is-focused) {
        z-index: 1;
        .cards-fan__card-wrapper-hoverable {
          transform: translate3d(0, 0, 0) scale(var(--cards-fan--hover-grow-factor));
        }
      }

      &_is-focused {
        z-index: 1;
        .cards-fan__card-wrapper-hoverable {
          transform: translate3d(0, 0, 0) scale(var(--cards-fan--focus-grow-factor));
        }
      }

      &_invisible {
        pointer-events: none;
        visibility: hidden;
        opacity: 0;
      }
    }

    &__card-wrapper-draggable {
      height: 100%;
      transition: transform ease 300ms;
      cursor: pointer;
      will-change: transform;
      transform-style: preserve-3d;

      &_is-dragged {
        transition-duration: 0ms;
        cursor: grabbing;

        .cards-fan__card-wrapper-hoverable {
          transform: translate3d(0, 0, 0) scale(1) !important;
          transition-duration: 0ms;
        }
      }
    }

    &__card-wrapper-hoverable {
      height: 100%;
      transition: transform ease 300ms;
      transform-origin: bottom;
      transform-style: preserve-3d;
      will-change: transform;
    }

    &__ref-h {
      top: 50%;
      transform: translateY(-50%);
      position: absolute;
      width: 1px;
      height: 1px;
      opacity: 0;
      pointer-events: none;

      &_start {
        left: 0;
      }

      &_end {
        right: 0;
      }
    }

    &__ref-v {
      left: 50%;
      transform: translateX(-50%);
      position: absolute;
      width: 1px;
      height: 1px;
      opacity: 0;
      pointer-events: none;

      &_start {
        top: 0;
      }

      &_end {
        bottom: 0;
      }
    }
  }
</style>
