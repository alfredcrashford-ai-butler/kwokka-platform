export default {
  heading: 'Partida Clasificatoria',
  startSearch: 'Iniciar búsqueda',
  seeAllCards: 'Ver todas las cartas',
  rules: {
    shortDescription:
      'Gana rating y asciende en la clasificación en partidas clasificatorias de 4 jugadores. Asegúrate de tener el hechizo correcto equipado.',
    description: `
<ol>
  <li>Juega en un grupo de 4 jugadores con <b>Rating</b> similar.</li>
  <li>Al final de cada partida ganas o pierdes RP (Puntos de Rating).</li>
  <li>
    Así funciona:
    <ul>
      <li>1er lugar: +20 RP</li>
      <li>2do lugar: +10 RP</li>
      <li>3er lugar: 0 RP</li>
      <li>4to lugar: -10 RP</li>
    </ul>
  </li>
  <li>Por cada carta que te quede en la mano pierdes 2 RP.</li>
  <li>Para jugadores con <b>Rating</b> superior a 2000, la cantidad de RP ganados disminuye a medida que sube su <b>Rating</b>.</li>
  <li>Si abandonas la partida, recibes una penalización de -100 RP y la partida termina inmediatamente.</li>
</ol>
`,
    learnMore: 'Saber más',
  },
  rating: 'Rating',
  yourRating: 'Tu Rating',
  totalMatches: 'Partidas Totales',
  wonMatches: 'Partidas Ganadas',
  leaderboard: {
    title: 'Clasificación',
    open: 'Ver clasificación',
    rating: 'Puntuación',
    name: 'Apodo',
    index: '#',
  },
};
