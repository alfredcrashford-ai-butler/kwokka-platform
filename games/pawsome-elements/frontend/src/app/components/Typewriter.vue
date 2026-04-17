<template>
  <span v-html="typewriting"></span>
</template>

<script lang="ts">
  import { Component, Prop, Vue, Watch } from 'vue-facing-decorator';

  const INTERVAL_MS = 10;

  @Component
  export default class Typewriter extends Vue {
    @Prop()
    public content: string;

    public typewriting: string = '';
    private typewritingInterval: number;

    @Watch('content', { immediate: true })
    public onContentChange(content?: string): void {
      this.typewriting = '';
      clearInterval(this.typewritingInterval);
      if (!content) {
        return;
      }

      this.typewritingInterval = setInterval(() => {
        if (this.content?.length === this.typewriting?.length) {
          clearInterval(this.typewritingInterval);
          return;
        }

        this.typewriting = this.content.slice(0, this.typewriting.length + 1);
      }, INTERVAL_MS);
    }

    public beforeUnmount(): void {
      clearInterval(this.typewritingInterval);
    }
  }
</script>
