<template>
  <div class="game-details">
    <UiHeading class="game-details__heading">{{ $t('gameManagement.details.title') }}</UiHeading>
    <div class="game-details__row">
      <p>{{ $t('gameManagement.details.description') }}</p>
      <UiButton @click="onEditClick">{{ $t('gameManagement.details.editGame') }}</UiButton>
    </div>

    <hr class="game-details__divider" />

    <div class="game-details__info" v-if="game">
      <p>Key: {{ game.key }}</p>
      <p>Application account id: {{ game.applicationAccountId }}</p>
      <p>Tags: {{ game.tags }}</p>
      <p>Created at: {{ formatDate(game.createdAt) }}</p>
      <p>Available since: {{ formatDate(game.availableSince) }}</p>
      <p>Available till: {{ formatDate(game.availableTill) }}</p>
    </div>
  </div>

  <AddEditGameDialog ref="addEditDialog" @confirm="onEditConfirm($event)" @delete="onDeleteConfirm($event)" />
</template>

<script lang="ts">
  import { Component, Prop, Ref, Vue } from 'vue-facing-decorator';
  import type { GameEntity } from '@kwokka/entities';
  import { GameApi } from '@/api/play/game/game.api';
  import { LazyInject } from '@/ioc';
  import { NotificationService } from '@/service/notification/notification.service';
  import { DateUtil, ObjectUtil } from '@kwokka/utils';
  import UiButton from '@/app/ui-kit/UiButton.vue';
  import UiHeading from '@/app/ui-kit/UiHeading.vue';
  import AddEditGameDialog from '../../../components/AddEditGameDialog.vue';

  @Component({
    components: {
      UiHeading,
      UiButton,
      AddEditGameDialog,
    },
    emits: ['gameUpdated'],
  })
  export default class GameDetails extends Vue {
    @Ref()
    public addEditDialog: AddEditGameDialog;

    @LazyInject(GameApi)
    public gameApi: GameApi;

    @LazyInject(NotificationService)
    public notificationService: NotificationService;

    @Prop({ required: true })
    public game: GameEntity = null;

    public onEditClick(): void {
      this.addEditDialog.show(this.game);
    }

    public async onDeleteConfirm(game: GameEntity): Promise<void> {
      try {
        await this.gameApi.delete(game.id);
        this.notificationService.show({ text: this.$t('gameManagement.details.deletedSuccessfully'), type: 'success' });
        this.$router.replace({ name: 'games-management' });
      } catch (e: any) {
        this.notificationService.showErrors([e]);
      }
    }

    public async onEditConfirm(game: GameEntity): Promise<void> {
      await this.updateGame(game);
      this.addEditDialog.hide();
    }

    public formatDate(date?: Date): string {
      if (!date) {
        return '-';
      }

      return DateUtil.format(date, 'DD.MM.YYYY | HH:mm');
    }

    private async updateGame(game: GameEntity): Promise<void> {
      try {
        const updateParams = ObjectUtil.take(game, ['key', 'url', 'tags', 'availableSince', 'availableTill']);
        game = await this.gameApi.update(game.id, updateParams);
        this.notificationService.show({ text: this.$t('gameManagement.details.updatedSuccessfully'), type: 'success' });
        this.$emit('gameUpdated', game);
      } catch (e: any) {
        this.notificationService.showErrors([e]);
        throw e;
      }
    }
  }
</script>

<style scoped lang="scss">
  .game-details {
    display: flex;
    flex-direction: column;
    @include UiGap(4);

    &__row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      @include UiGap(2);
    }

    &__divider {
      border-bottom: 1px solid rgba(#fff, 0.5);
    }

    &__info {
      @include UiPadding(4);
      @include UiBorderRadius(sm);
      @include UiTheme() {
        background-color: UiColor(shade-800);
      }
    }
  }
</style>
