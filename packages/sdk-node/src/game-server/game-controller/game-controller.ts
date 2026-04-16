import { GameInstanceEntity } from '@kwokka/entities';
import { GameControllerHookParam } from './hook-param';
import { type DisconnectReason } from '../interface';

export interface GameControllerStats {
  activeGamesCount: number;
  activePlayersCount: number;
}

export abstract class GameController {
  /**
   * Statistics of the game controller.
   * @field stats
   * @type {GameControllerStats}
   */
  declare public readonly stats: GameControllerStats;

  /**
   * Current active game instances that players are connected to. Can be in any status or state.
   * @field activeGameInstances
   * @type {GameInstanceEntity[]}
   */
  declare public readonly activeGameInstances: GameInstanceEntity[];

  /**
   * Updates the game instance and broadcasts the updates to the connected clients.
   * @param {GameInstanceEntity} gameInstance - The game instance to update.
   * @returns {GameInstanceEntity} The updated game instance.
   */
  declare public updateGameInstance: (gameInstance: GameInstanceEntity) => GameInstanceEntity;

  /**
   * Returns game instance with the up-to-date state.
   * @param {string} id - The ID of a game instance.
   * @returns {Promise<GameInstanceEntity | null>} The requested game instance.
   */
  declare public getGameInstance: (id: string) => Promise<GameInstanceEntity>;

  /**
   * Returns connectivity map with IDs of players as keys and boolean flags as values.
   * @param {string} id - The ID of a game instance.
   * @returns {Record<string, boolean>} Connectivity map.
   */
  declare public getConnectivity: (id: string) => Record<string, boolean>;

  /**
   * Persists game instance in the Kwokka platform.
   * @param {GameInstanceEntity} gameInstance Game instance to persist.
   * @returns {GameInstanceEntity} gameInstance
   */
  declare public persistGameInstance: (gameInstance: GameInstanceEntity) => GameInstanceEntity;

  /**
   * Disconnects a player from the game.
   * @param {string} playerId - The ID of the player to disconnect.
   * @param {DisconnectReason} reason - Disconnect reason sent to the player.
   */
  declare public disconnectPlayer: (accountId: string, reason?: DisconnectReason) => void;

  /**
   * Broadcasts an error message to a specific player.
   * @param {string} playerId - The ID of the player to send the error to.
   * @param {string} code - The error code.
   * @param {string} message - The error message.
   */
  declare public broadcastError: (accountId: string, code: string, message: string) => void;

  /**
   * Handles the event when a player disconnects from the game.
   * @param {GameControllerHookParam.PlayerDisconnected} data - The data related to the player disconnection event.
   */
  public abstract onPlayerDisconnected(data: GameControllerHookParam.PlayerDisconnected): any;

  /**
   * Handles the event when a player connects to the game.
   * @param {GameControllerHookParam.PlayerConnected} data - The data related to the player connection event.
   */
  public abstract onPlayerConnected(data: GameControllerHookParam.PlayerConnected): any;

  /**
   * Handles the event when a player performs an action in the game.
   * @param {GameControllerHookParam.PlayerAction} data - The data related to the player action event.
   */
  public abstract onPlayerAction(data: GameControllerHookParam.PlayerAction): any;

  /**
   * Handles any unhandled errors that occur in the game.
   * @param {any} error - The error object or message.
   */
  public abstract onUnhandledError(error: any): any;
}
