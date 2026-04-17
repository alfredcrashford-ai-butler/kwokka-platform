import type { IocContainerConfig } from '@/ioc/ioc-container';
import { IOC_CONTAINER_CONFIG_PROD } from '@/ioc/prod.config';
import { IOC_CONTAINER_CONFIG_DEV } from '@/ioc/dev.config';

export function getIocConfig(): IocContainerConfig {
  if (import.meta.env.PROD) {
    return IOC_CONTAINER_CONFIG_PROD;
  }

  return IOC_CONTAINER_CONFIG_DEV;
}
