export interface KwokkaSoundSfxConfig {
  // The id of the sound effect.
  id: string;
  // The group of the sound effect.
  group: string;
  // Absolute or relative path to the file.
  src: string;
  // Set to true if we need to preload this audio.
  preload?: boolean;
  // Gain of this sound, varies from 0 to 1.
  gain?: number;
  // Set to true if this is a loop and it should restart playing once it finishes.
  loop?: boolean;
  // If set to true - if user has not yet interacted with the page and the sfx.play is called - the play is not
  // happening until player has interacted with the page; once player interacted - the sound is immediately played.
  // Usually needed for music and better to avoid with sound effects.
  suspend?: boolean;
}

export interface KwokkaSoundConfig {
  sfx: KwokkaSoundSfxConfig[];
}
