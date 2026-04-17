export default {
  roomPreparation: {
    emptySlot: 'Vrije plek',
    hostPrivateLabel: 'Privé lobby?',
    visibility: 'Lobby zichtbaarheid',
    public: 'Openbaar',
    private: 'Privé',
    hostTooltip: 'Het spel kan gestart worden wanneer er minstens {n} spelers zijn aangesloten.',
    guestTooltip: 'Alleen de host kan het spel starten.',
    hostSubmit: 'Start spel',
    guestSubmit: 'Wachten op host...',
    copy: 'Kopieer link',
    invitationLinkLabel: 'Uitnodigingslink',
    invitationLinkCaption: 'Gebruik de onderstaande link om je vrienden uit te nodigen voor het spel.',
    visibilityChanged: {
      public: 'De kamer is nu openbaar en kan door iedereen worden betreden.',
      private: 'De kamer is nu privé en alleen toegankelijk via uitnodiging.',
    },
    leaveDialog: {
      title: 'Lobby verlaten?',
      text: 'Wil je de verbinding met deze lobby verbreken en terugkeren naar het hoofdmenu?',
      primaryButtonText: 'Ja',
      secondaryButtonText: 'Nee',
    },
    addBot: 'Voeg een bot toe',
    min: 'Min',
  },
  results: {
    heading: 'Voltooid!',
    thankYou: 'Bedankt voor het spelen!',
    feedbackQuestion: 'Geef alsjeblieft {0} zodat we dit spel kunnen verbeteren.',
    shareFeedback: 'je feedback',
    feedbackUrl: 'https://forms.gle/KvarNiP6UaUaeNAB9',
    toMainMenu: 'Naar hoofdmenu',
    playAgain: 'Opnieuw spelen',
    x2: 'x2',
    getBonusReward: 'Ontvang {n} Essentie',
    rewards: 'Beloningen:',
    essenceReward: '+{n} Essentie',
    rating: 'Jouw beoordeling',
  },
  disconnectDialog: {
    title: 'Verbinding verbroken',
    code: {
      unknown:
        'Er is iets misgegaan en je verbinding is onderbroken. Probeer opnieuw verbinding te maken. Blijft het probleem bestaan, neem dan contact op met onze ondersteuning.',
      application_offline:
        'De gameserver is momenteel offline. Probeer het over een minuut opnieuw. Blijft het probleem bestaan, neem dan contact op met onze ondersteuning.',
      incorrect_connection_params:
        'Kan door technische problemen geen verbinding maken met het spel. Probeer het later opnieuw.',
      new_connection: 'Je bent met dit spel verbonden via een ander apparaat.',
      kick: 'Je bent uit deze kamer verwijderd.',
      too_many_players: 'Er zijn al te veel spelers verbonden met deze kamer, probeer een andere.',
      game_already_in_progress: 'Dit spel is al bezig en je kunt niet deelnemen, probeer een andere.',
      game_abandoned:
        'Alle spelers hebben dit spel verlaten en we hebben het afgesloten. Geen zorgen, je kunt een nieuwe starten vanuit het hoofdmenu.',
      player_left:
        'Een speler heeft dit spel definitief verlaten en we hebben het afgesloten. Alleen de vertrokken spelers hebben een straf gekregen, de beoordeling van de andere spelers blijft ongewijzigd.',
    },
    reconnect: 'Opnieuw verbinden',
    toMainMenu: 'Naar hoofdmenu',
  },
  unexpectedError: 'Er is een onverwachte fout opgetreden, probeer het later opnieuw.',
  kickPlayerDialog: {
    title: 'Speler uit lobby verwijderen',
    text: 'Wil je deze speler echt uit deze lobby verwijderen?',
    primaryButtonText: 'Ja',
    secondaryButtonText: 'Nee',
  },
  leaveGame: 'Verlaat dit spel',
  leaveGameDialog: {
    title: 'Dit spel verlaten?',
    text: 'Dit spel wordt als verlies voor jou geteld en je kunt niet opnieuw deelnemen. Weet je het zeker?',
    primaryButtonText: 'Ja',
    secondaryButtonText: 'Nee',
  },
  search: {
    heading: 'Zoeken naar een wedstrijd',
    cancel: 'Zoekopdracht annuleren',
    cancelDialog: {
      text: 'Zoekopdracht annuleren?',
      primaryButtonText: 'Ja',
      secondaryButtonText: 'Nee',
    },
  },
  pause: {
    title: 'Pauze',
    reason: {
      player_disconnected: 'Wachten op de verbinding van spelers. Het spel gaat binnenkort verder.',
      unknown: 'Het spel is gepauzeerd om onbekende redenen, maar gaat binnenkort verder.',
    },
  },
  playerLeftGame: 'Speler "{name}" heeft het spel verlaten.',
  skipTurn: 'Beurt overslaan',
  drawCard: 'Kaart trekken en beurt overslaan',
};
