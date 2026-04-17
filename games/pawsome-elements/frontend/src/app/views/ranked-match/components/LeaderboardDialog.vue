<template>
  <UiDialog
    ref="dialog"
    :title="$t('rankedMatch.leaderboard.title')"
    :isPrimaryButtonShown="false"
    :isSecondaryButtonShown="false"
    :isCloseButtonShown="true"
  >
    <template v-slot:body>
      <FadeTransition>
        <UiLoader v-if="!pageData" />
        <div class="leaderboard-dialog" v-else>
          <div class="leaderboard-dialog__table">
            <div class="leaderboard-dialog__row">
              <div class="leaderboard-dialog__col leaderboard-dialog__col_index">
                {{ $t('rankedMatch.leaderboard.index') }}
              </div>
              <div class="leaderboard-dialog__col leaderboard-dialog__col_name">
                {{ $t('rankedMatch.leaderboard.name') }}
              </div>
              <div class="leaderboard-dialog__col leaderboard-dialog__col_rating">
                {{ $t('rankedMatch.leaderboard.rating') }}
              </div>
            </div>
            <div v-for="(entry, i) in pageData.data" :key="i" class="leaderboard-dialog__row">
              <div class="leaderboard-dialog__col leaderboard-dialog__col_index">{{ entry.i + 1 }}</div>
              <div class="leaderboard-dialog__col leaderboard-dialog__col_name">{{ entry.name }}</div>
              <div class="leaderboard-dialog__col leaderboard-dialog__col_rating">{{ entry.rating }}</div>
            </div>
            <div class="leaderboard-dialog__row" v-for="i in itemsPerPage - pageData.data.length" :key="i"></div>
          </div>

          <div class="leaderboard-dialog__controls">
            <UiButton type="transparent" :disabled="page === 0" @click="setPage(page - 1)">
              <UiIcon name="arrow-left" />
            </UiButton>
            <span>{{ page + 1 }} / {{ totalPages }}</span>
            <UiButton type="transparent" :disabled="page + 1 === totalPages" @click="setPage(page + 1)">
              <UiIcon name="arrow-right" />
            </UiButton>
          </div>
        </div>
      </FadeTransition>
    </template>
  </UiDialog>
</template>

<script lang="ts">
  import { Component, Ref, Vue } from 'vue-facing-decorator';
  import type { TraitEntity } from '@kwokka/entities';
  import { ErrorTrackerService, KwokkaService, NotificationService } from '@/service';
  import { LazyInject } from '@/ioc';
  import { UiButton, UiDialog, UiIcon, UiLoader } from '@/app/ui-kit';
  import { FadeTransition } from '@/app/transitions';

  const ITEMS_PER_PAGE = 10;

  @Component({
    components: {
      FadeTransition,
      UiLoader,
      UiButton,
      UiDialog,
      UiIcon,
    },
    emits: ['start'],
  })
  export default class LeaderboardDialog extends Vue {
    public page: number = 0;
    public pageData: { data; meta } = null;
    public readonly itemsPerPage = ITEMS_PER_PAGE;
    private rankedSeasonTrait: TraitEntity;

    @Ref()
    public dialog: UiDialog;

    @LazyInject(KwokkaService)
    private kwokkaService: KwokkaService;

    @LazyInject(NotificationService)
    private notificationService: NotificationService;

    @LazyInject(ErrorTrackerService)
    private errorTrackerService: ErrorTrackerService;

    public get totalPages(): number {
      return Math.ceil((this.pageData?.meta?.count || 0) / ITEMS_PER_PAGE);
    }

    public async mounted(): Promise<void> {
      this.rankedSeasonTrait = await this.fetchRankedSeasonTrait();
    }

    public show(): void {
      this.dialog.show();
      this.setPage(0);
    }

    private async setPage(page: number): Promise<void> {
      try {
        if (!this.rankedSeasonTrait) {
          this.rankedSeasonTrait = await this.fetchRankedSeasonTrait();
        }
        this.page = page;
        this.pageData = await this.fetchPage(this.page);
      } catch (error) {
        this.errorTrackerService.captureError(error);
        this.notificationService.showErrors(error);
      }
    }

    private async fetchPage(page: number): Promise<{ data: { i: number; rating: number; name: string }[]; meta }> {
      const traitInstances = await this.kwokkaService.client.trait.listTraitInstancesByTraitId(
        this.rankedSeasonTrait.id,
        { sort: { value: 'desc' }, offset: ITEMS_PER_PAGE * this.page, limit: ITEMS_PER_PAGE },
      );

      const data = await Promise.all(
        traitInstances.data.map(async (el, i) => ({
          i: i + page * ITEMS_PER_PAGE,
          rating: el.value,
          name: await this.getName(el.accountId),
        })),
      );

      return { data, meta: traitInstances.meta };
    }

    private async getName(accountId: string): Promise<string> {
      try {
        const profile = await this.kwokkaService.client.profile.getProfileByAccountId(accountId);
        if (!profile) {
          return '-';
        }

        return profile.name;
      } catch (e) {
        return '-';
      }
    }

    private async fetchRankedSeasonTrait(): Promise<TraitEntity> {
      return this.kwokkaService.getCurrentRankedSeason();
    }
  }
</script>

<style scoped lang="scss">
  .leaderboard-dialog {
    @include UiTypographyParagraph1();

    &__table {
      display: flex;
      flex-direction: column;
    }

    &__row {
      display: flex;
      align-items: center;
      width: 100%;
      height: UiSpacing(8);
      @include UiTextShadow(1);

      &:nth-child(odd) {
        background-color: rgba(0, 0, 0, 0.5);
      }

      &:nth-child(even) {
        background-color: rgba(0, 0, 0, 0.25);
      }

      &:first-child {
        border-top-left-radius: UiSpacing(1);
        border-top-right-radius: UiSpacing(1);
      }

      &:last-child {
        border-bottom-left-radius: UiSpacing(1);
        border-bottom-right-radius: UiSpacing(1);
      }
    }

    &__col {
      height: 100%;
      display: flex;
      align-items: center;
      @include UiPadding(4, left);
      @include UiPadding(4, right);

      &_index {
        flex-basis: 15%;
        flex-shrink: 0;
      }

      &_name {
        flex-grow: 1;
      }

      &_rating {
        flex-shrink: 0;
        flex-basis: 10%;
        text-align: end;
      }
    }

    &__controls {
      display: flex;
      align-items: center;
      justify-content: center;
      @include UiMargin(2, top);
      @include UiTextShadow(2);
    }
  }
</style>
