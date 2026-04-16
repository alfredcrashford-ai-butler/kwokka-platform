<template>
  <div class="ui-table-outer">
    <div class="ui-table-container">
      <table
        class="ui-table"
        :class="{
          'ui-table_size-sm': size === 'sm',
          'ui-table_size-md': size === 'md',
        }"
      >
        <tr class="ui-table__header">
          <th v-for="(column, i) in displayColumns" :key="`${i}__${column}`" class="ui-table__cell">{{ column }}</th>
        </tr>
        <tr
          v-for="container in displayData"
          :key="container.tableUUID"
          class="ui-table__row"
          :class="{
            'ui-table__row_is-clickable': areRowsClickable && container?.data,
          }"
          @click="onRowClick(container)"
        >
          <template v-if="container?.data">
            <th v-for="(column, i) in container.data" :key="`${i}__${column}`" class="ui-table__cell">{{ column }}</th>
          </template>
          <template v-else>
            <th v-for="(column, i) in displayColumns" :key="`${i}__${column}`" class="ui-table__cell"></th>
          </template>
        </tr>
      </table>
      <div class="ui-table-empty" v-if="!displayData.length">
        <slot />
      </div>
    </div>
    <UiPagination
      class="ui-table__pagination"
      :isPrevDisabled="isPreviousPageButtonDisabled"
      :isNextDisabled="isNextPageButtonDisabled"
      :page="page"
      @next="onNextPageClick"
      @prev="onPreviousPageClick"
      v-if="showPagination"
    />
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';
  import { UuidUtil } from '@kwokka/utils';
  import UiPagination from './UiPagination.vue';

  export interface UiTableData {
    columns: string[];
    data: object[];
    limit?: number;
    mapColumnNames?: { [column in string]: string };
    mapColumnValues?: { [column in string]: (data: any, rowData?: object) => any };
  }

  export type UiTableSize = 'sm' | 'md';

  @Component({
    components: {
      UiPagination,
    },
    emits: ['rowClicked', 'dataRequested'],
  })
  export default class UiTable extends Vue {
    @Prop({ required: true })
    public data: UiTableData;

    @Prop({ default: true })
    public showPagination: boolean;

    @Prop({ default: 'sm' })
    public size: UiTableSize;

    @Prop({ default: false })
    public areRowsClickable: boolean;

    public page = 0;

    public get displayColumns(): string[] {
      return this.data.columns.map(
        (el) => this.data?.mapColumnNames?.[el] || `${el.slice(0, 1).toUpperCase()}${el.slice(1)}`,
      );
    }

    public get displayData(): any[] {
      const dataRows = this.data.data.map((data) => {
        const container = { tableUUID: UuidUtil.generate(6), data, originalData: data };
        container.data = this.data.columns.map(
          (key) => this.data?.mapColumnValues?.[key]?.(data[key], data) || data[key],
        );
        return container;
      });

      if (!this.data.limit) {
        return dataRows;
      }

      const emptyRowsNum = Math.max(this.data.limit - dataRows.length, 0);
      const emptyRows = new Array(emptyRowsNum).fill(null).map(() => ({ tableUUID: UuidUtil.generate(6) }));
      return [...dataRows, ...emptyRows];
    }

    public get isPreviousPageButtonDisabled(): boolean {
      return this.page === 0;
    }

    public get isNextPageButtonDisabled(): boolean {
      const numOfItems = this.data?.data?.length || 0;
      const limit = this.data?.limit || 0;
      return numOfItems < limit;
    }

    public onNextPageClick(): void {
      this.page += 1;
      this.requestData();
    }

    public onPreviousPageClick(): void {
      if (this.page === 0) {
        return;
      }
      this.page -= 1;
      this.requestData();
    }

    public created(): void {
      this.requestData();
    }

    public reset(): void {
      this.page = 0;
      this.requestData();
    }

    public onRowClick(container: any): void {
      if (!container?.data) {
        return;
      }

      if (this.areRowsClickable) {
        this.$emit('rowClicked', container.originalData);
      }
    }

    private requestData(): void {
      const offset = this.page * this.data.limit;
      this.$emit('dataRequested', { offset, limit: this.data.limit });
    }
  }
</script>

<style scoped lang="scss">
  $border-radius: UiGridSpacing(2);
  .ui-table-outer {
    width: 100%;
  }

  .ui-table-container {
    width: 100%;
    overflow: auto;
    border-radius: $border-radius;

    @include UiTheme() {
      background-color: UiColor(shade-800);
    }
  }

  .ui-table-empty {
    width: 100%;
    min-height: $grid-step * 50;
    display: flex;
    align-items: center;
    justify-content: center;

    @include UiTheme() {
      background-color: UiColor(shade-700);
    }
  }

  .ui-table {
    width: 100%;

    &_size-sm {
      .ui-table__cell {
        @include UiPadding(2);
        height: $grid-step * 9;
      }
    }

    &_size-md {
      .ui-table__cell {
        @include UiPadding(4);
        height: $grid-step * 11;
      }
    }

    &__cell {
      white-space: nowrap;
    }

    &__header {
      @include UiTheme() {
        background-color: rgba(UiColor(shade-900), 0.5);
      }
      @include UiFontWeight(bold);

      th:last-child {
        border-top-right-radius: $border-radius;
      }

      th:first-child {
        border-top-left-radius: $border-radius;
      }
    }

    &__row {
      &:nth-of-type(2n) {
        @include UiTheme() {
          background-color: rgba(UiColor(shade-100), 0.04);
        }
      }

      &:last-of-type {
        th:last-child {
          border-bottom-right-radius: $border-radius;
        }

        th:first-child {
          border-bottom-left-radius: $border-radius;
        }
      }

      &_is-clickable {
        @include UiButtonAppearance(0px);
        @include UiButtonStates();
      }
    }

    &__pagination {
      @include UiMargin(4, top);
      @include UiGap(2, false);
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>
