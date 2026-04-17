export default {
  heading: 'Atlas',
  equipment: {
    title: 'Equipamiento',
    confirm: 'Confirmar',
    toSkillTree: 'Ir a hechizos',
    toEssenceActivations: 'Ir a activaciones de esencia',
    arena: {
      title: 'Arena de Partida',
      dialogTitle: 'Seleccionar Arena de Partida',
    },
    cardsSkins: {
      title: 'Aspectos de Cartas',
      dialogTitle: 'Seleccionar Aspecto de Cartas',
    },
    cardBack: {
      title: 'Reverso de Carta',
      dialogTitle: 'Seleccionar Reverso de Carta',
    },
    activeSkill: {
      dialogTitle: 'Hechizo Equipado',
      dialogText:
        'Este es el hechizo que puedes usar activamente durante el juego. Los hechizos normalmente te permiten realizar una acción especial en tu turno en lugar de jugar una carta. Cada hechizo tiene un tiempo de reutilización de 3 turnos, lo que significa que debes esperar al menos 3 turnos para usarlo de nuevo. Puedes aprender y equipar hechizos en el menú Atlas/Hechizos.',
      emptyTitle: 'Hechizo No Equipado',
      emptyText: 'No tienes ningún hechizo equipado todavía. Haz clic aquí para más información.',
    },
    passiveSkill: {
      dialogTitle: 'Activación de Esencia',
      dialogText:
        'Esta habilidad aumenta pasivamente la cantidad de Esencia que recibes. Cada activación incrementa tu multiplicador de Esencia en 1. Puedes desbloquear activaciones de Esencia en Atlas → Activaciones de Esencia.',
    },
  },
  skillTree: {
    title: 'Hechizos',
    learn: 'Desbloquear por {cost} Esencia',
    equip: 'Equipar',
    equipped: 'Equipado',
    emptyActionPlaceholder: 'Selecciona un hechizo',
    passiveHint: '(pasivo)',
    equippedHint: '(equipado)',
    unlockSkillTitle: '¿Desbloquear este hechizo?',
    unlockSkillConfirm: 'Desbloquear',
    unlockSkillNotEnoughEssence:
      'Lo siento, no tienes suficiente Esencia ({balance}/{cost}) para desbloquear el hechizo "{name}".',
    unlockSkillText: '¿Desbloquear el hechizo "{name}" por {cost} Esencia?',
  },
  essenceMultipliers: {
    title: 'Activaciones de Esencia',
  },
  journey: {
    title: 'Viaje',
    unlock: 'Desbloquear ({cost})',
    emptyActionPlaceholder: 'Selecciona una recompensa',
    unlocked: 'Desbloqueado',
    unlockedHint: '(desbloqueado)',
    unlockRewardTitle: '¿Desbloquear esta recompensa?',
    unlockRewardNotEnoughEssence:
      'Lo siento, no tienes suficiente Esencia ({balance}/{cost}) para desbloquear "{name}".',
    unlockRewardConfirm: 'Desbloquear',
    unlockRewardText: '¿Desbloquear "{name}" por {cost} Esencia?',
    infoClose: 'Cerrar',
    info: 'Información',
  },
  crypt: {
    title: 'Tesorería',
  },
};
