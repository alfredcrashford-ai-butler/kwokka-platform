<template>
  <div class="decorations-setup">
    <UiHeading class="decorations-setup__heading">{{ $t('itemManagement.decorations.title') }}</UiHeading>
    <div class="decorations-setup__row">
      <p>{{ $t('itemManagement.decorations.description') }}</p>
      <UiButton @click="onAddClick">{{ $t('itemManagement.decorations.addDecoration') }}</UiButton>
    </div>
    <div class="decorations-setup__filter"></div>
    <div class="decorations-setup__grid">
      <DecorationCard
        v-for="decoration in decorations"
        :key="decoration.id"
        :decoration="decoration"
        @click="onDecorationCardClick($event)"
      />
    </div>
    <UiPagination
      :isPrevDisabled="page <= 0"
      :isNextDisabled="decorations.length < itemsPerPage"
      :page="page"
      @next="setPage(page + 1)"
      @prev="setPage(page - 1)"
    />

    <AddEditDecorationDialog
      ref="addEditDialog"
      @confirm="onAddEditConfirm($event)"
      @delete="onDeleteConfirm($event)"
    />
  </div>
</template>

<script lang="ts">
  import { Component, Ref, Vue } from 'vue-facing-decorator';
  import type { DecorationEntity } from '@kwokka/entities';
  import { ObjectUtil } from '@kwokka/utils';
  import { LazyInject } from '@/ioc';
  import { NotificationService } from '@/service/notification/notification.service';
  import { DecorationApi } from '@/api/avatar/decoration/decoration.api';
  import UiHeading from '@/app/ui-kit/UiHeading.vue';
  import UiButton from '@/app/ui-kit/UiButton.vue';
  import UiPagination from '@/app/ui-kit/UiPagination.vue';
  import DecorationCard from './DecorationCard.vue';
  import AddEditDecorationDialog from './AddEditDecorationDialog.vue';

  @Component({
    components: {
      UiHeading,
      UiButton,
      DecorationCard,
      UiPagination,
      AddEditDecorationDialog,
    },
  })
  export default class DecorationsSetup extends Vue {
    @Ref()
    public addEditDialog: AddEditDecorationDialog;

    public decorations: DecorationEntity[] = [];

    @LazyInject(DecorationApi)
    public decorationApi: DecorationApi;

    @LazyInject(NotificationService)
    public notificationService: NotificationService;

    public page: number = 0;

    public readonly itemsPerPage = 20;

    public mounted() {
      this.fetchItems();
    }

    public onAddClick(): void {
      this.addEditDialog.show();
    }

    public onDecorationCardClick(decoration: DecorationEntity): void {
      this.addEditDialog.show(decoration);
    }

    public async onDeleteConfirm(decoration: DecorationEntity): Promise<void> {
      try {
        await this.decorationApi.delete(decoration.id);
        this.notificationService.show({
          text: this.$t('itemManagement.decorations.deletedSuccessfully'),
          type: 'success',
        });
        this.fetchItems();
      } catch (e: any) {
        this.notificationService.showErrors([e]);
      }
    }

    public async onAddEditConfirm(decoration: DecorationEntity): Promise<void> {
      if (!decoration.applicationAccountId) {
        decoration.applicationAccountId = undefined;
      }

      if (decoration.id) {
        await this.updateDecoration(decoration);
      } else {
        await this.createDecoration(decoration);
      }

      this.addEditDialog.hide();
      this.setPage(0);
    }

    public setPage(page: number) {
      this.page = page;
      this.fetchItems();
    }

    private async updateDecoration(decoration: DecorationEntity): Promise<void> {
      try {
        const updateParams = ObjectUtil.take(decoration, ['key', 'type']);
        await this.decorationApi.update(decoration.id, updateParams);
        this.notificationService.show({
          text: this.$t('itemManagement.decorations.updatedSuccessfully'),
          type: 'success',
        });
      } catch (e: any) {
        this.notificationService.showErrors([e]);
        throw e;
      }
    }

    private async createDecoration(decoration: DecorationEntity): Promise<void> {
      try {
        await this.decorationApi.create(decoration);
        this.notificationService.show({
          text: this.$t('itemManagement.decorations.createdSuccessfully'),
          type: 'success',
        });
      } catch (e: any) {
        this.notificationService.showErrors([e]);
        throw e;
      }
    }

    private async fetchItems(): Promise<void> {
      try {
        const response = await this.decorationApi.list(this.itemsPerPage * this.page, this.itemsPerPage);
        this.decorations = response.data;
      } catch (e: any) {
        this.notificationService.showErrors([e]);
      }
    }
  }
</script>

<style scoped lang="scss">
  .decorations-setup {
    &__grid {
      display: grid;
      grid-template-columns: repeat(5, minmax(0, 1fr));
      @include UiGap(2);
      @include UiMargin(4, bottom);

      @include UiMediaTablet() {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }

      @include UiMediaMobile() {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    &__heading {
      @include UiMargin(4, bottom);
    }

    &__row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      @include UiMargin(4, bottom);
    }
  }
</style>
