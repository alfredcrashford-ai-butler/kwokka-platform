export default {
  heading: 'Atlas',
  equipment: {
    title: 'Équipement',
    confirm: 'Confirmer',
    toSkillTree: 'Aller aux sorts',
    toEssenceActivations: "Aller aux activations d'Essence",
    arena: {
      title: 'Arène de Match',
      dialogTitle: 'Sélectionner une Arène de Match',
    },
    cardsSkins: {
      title: 'Apparences des Cartes',
      dialogTitle: 'Sélectionner une Apparence de Carte',
    },
    cardBack: {
      title: 'Dos de Carte',
      dialogTitle: 'Sélectionner un Dos de Carte',
    },
    activeSkill: {
      dialogTitle: 'Sort Équipé',
      dialogText:
        'Ceci est le sort que vous pouvez utiliser activement pendant la partie. Les sorts vous permettent généralement de faire une action spécifique à votre tour à la place de jouer une carte. Chaque sort a un temps de recharge de 3 tours, ce qui signifie que vous devez attendre au moins 3 de vos tours pour le réutiliser. Vous pouvez apprendre et équiper des sorts dans le menu Atlas → Sorts.',
      emptyTitle: 'Aucun Sort Équipé',
      emptyText: "Vous n'avez pas encore équipé de sort. Cliquez ici pour plus d'informations.",
    },
    passiveSkill: {
      dialogTitle: "Activation d'Essence",
      dialogText:
        "Cette capacité augmente passivement la quantité d'Essence que vous recevez. Chaque activation augmente votre multiplicateur d'Essence de 1. Vous pouvez débloquer l'activation d'Essence dans le menu Atlas → Activations d'Essence.",
    },
  },
  skillTree: {
    title: 'Sorts',
    learn: 'Débloquer pour {cost} Essence',
    equip: 'Équiper',
    equipped: 'Équipé',
    emptyActionPlaceholder: 'Sélectionner un sort',
    passiveHint: '(passif)',
    equippedHint: '(équipé)',
    unlockSkillTitle: 'Débloquer ce sort ?',
    unlockSkillConfirm: 'Débloquer',
    unlockSkillNotEnoughEssence:
      'Désolé, mais vous n\'avez pas assez ({balance}/{cost}) d\'Essence pour débloquer le sort "{name}".',
    unlockSkillText: 'Débloquer le sort "{name}" pour {cost} Essence ?',
  },
  essenceMultipliers: {
    title: "Activations d'Essence",
  },
  journey: {
    title: 'Parcours',
    unlock: 'Débloquer ({cost})',
    emptyActionPlaceholder: 'Sélectionner une récompense',
    unlocked: 'Débloqué',
    unlockedHint: '(débloqué)',
    unlockRewardTitle: 'Débloquer cette récompense ?',
    unlockRewardNotEnoughEssence:
      'Désolé, mais vous n\'avez pas assez ({balance}/{cost}) d\'Essence pour débloquer "{name}".',
    unlockRewardConfirm: 'Débloquer',
    unlockRewardText: 'Débloquer "{name}" pour {cost} Essence ?',
    infoClose: 'Fermer',
    info: 'Infos',
  },
  crypt: {
    title: 'Trésor',
  },
};
