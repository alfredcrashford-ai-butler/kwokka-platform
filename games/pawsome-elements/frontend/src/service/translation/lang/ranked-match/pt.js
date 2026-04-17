export default {
  heading: 'Partida Ranqueada',
  startSearch: 'Iniciar busca',
  seeAllCards: 'Ver todas as cartas',
  rules: {
    shortDescription:
      'Ganhe pontos de classificação e suba no ranking em partidas ranqueadas de 4 jogadores. Certifique-se de equipar o feitiço correto.',
    description: `
<ol>
  <li>Jogue em um grupo de 4 jogadores, cada um com classificação (<b>Rating</b>) similar.</li>
  <li>No final de cada partida, você ganha ou perde RP (Pontos de Classificação).</li>
  <li>
    Veja como funciona:
    <ul>
      <li>1º lugar: +20 RP</li>
      <li>2º lugar: +10 RP</li>
      <li>3º lugar: 0 RP</li>
      <li>4º lugar: -10 RP</li>
    </ul>
  </li>
  <li>Para cada carta que sobrar na sua mão, você perde 2 RP.</li>
  <li>Para jogadores de classificação alta (<b>Rating</b> > 2000), o RP ganho diminui conforme a classificação aumenta.</li>
  <li>Se você sair da partida, leva uma penalidade de -100 RP e a partida termina imediatamente.</li>
</ol>
`,
    learnMore: 'Saiba mais',
  },
  rating: 'Classificação',
  yourRating: 'Sua Classificação',
  totalMatches: 'Partidas Totais',
  wonMatches: 'Partidas Vencidas',
  leaderboard: {
    title: 'Ranking',
    open: 'Ver ranking',
    rating: 'Classificação',
    name: 'Apelido',
    index: '#',
  },
};
