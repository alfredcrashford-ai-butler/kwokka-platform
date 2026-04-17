export interface Connectable {
  setConnectivity(connectivity: Record<string, boolean>): void;
}
