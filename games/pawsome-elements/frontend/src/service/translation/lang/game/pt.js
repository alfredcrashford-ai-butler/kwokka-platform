export default {
  roomPreparation: {
    emptySlot: 'Vaga livre',
    hostPrivateLabel: 'Lobby privado?',
    visibility: 'Visibilidade do lobby',
    public: 'Público',
    private: 'Privado',
    hostTooltip: 'O jogo pode começar quando pelo menos {n} jogadores estiverem conectados.',
    guestTooltip: 'Apenas o anfitrião pode iniciar o jogo.',
    hostSubmit: 'Iniciar jogo',
    guestSubmit: 'Aguardando o anfitrião...',
    copy: 'Copiar link',
    invitationLinkLabel: 'Link de convite',
    invitationLinkCaption: 'Use o link abaixo para convidar seus amigos para o jogo.',
    visibilityChanged: {
      public: 'A sala agora é pública e pode ser acessada por qualquer pessoa.',
      private: 'A sala agora é privada e só pode ser acessada por convite.',
    },
    leaveDialog: {
      title: 'Sair deste lobby?',
      text: 'Deseja desconectar deste lobby e voltar ao menu principal?',
      primaryButtonText: 'Sim',
      secondaryButtonText: 'Não',
    },
    addBot: 'Adicionar um bot',
    min: 'Mín',
  },
  results: {
    heading: 'Finalizado!',
    thankYou: 'Obrigado por jogar!',
    feedbackQuestion: 'Por favor, {0} para que possamos melhorar este jogo.',
    shareFeedback: 'compartilhe seu feedback',
    feedbackUrl: 'https://forms.gle/KvarNiP6UaUaeNAB9',
    toMainMenu: 'Para o menu principal',
    playAgain: 'Jogar novamente',
    x2: 'x2',
    getBonusReward: 'Ganhe {n} Essência',
    rewards: 'Recompensas:',
    essenceReward: '+{n} Essência',
    rating: 'Sua classificação',
  },
  disconnectDialog: {
    title: 'Desconectado',
    code: {
      unknown:
        'Algo deu errado e sua conexão foi interrompida. Por favor, tente reconectar e se o problema persistir, entre em contato com o suporte.',
      application_offline:
        'O servidor do jogo está offline no momento. Tente reconectar em um minuto e, se o problema continuar, entre em contato com o suporte.',
      incorrect_connection_params:
        'Não foi possível conectar ao jogo devido a problemas técnicos. Tente novamente mais tarde.',
      new_connection: 'Você conectou-se a este jogo usando outro dispositivo.',
      kick: 'Você foi expulso desta sala.',
      too_many_players: 'Muitos jogadores já estão conectados a esta sala, tente outra.',
      game_already_in_progress: 'Este jogo já está em andamento e você não pode entrar, tente outro.',
      game_abandoned:
        'Todos os jogadores se desconectaram deste jogo e ele foi encerrado. Não se preocupe, você pode iniciar um novo no menu principal.',
      player_left:
        'Um jogador saiu deste jogo permanentemente e ele foi encerrado. Apenas os jogadores que saíram receberam penalidades, a classificação dos demais permanece.',
    },
    reconnect: 'Reconectar',
    toMainMenu: 'Para o menu principal',
  },
  unexpectedError: 'Ocorreu um erro inesperado, por favor tente novamente mais tarde.',
  kickPlayerDialog: {
    title: 'Expulsar jogador do lobby',
    text: 'Você realmente quer expulsar este jogador deste lobby?',
    primaryButtonText: 'Sim',
    secondaryButtonText: 'Não',
  },
  leaveGame: 'Sair deste jogo',
  leaveGameDialog: {
    title: 'Sair deste jogo?',
    text: 'Este jogo será considerado uma derrota para você e você não poderá entrar nele novamente. Tem certeza?',
    primaryButtonText: 'Sim',
    secondaryButtonText: 'Não',
  },
  search: {
    heading: 'Procurando partida',
    cancel: 'Cancelar busca',
    cancelDialog: {
      text: 'Cancelar busca?',
      primaryButtonText: 'Sim',
      secondaryButtonText: 'Não',
    },
  },
  pause: {
    title: 'Pausa',
    reason: {
      player_disconnected: 'Aguardando jogadores desconectados. O jogo continuará em breve.',
      unknown: 'O jogo está pausado por razões desconhecidas, mas continuará em breve.',
    },
  },
  playerLeftGame: 'O jogador "{name}" saiu do jogo.',
  skipTurn: 'Pular vez',
  drawCard: 'Comprar carta e pular vez',
};
