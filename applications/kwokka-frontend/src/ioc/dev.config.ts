import type { IocContainerConfig } from '@/ioc/ioc-container';
import { IOC_CONTAINER_CONFIG_SHARED } from '@/ioc/shared.config';

import { ErrorTrackerProvider } from '@/service/error-tracker/error-tracker-provider';
import { ErrorTrackerProviderDevImpl } from '@/service/error-tracker/dev-error-tracker-provider';
import { DevTrackerServiceImpl } from '@/service/tracker/dev-tracker.service';
import { TrackerService } from '@/service/tracker/tracker.service';

export const IOC_CONTAINER_CONFIG_DEV: IocContainerConfig = {
  units: [
    ...IOC_CONTAINER_CONFIG_SHARED.units,
    { identifier: TrackerService, implementer: DevTrackerServiceImpl },
    { identifier: ErrorTrackerProvider, implementer: ErrorTrackerProviderDevImpl },
  ],
};
