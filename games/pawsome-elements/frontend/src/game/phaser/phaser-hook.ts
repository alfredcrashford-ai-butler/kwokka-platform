export interface Create {
  create(): void;
}

export interface Destroy {
  destroy(): void;
}

export interface PreDestroy {
  preDestroy(): void;
}

export interface Update {
  update(): void;
}

export interface Preload {
  preload(): void;
}

export interface Init {
  init(): void;
}

export interface PreUpdate {
  preUpdate(time, delta): void;
}
