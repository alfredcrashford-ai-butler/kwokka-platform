import type { IocContainerConfig } from '@/ioc/ioc-container';
import { IOC_CONTAINER_CONFIG_SHARED } from '@/ioc/shared.config';

import { ErrorTrackerProvider } from '@/service/error-tracker/error-tracker-provider';
import { ErrorTrackerProviderSentryImpl } from '@/service/error-tracker/sentry-error-tracker-provider';
import { GaTrackerServiceImpl } from '@/service/tracker/ga-tracker.service';
import { TrackerService } from '@/service/tracker/tracker.service';

export const IOC_CONTAINER_CONFIG_PROD: IocContainerConfig = {
  units: [
    ...IOC_CONTAINER_CONFIG_SHARED.units,
    { identifier: ErrorTrackerProvider, implementer: ErrorTrackerProviderSentryImpl },
    { identifier: TrackerService, implementer: GaTrackerServiceImpl },
  ],
};
