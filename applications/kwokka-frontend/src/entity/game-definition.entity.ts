/**
 * @type GameDefinitionId
 * @public
 */
export type GameDefinitionEntityId = string;

/**
 * @enum GameDefinitionIds
 * @public
 */
export enum GameDefinitionId {
  CODEMEMES = 'codememes',
  ABSURD = 'absurd',
  ADMIRADO = 'admirado',
  BIG_BOSSES = 'big-bosses',
  SPACE_CUSTOMS = 'space-customs',
  PAWSOME_ELEMENTS = 'pawsome-elements',
}

/**
 * @interface GameDefinitionConstructorParams
 * @public
 */
export interface GameDefinitionConstructorParams {
  id: GameDefinitionEntityId;
  name: string;
  description: string;
  shortDescription: string;
  imageUrl: string;
  media: string[];
  createdAt: Date;
  minPlayers: number;
  maxPlayers: number;
  minApproximateDuration: number;
  maxApproximateDuration: number;
  difficulty: number;
  tags: string[];
  userGroups: string[];
}

/**
 * @class GameDefinitionEntity
 * @public
 */
export class GameDefinitionEntity {
  public id: GameDefinitionEntityId;

  public name: string;

  public description: string;

  public media: string[];

  public createdAt: Date;

  public minPlayers: number;

  public maxPlayers: number;

  public minApproximateDuration: number;

  public maxApproximateDuration: number;

  public difficulty: number;

  public tags: string[];

  public shortDescription: string;

  public imageUrl: string;

  public userGroups: string[];

  public constructor(params: GameDefinitionConstructorParams) {
    this.id = params.id;
    this.name = params.name;
    this.description = params.description;
    this.shortDescription = params.shortDescription;
    this.imageUrl = params.imageUrl;
    this.media = params.media;
    this.createdAt = params.createdAt;
    this.minPlayers = params.minPlayers;
    this.maxPlayers = params.maxPlayers;
    this.minApproximateDuration = params.minApproximateDuration;
    this.maxApproximateDuration = params.maxApproximateDuration;
    this.difficulty = params.difficulty;
    this.tags = params.tags;
    this.userGroups = params.userGroups;
  }

  public static get maxDifficulty(): number {
    return 4;
  }
}
