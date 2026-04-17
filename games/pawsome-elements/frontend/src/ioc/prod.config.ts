import type { IocContainerConfig } from '@/ioc/ioc-container';
import { IOC_CONTAINER_CONFIG_SHARED } from '@/ioc/shared.config';
import { TrackerService, ErrorTrackerService, SentryErrorTrackerService, ProdTrackerService } from '@/service';

export const IOC_CONTAINER_CONFIG_PROD: IocContainerConfig = {
  units: [
    ...IOC_CONTAINER_CONFIG_SHARED.units,
    { identifier: TrackerService, implementer: ProdTrackerService },
    { identifier: ErrorTrackerService, implementer: SentryErrorTrackerService },
  ],
};
