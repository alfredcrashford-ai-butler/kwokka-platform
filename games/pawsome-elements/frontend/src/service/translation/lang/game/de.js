export default {
  roomPreparation: {
    emptySlot: 'Freier Platz',
    hostPrivateLabel: 'Private Lobby?',
    visibility: 'Sichtbarkeit der Lobby',
    public: 'Öffentlich',
    private: 'Privat',
    hostTooltip: 'Das Spiel kann gestartet werden, wenn mindestens {n} Spieler beigetreten sind.',
    guestTooltip: 'Nur der Gastgeber kann das Spiel starten.',
    hostSubmit: 'Spiel starten',
    guestSubmit: 'Warte auf Gastgeber...',
    copy: 'Link kopieren',
    invitationLinkLabel: 'Einladungslink',
    invitationLinkCaption: 'Nutze den untenstehenden Link, um Freunde zum Spiel einzuladen.',
    visibilityChanged: {
      public: 'Der Raum ist jetzt öffentlich und für jeden zugänglich.',
      private: 'Der Raum ist jetzt privat und nur mit Einladung zugänglich.',
    },
    leaveDialog: {
      title: 'Lobby verlassen?',
      text: 'Möchtest du diese Lobby verlassen und zum Hauptmenü zurückkehren?',
      primaryButtonText: 'Ja',
      secondaryButtonText: 'Nein',
    },
    addBot: 'Bot hinzufügen',
    min: 'Min',
  },
  results: {
    heading: 'Beendet!',
    thankYou: 'Danke fürs Spielen!',
    feedbackQuestion: 'Bitte {0}, damit wir das Spiel verbessern können.',
    shareFeedback: 'teile dein Feedback',
    feedbackUrl: 'https://forms.gle/KvarNiP6UaUaeNAB9',
    toMainMenu: 'Zum Hauptmenü',
    playAgain: 'Nochmal spielen',
    x2: 'x2',
    getBonusReward: 'Erhalte {n} Essenz',
    rewards: 'Belohnungen:',
    essenceReward: '+{n} Essenz',
    rating: 'Dein Rating',
  },
  disconnectDialog: {
    title: 'Verbindung unterbrochen',
    code: {
      unknown:
        'Etwas ist schiefgelaufen und deine Verbindung wurde unterbrochen. Bitte versuche dich erneut zu verbinden. Falls das Problem weiterhin besteht, kontaktiere unseren Support.',
      application_offline:
        'Der Spielserver ist momentan offline. Bitte versuche es in einer Minute erneut. Bei anhaltenden Problemen kontaktiere unseren Support.',
      incorrect_connection_params:
        'Technische Probleme verhinderten die Verbindung zum Spiel. Bitte versuche es später erneut.',
      new_connection: 'Du hast dich mit einem anderen Gerät mit diesem Spiel verbunden.',
      kick: 'Du wurdest aus diesem Raum entfernt.',
      too_many_players: 'Zu viele Spieler sind bereits in diesem Raum verbunden, versuche es in einem anderen.',
      game_already_in_progress:
        'Dieses Spiel läuft bereits und du kannst nicht beitreten, versuche es in einem anderen.',
      game_abandoned:
        'Alle Spieler haben das Spiel verlassen und es wurde geschlossen. Du kannst ein neues Spiel im Hauptmenü starten.',
      player_left:
        'Ein Spieler hat das Spiel endgültig verlassen und es wurde geschlossen. Nur Spieler, die gegangen sind, erhalten Strafen, das Rating der anderen bleibt unverändert.',
    },
    reconnect: 'Erneut verbinden',
    toMainMenu: 'Zum Hauptmenü',
  },
  unexpectedError: 'Unerwarteter Fehler, bitte später erneut versuchen.',
  kickPlayerDialog: {
    title: 'Spieler aus Lobby entfernen',
    text: 'Möchtest du diesen Spieler wirklich aus der Lobby entfernen?',
    primaryButtonText: 'Ja',
    secondaryButtonText: 'Nein',
  },
  leaveGame: 'Spiel verlassen',
  leaveGameDialog: {
    title: 'Spiel verlassen?',
    text: 'Das Spiel wird als Niederlage gewertet und du kannst nicht erneut beitreten. Bist du sicher?',
    primaryButtonText: 'Ja',
    secondaryButtonText: 'Nein',
  },
  search: {
    heading: 'Suche nach einem Match',
    cancel: 'Suche abbrechen',
    cancelDialog: {
      text: 'Suche abbrechen?',
      primaryButtonText: 'Ja',
      secondaryButtonText: 'Nein',
    },
  },
  pause: {
    title: 'Pause',
    reason: {
      player_disconnected: 'Warte auf getrennte Spieler. Das Spiel wird bald fortgesetzt.',
      unknown: 'Das Spiel wurde aus unbekannten Gründen pausiert. Es wird bald fortgesetzt.',
    },
  },
  playerLeftGame: 'Spieler „{name}“ hat das Spiel verlassen.',
  skipTurn: 'Zug überspringen',
  drawCard: 'Karte ziehen und Zug überspringen',
};
