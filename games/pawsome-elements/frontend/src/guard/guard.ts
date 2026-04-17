import { type NavigationGuard } from 'vue-router';

export interface Guard {
  perform: NavigationGuard;
}
