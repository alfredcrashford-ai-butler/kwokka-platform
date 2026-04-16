<template>
  <UiTable
    ref="table"
    v-if="tableData"
    :data="tableData"
    :areRowsClickable="true"
    @rowClicked="onRowClick($event)"
    @dataRequested="onTableDataRequested($event)"
  />

  <CredentialDialog
    ref="credentialDialog"
    @delete="onDeleteConfirm($event)"
    @sendVerification="onSendVerification($event)"
  />
</template>

<script lang="ts">
  import { markRaw } from 'vue';
  import { Component, Prop, Ref, Vue } from 'vue-facing-decorator';
  import {
    CredentialEntityType,
    DiscordCredentialEntity,
    GoogleCredentialEntity,
    type CredentialEntity,
  } from '@kwokka/entities';
  import { LazyInject } from '@/ioc';
  import { CredentialApi } from '@/api/auth/credential/credential.api';
  import type { NetworkResponse } from '@/service/network/http.service';
  import { NotificationService } from '@/service/notification/notification.service';
  import UiTable, { type UiTableData } from '@/app/ui-kit/UiTable.vue';
  import CredentialDialog from './CredentialDialog.vue';

  const ITEMS_PER_PAGE = 10;

  @Component({
    components: {
      UiTable,
      CredentialDialog,
    },
  })
  export default class CredentialsList extends Vue {
    @Prop()
    public accountId: string = null;

    @Ref()
    public table: UiTable;

    @Ref()
    public credentialDialog: CredentialDialog;

    public tableData: UiTableData = null;

    @LazyInject(CredentialApi)
    public credentialApi: CredentialApi;

    @LazyInject(NotificationService)
    public notificationService: NotificationService;

    public created() {
      this.setupTableData([], ITEMS_PER_PAGE);
    }

    public async onRowClick(credential: CredentialEntity): Promise<void> {
      this.credentialDialog.show(credential);
    }

    public async onTableDataRequested({ offset, limit }): Promise<void> {
      try {
        const response = await this.fetchData(offset, limit);
        this.setupTableData(response.data, response.meta.limit);
      } catch (e: any) {
        this.notificationService.showErrors([e]);
      }
    }

    private fetchData(offset: number, limit: number): Promise<NetworkResponse<CredentialEntity[]>> {
      if (this.accountId) {
        return this.credentialApi.listByAccountId(this.accountId, offset, limit);
      } else {
        return this.credentialApi.list(offset, limit);
      }
    }

    public async onDeleteConfirm(credential: CredentialEntity) {
      try {
        await this.credentialApi.delete(credential.id);
        this.table.reset();
        this.notificationService.show({
          text: this.$t('general.components.credentialsList.deletedSuccessfully'),
          type: 'success',
        });
      } catch (e: any) {
        this.notificationService.showErrors([e]);
      }
    }

    public async onSendVerification(credential: CredentialEntity) {
      try {
        await this.credentialApi.verifyCredential(credential.id);
        this.notificationService.show({
          text: this.$t('general.components.credentialsList.verificationSentSuccessfully'),
          type: 'success',
        });
      } catch (e: any) {
        this.notificationService.showErrors([e]);
      }
    }

    private setupTableData(credentials: CredentialEntity[], limit: number): void {
      this.tableData = markRaw({
        columns: ['accountId', 'type', 'identifier', 'email', 'username', 'isVerified'],
        data: credentials,
        limit,
        mapColumnValues: {
          email: (_: undefined, credential: CredentialEntity) => {
            if (credential.type === CredentialEntityType.EmailPassword) {
              return credential.identifier;
            }

            if (credential.type === CredentialEntityType.Google) {
              return (credential as GoogleCredentialEntity).data.email;
            }

            if (credential.type === CredentialEntityType.Discord) {
              return (credential as DiscordCredentialEntity).data.email;
            }

            return '-';
          },
          username: (_: undefined, credential: CredentialEntity) => {
            if (credential.type === CredentialEntityType.Discord) {
              return (credential as DiscordCredentialEntity).data.username;
            }

            return '-';
          },
        },
      });
    }
  }
</script>
