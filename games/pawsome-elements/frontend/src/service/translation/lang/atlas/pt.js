export default {
  heading: 'Atlas',
  equipment: {
    title: 'Equipamento',
    confirm: 'Confirmar',
    toSkillTree: 'Ir para feitiços',
    toEssenceActivations: 'Ir para ativações de essência',
    arena: {
      title: 'Arena de Partida',
      dialogTitle: 'Selecionar Arena de Partida',
    },
    cardsSkins: {
      title: 'Skins de Cartas',
      dialogTitle: 'Selecionar Skins de Cartas',
    },
    cardBack: {
      title: 'Verso da Carta',
      dialogTitle: 'Selecionar Verso da Carta',
    },
    activeSkill: {
      dialogTitle: 'Feitiço Equipado',
      dialogText:
        'Este é o feitiço que você pode usar ativamente durante o jogo. Normalmente, feitiços te dão a habilidade de realizar uma ação específica no seu turno em vez de jogar uma carta. Cada feitiço tem um tempo de recarga de 3 turnos, ou seja, você precisa esperar pelo menos 3 turnos seus para usar o feitiço novamente. Você pode aprender e equipar feitiços no menu Atlas/Feitiços.',
      emptyTitle: 'Feitiço Não Equipado',
      emptyText: 'Você ainda não equipou nenhum feitiço. Clique aqui para mais informações.',
    },
    passiveSkill: {
      dialogTitle: 'Ativação de Essência',
      dialogText:
        'Esta habilidade aumenta passivamente a quantidade de Essência que você recebe. Cada ativação aumenta seu multiplicador de Essência em 1. Você pode desbloquear ativações de essência no menu Atlas → Ativações de Essência.',
    },
  },
  skillTree: {
    title: 'Feitiços',
    learn: 'Desbloquear por {cost} de Essência',
    equip: 'Equipar',
    equipped: 'Equipado',
    emptyActionPlaceholder: 'Selecione um feitiço',
    passiveHint: '(passivo)',
    equippedHint: '(equipado)',
    unlockSkillTitle: 'Desbloquear este feitiço?',
    unlockSkillConfirm: 'Desbloquear',
    unlockSkillNotEnoughEssence:
      'Desculpe, você não tem Essência suficiente ({balance}/{cost}) para desbloquear o feitiço "{name}".',
    unlockSkillText: 'Desbloquear o feitiço "{name}" por {cost} de Essência?',
  },
  essenceMultipliers: {
    title: 'Ativações de Essência',
  },
  journey: {
    title: 'Jornada',
    unlock: 'Desbloquear ({cost})',
    emptyActionPlaceholder: 'Selecione uma recompensa',
    unlocked: 'Desbloqueado',
    unlockedHint: '(desbloqueado)',
    unlockRewardTitle: 'Desbloquear esta recompensa?',
    unlockRewardNotEnoughEssence:
      'Desculpe, você não tem Essência suficiente ({balance}/{cost}) para desbloquear "{name}".',
    unlockRewardConfirm: 'Desbloquear',
    unlockRewardText: 'Desbloquear "{name}" por {cost} de Essência?',
    infoClose: 'Fechar',
    info: 'Informações',
  },
  crypt: {
    title: 'Tesouraria',
  },
};
