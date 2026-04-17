export default {
  roomPreparation: {
    emptySlot: 'Place libre',
    hostPrivateLabel: 'Salon privé ?',
    visibility: 'Visibilité du salon',
    public: 'Public',
    private: 'Privé',
    hostTooltip: 'La partie peut commencer dès qu’au moins {n} joueurs ont rejoint.',
    guestTooltip: 'Seul l’hôte peut lancer la partie.',
    hostSubmit: 'Démarrer la partie',
    guestSubmit: 'En attente de l’hôte...',
    copy: 'Copier le lien',
    invitationLinkLabel: "Lien d'invitation",
    invitationLinkCaption: 'Utilisez le lien ci-dessous pour inviter vos amis à la partie.',
    visibilityChanged: {
      public: 'Le salon est maintenant public et accessible à tous.',
      private: 'Le salon est maintenant privé et accessible uniquement sur invitation.',
    },
    leaveDialog: {
      title: 'Quitter ce salon ?',
      text: 'Voulez-vous vous déconnecter de ce salon et revenir au menu principal ?',
      primaryButtonText: 'Oui',
      secondaryButtonText: 'Non',
    },
    addBot: 'Ajouter un bot',
    min: 'Min',
  },
  results: {
    heading: 'Terminé !',
    thankYou: 'Merci d’avoir joué !',
    feedbackQuestion: 'Veuillez {0} pour nous aider à améliorer ce jeu.',
    shareFeedback: 'partager vos retours',
    feedbackUrl: 'https://forms.gle/KvarNiP6UaUaeNAB9',
    toMainMenu: 'Retour au menu principal',
    playAgain: 'Rejouer',
    x2: 'x2',
    getBonusReward: 'Recevez {n} Essence',
    rewards: 'Récompenses :',
    essenceReward: '+{n} Essence',
    rating: 'Votre classement',
  },
  disconnectDialog: {
    title: 'Déconnecté',
    code: {
      unknown:
        'Une erreur est survenue et votre connexion a été interrompue. Veuillez réessayer et si le problème persiste, contactez notre support.',
      application_offline:
        'Le serveur de jeu est actuellement hors ligne. Veuillez réessayer dans une minute et contacter notre support si le problème continue.',
      incorrect_connection_params:
        'Impossible de se connecter au jeu pour des raisons techniques. Veuillez réessayer plus tard.',
      new_connection: 'Vous vous êtes connecté à cette partie depuis un autre appareil.',
      kick: 'Vous avez été expulsé de ce salon.',
      too_many_players: 'Trop de joueurs sont déjà connectés à ce salon, essayez-en un autre.',
      game_already_in_progress:
        'Cette partie est déjà en cours et vous ne pouvez pas la rejoindre, essayez-en une autre.',
      game_abandoned:
        'Tous les joueurs se sont déconnectés de cette partie et elle a été fermée. Pas de souci, vous pouvez en lancer une nouvelle depuis le menu principal.',
      player_left:
        'Un joueur a quitté définitivement cette partie et elle a été fermée. Seuls les joueurs partis ont reçu des pénalités, le classement des autres reste inchangé.',
    },
    reconnect: 'Reconnexion',
    toMainMenu: 'Retour au menu principal',
  },
  unexpectedError: 'Une erreur inattendue est survenue, veuillez réessayer plus tard.',
  kickPlayerDialog: {
    title: 'Expulser un joueur du salon',
    text: 'Voulez-vous vraiment expulser ce joueur du salon ?',
    primaryButtonText: 'Oui',
    secondaryButtonText: 'Non',
  },
  leaveGame: 'Quitter cette partie',
  leaveGameDialog: {
    title: 'Quitter cette partie ?',
    text: 'Cette partie sera comptée comme une défaite et vous ne pourrez plus la rejoindre. Êtes-vous sûr ?',
    primaryButtonText: 'Oui',
    secondaryButtonText: 'Non',
  },
  search: {
    heading: 'Recherche de partie',
    cancel: 'Annuler la recherche',
    cancelDialog: {
      text: 'Annuler la recherche ?',
      primaryButtonText: 'Oui',
      secondaryButtonText: 'Non',
    },
  },
  pause: {
    title: 'Pause',
    reason: {
      player_disconnected: 'En attente des joueurs déconnectés. La partie reprendra bientôt.',
      unknown: 'La partie est en pause pour des raisons inconnues, mais reprendra bientôt.',
    },
  },
  playerLeftGame: 'Le joueur "{name}" a quitté la partie.',
  skipTurn: 'Passer son tour',
  drawCard: 'Piocher une carte et passer son tour',
};
