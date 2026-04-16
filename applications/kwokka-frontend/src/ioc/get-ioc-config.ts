import type { IocContainerConfig } from '@/ioc/ioc-container';
import { IOC_CONTAINER_CONFIG_PROD } from '@/ioc/prod.config';
import { IOC_CONTAINER_CONFIG_DEV } from '@/ioc/dev.config';

/**
 * @function getIocConfig
 * @return {IocContainerConfig}
 */
export function getIocConfig(): IocContainerConfig {
  if (import.meta.env.NODE_ENV === 'production') {
    return IOC_CONTAINER_CONFIG_PROD;
  }

  // return dev config as default
  return IOC_CONTAINER_CONFIG_DEV;
}
