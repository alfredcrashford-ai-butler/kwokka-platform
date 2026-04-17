export default {
  heading: 'Partita Classificata',
  startSearch: 'Inizia ricerca',
  seeAllCards: 'Vedi tutte le carte',
  rules: {
    shortDescription:
      "Guadagna punti classifica e scala la vetta della classifica in partite classificate a 4 giocatori. Assicurati di avere l'incantesimo giusto equipaggiato.",
    description: `
<ol>
  <li>Gioca in un gruppo di 4 giocatori con <b>Rating</b> simile.</li>
  <li>Alla fine di ogni partita guadagni o perdi RP (Punti Classifica).</li>
  <li>
    Ecco come funziona:
    <ul>
      <li>1° posto: +20 RP</li>
      <li>2° posto: +10 RP</li>
      <li>3° posto: 0 RP</li>
      <li>4° posto: -10 RP</li>
    </ul>
  </li>
  <li>Per ogni carta rimasta in mano perdi 2 RP.</li>
  <li>Per i giocatori con ranking più alto (<b>Rating</b> > 2000) la quantità di RP guadagnati diminuisce con l'aumentare del <b>Rating</b>.</li>
  <li>Se lasci la partita, ricevi una penalità di -100 RP e la partita termina immediatamente.</li>
</ol>
`,
    learnMore: 'Scopri di più',
  },
  rating: 'Rating',
  yourRating: 'Il tuo Rating',
  totalMatches: 'Partite Totali',
  wonMatches: 'Partite Vinte',
  leaderboard: {
    title: 'Classifica',
    open: 'Vedi classifica',
    rating: 'Rating',
    name: 'Nickname',
    index: '#',
  },
};
