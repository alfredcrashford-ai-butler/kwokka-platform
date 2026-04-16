<template>
  <UiDialog
    ref="dialog"
    size="lg"
    :title="dialogTitle"
    :isPrimaryButtonDisabled="!isValid"
    @primaryButtonClick="onConfirm"
  >
    <template v-slot:body>
      <template v-if="accessRole">
        <UiInput
          class="add-access-role-dialog__input"
          v-model="accessRole.name"
          width="block"
          mode="compact"
          :label="$t('accessSetup.accessRoles.addEditAccessRoleNameLabel')"
          :placeholder="$t('accessSetup.accessRoles.addEditAccessRoleNamePlaceholder')"
        />
        <UiInput
          class="add-access-role-dialog__input"
          v-model="accessRole.description"
          width="block"
          mode="compact"
          :label="$t('accessSetup.accessRoles.addEditAccessRoleDescriptionLabel')"
          :placeholder="$t('accessSetup.accessRoles.addEditAccessRoleDescriptionPlaceholder')"
        />

        <p class="add-access-role-dialog__label">{{ $t('accessSetup.accessRoles.accessRights') }}</p>

        <div class="add-access-role-dialog__rights">
          <UiChip v-for="accessRight in selectedAccessRights" :key="accessRight.id">
            <span>{{ accessRight.name }}</span>
            <UiButton
              size="xxs"
              type="transparent"
              width="shrink"
              shape="circled"
              @click="onRemoveAccessRightClick(accessRight)"
            >
              <UiIcon name="x" size="xs" />
            </UiButton>
          </UiChip>
        </div>

        <UiTable
          ref="table"
          v-if="tableData"
          :data="tableData"
          :areRowsClickable="true"
          @rowClicked="onTableRowClick($event)"
          @dataRequested="onTableDataRequested($event)"
        />
      </template>
      <UiLoader v-else />
    </template>
  </UiDialog>
</template>

<script lang="ts">
  import { markRaw } from 'vue';
  import { Component, Ref, Vue } from 'vue-facing-decorator';
  import { AccessRightEntity, AccessRoleEntity } from '@kwokka/entities';
  import { LazyInject } from '@/ioc';
  import { AccessRightApi } from '@/api/auth/access-right/access-right.api';
  import { NotificationService } from '@/service/notification/notification.service';
  import UiTable, { type UiTableData } from '@/app/ui-kit/UiTable.vue';
  import UiDialog from '@/app/ui-kit/UiDialog.vue';
  import UiButton from '@/app/ui-kit/UiButton.vue';
  import UiIcon from '@/app/ui-kit/UiIcon.vue';
  import UiInput from '@/app/ui-kit/UiInput.vue';
  import UiChip from '@/app/ui-kit/UiChip.vue';
  import UiLoader from '@/app/ui-kit/UiLoader.vue';

  const ITEMS_PER_PAGE = 5;

  @Component({
    components: {
      UiTable,
      UiDialog,
      UiButton,
      UiIcon,
      UiInput,
      UiChip,
      UiLoader,
    },
    emits: ['confirm'],
  })
  export default class AddEditAccessRoleDialog extends Vue {
    @Ref()
    public dialog: UiDialog;

    @Ref()
    public table: UiTable;

    @LazyInject(AccessRightApi)
    public accessRightApi: AccessRightApi;

    @LazyInject(NotificationService)
    public notificationService: NotificationService;

    public tableData: UiTableData = null;
    public accessRole: AccessRoleEntity = null;
    public selectedAccessRights: AccessRightEntity[] = [];

    public get isValid(): boolean {
      return Boolean(this.accessRole?.name && this.accessRole?.description);
    }

    public get dialogTitle(): string {
      if (this.accessRole?.id) {
        return this.$t('accessSetup.accessRoles.editAccessRole');
      }

      return this.$t('accessSetup.accessRoles.addAccessRole');
    }

    public created() {
      this.setupTableData([], ITEMS_PER_PAGE);
    }

    public onTableRowClick(accessRight: AccessRightEntity) {
      if (this.isAccessRightAdded(accessRight)) {
        return;
      }

      this.selectedAccessRights = [...this.selectedAccessRights, accessRight];
    }

    public show(accessRole?: AccessRoleEntity): void {
      accessRole = new AccessRoleEntity(accessRole || { name: '', description: '', accessRightsIds: [] });
      this.dialog.show();
      this.setupAccessRights(accessRole).then(() => (this.accessRole = accessRole));
    }

    public async onTableDataRequested({ offset, limit }): Promise<void> {
      try {
        const response = await this.accessRightApi.list(offset, limit);
        this.setupTableData(response.data, response.meta.limit);
      } catch (e: any) {
        this.notificationService.showErrors([e]);
      }
    }

    public onConfirm(): void {
      this.accessRole.accessRightsIds = this.selectedAccessRights.map((el) => el.id);
      this.$emit('confirm', this.accessRole);
      this.dialog.hide();
    }

    public onRemoveAccessRightClick(accessRight: AccessRightEntity): void {
      this.selectedAccessRights = this.selectedAccessRights.filter((el) => el.id !== accessRight.id);
    }

    private setupTableData(accessRights: AccessRightEntity[], limit: number): void {
      this.tableData = markRaw({
        columns: ['name'],
        data: accessRights,
        limit,
        mapColumnValues: {
          name: (value, rowData: AccessRightEntity) => (this.isAccessRightAdded(rowData) ? `✅ ${value}` : value),
        },
      });
    }

    private isAccessRightAdded(accessRight: AccessRightEntity): boolean {
      return this.selectedAccessRights.some((el) => el.id === accessRight.id);
    }

    private async setupAccessRights(accessRole: AccessRoleEntity): Promise<void> {
      const ids = accessRole.accessRightsIds;
      this.selectedAccessRights = await Promise.all(ids.map((id) => this.accessRightApi.getById(id)));
    }
  }
</script>

<style scoped lang="scss">
  .add-access-role-dialog {
    &__input {
      @include UiMargin(4, bottom);
    }

    &__rights {
      @include UiMargin(4, bottom);
      display: flex;
      align-items: center;
      @include UiGap(1);
      flex-wrap: wrap;
    }

    &__label {
      @include UiMargin(2, bottom);
    }
  }
</style>
