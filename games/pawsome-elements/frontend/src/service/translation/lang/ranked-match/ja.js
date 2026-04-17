export default {
  heading: 'ランクマッチ',
  startSearch: '検索開始',
  seeAllCards: 'すべてのカードを見る',
  rules: {
    shortDescription:
      '4人のランクマッチでレーティングを獲得し、リーダーボードの頂点を目指そう。適切な呪文を装備していることを確認してください。',
    description: `
<ol>
  <li>似たレーティングの4人パーティでプレイします。</li>
  <li>試合終了時にRP(レーティングポイント)を獲得または失います。</li>
  <li>
    仕組みは以下の通りです:
    <ul>
      <li>1位: +20 RP</li>
      <li>2位: +10 RP</li>
      <li>3位: 0 RP</li>
      <li>4位: -10 RP</li>
    </ul>
  </li>
  <li>手札に残ったカード1枚につき2RPを失います。</li>
  <li>レーティングが高いプレイヤー(<b>Rating</b> > 2000)は、持っているレーティングが高いほど得られるRPが減少します。</li>
  <li>試合を途中退出すると、ペナルティで100RPを失い、試合は即終了します。</li>
</ol>
`,
    learnMore: '詳細を見る',
  },
  rating: 'レーティング',
  yourRating: 'あなたのレーティング',
  totalMatches: '総試合数',
  wonMatches: '勝利数',
  leaderboard: {
    title: 'リーダーボード',
    open: 'リーダーボードを見る',
    rating: 'レーティング',
    name: 'ニックネーム',
    index: '#',
  },
};
