import type { IocContainerConfig } from '@/ioc/ioc-container';
import { IOC_CONTAINER_CONFIG_SHARED } from '@/ioc/shared.config';
import { DevErrorTrackerService, DevTrackerService, ErrorTrackerService, TrackerService } from '@/service';

export const IOC_CONTAINER_CONFIG_DEV: IocContainerConfig = {
  units: [
    ...IOC_CONTAINER_CONFIG_SHARED.units,
    { identifier: TrackerService, implementer: DevTrackerService },
    { identifier: ErrorTrackerService, implementer: DevErrorTrackerService },
  ],
};
