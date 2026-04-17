export default {
  heading: 'Atlas',
  equipment: {
    title: 'Ausrüstung',
    confirm: 'Bestätigen',
    toSkillTree: 'Zu den Zaubern',
    toEssenceActivations: 'Zu den Essenz-Aktivierungen',
    arena: {
      title: 'Kampf-Arena',
      dialogTitle: 'Kampf-Arena auswählen',
    },
    cardsSkins: {
      title: 'Kartendesigns',
      dialogTitle: 'Kartendesigns auswählen',
    },
    cardBack: {
      title: 'Kartenrücken',
      dialogTitle: 'Kartenrücken auswählen',
    },
    activeSkill: {
      dialogTitle: 'Ausgerüsteter Zauber',
      dialogText:
        'Dies ist der Zauber, den du während des Spiels aktiv nutzen kannst. Zauber ermöglichen dir in deinem Zug eine bestimmte Aktion anstelle einer Karte zu spielen. Jeder Zauber hat eine Abklingzeit von 3 Zügen, das heißt, du musst mindestens 3 eigene Züge warten, bevor du den Zauber erneut einsetzen kannst. Du kannst Zauber im Menü Atlas/Zauber lernen und ausrüsten.',
      emptyTitle: 'Kein Zauber ausgerüstet',
      emptyText: 'Du hast noch keinen Zauber ausgerüstet. Klicke hier für mehr Informationen.',
    },
    passiveSkill: {
      dialogTitle: 'Essenz-Aktivierung',
      dialogText:
        'Diese Fähigkeit erhöht passiv die Menge an Essenz, die du erhältst. Jede Aktivierung erhöht deinen Essenz-Multiplikator um 1. Essenz-Aktivierungen kannst du im Menü Atlas → Essenz-Aktivierungen freischalten.',
    },
  },
  skillTree: {
    title: 'Zauber',
    learn: 'Für {cost} Essenz freischalten',
    equip: 'Ausrüsten',
    equipped: 'Ausgerüstet',
    emptyActionPlaceholder: 'Zauber auswählen',
    passiveHint: '(passiv)',
    equippedHint: '(ausgerüstet)',
    unlockSkillTitle: 'Diesen Zauber freischalten?',
    unlockSkillConfirm: 'Freischalten',
    unlockSkillNotEnoughEssence:
      'Entschuldigung, du hast nicht genug Essenz ({balance}/{cost}), um den Zauber "{name}" freizuschalten.',
    unlockSkillText: 'Zauber "{name}" für {cost} Essenz freischalten?',
  },
  essenceMultipliers: {
    title: 'Essenz-Aktivierungen',
  },
  journey: {
    title: 'Reise',
    unlock: 'Freischalten ({cost})',
    emptyActionPlaceholder: 'Belohnung auswählen',
    unlocked: 'Freigeschaltet',
    unlockedHint: '(freigeschaltet)',
    unlockRewardTitle: 'Diese Belohnung freischalten?',
    unlockRewardNotEnoughEssence:
      'Entschuldigung, du hast nicht genug Essenz ({balance}/{cost}), um "{name}" freizuschalten.',
    unlockRewardConfirm: 'Freischalten',
    unlockRewardText: '"{name}" für {cost} Essenz freischalten?',
    infoClose: 'Schließen',
    info: 'Info',
  },
  crypt: {
    title: 'Schatzkammer',
  },
};
