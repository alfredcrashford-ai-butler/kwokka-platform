import { GameController } from "./game-controller";

export interface GameConnectionConfig {
  controller: GameController;
  gameInstanceId: string;
  gameServerUrl: string;
}
