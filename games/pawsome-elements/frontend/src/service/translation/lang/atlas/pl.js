export default {
  heading: 'Atlas',
  equipment: {
    title: 'Equipment',
    confirm: 'Confirm',
    toSkillTree: 'Go to spells',
    toEssenceActivations: 'Go to essence activations',
    arena: {
      title: 'Match Arena',
      dialogTitle: 'Select Match Arena',
    },
    cardsSkins: {
      title: 'Cards Skins',
      dialogTitle: 'Select Cards Skins',
    },
    cardBack: {
      title: 'Card Back',
      dialogTitle: 'Select Card Back',
    },
    activeSkill: {
      dialogTitle: 'Equipped Spell',
      dialogText:
        'This is the spell that you can actively use during the game. Spells normally provide you an ability to do a certain action in your turn instead of playing a card. Every spell has a cooldown of 3 turns, which means you need to wait at least 3 turns of yours to use your spell again. You can learn and equip spells in the Atlas/Spells menu.',
      emptyTitle: 'Spell Not Equipped',
      emptyText: "You don't have any spell equipped yet. Click here for more information.",
    },
    passiveSkill: {
      dialogTitle: 'Essence Activation',
      dialogText:
        'This ability passively increases the amount of Essence you receive. Each activation boosts your Essence multiplier by 1. You can unlock Essence activation in the Atlas → Essence Activations menu.',
    },
  },
  skillTree: {
    title: 'Spells',
    learn: 'Unlock for {cost} Essence',
    equip: 'Equip',
    equipped: 'Equipped',
    emptyActionPlaceholder: 'Select a spell',
    passiveHint: '(passive)',
    equippedHint: '(equipped)',
    unlockSkillTitle: 'Unlock this spell?',
    unlockSkillConfirm: 'Unlock',
    unlockSkillNotEnoughEssence:
      'Sorry, but you don\'t have enough ({balance}/{cost}) Essence to unlock "{name}" spell.',
    unlockSkillText: 'Unlock the spell "{name}" for {cost} Essence?',
  },
  essenceMultipliers: {
    title: 'Essence Activations',
  },
  journey: {
    title: 'Journey',
    unlock: 'Unlock ({cost})',
    emptyActionPlaceholder: 'Select a reward',
    unlocked: 'Unlocked',
    unlockedHint: '(unlocked)',
    unlockRewardTitle: 'Unlock this reward?',
    unlockRewardNotEnoughEssence: 'Sorry, but you don\'t have enough ({balance}/{cost}) Essence to unlock "{name}".',
    unlockRewardConfirm: 'Unlock',
    unlockRewardText: 'Unlock "{name}" for {cost} Essence?',
    infoClose: 'Close',
    info: 'Info',
  },
  crypt: {
    title: 'Treasury',
  },
};
