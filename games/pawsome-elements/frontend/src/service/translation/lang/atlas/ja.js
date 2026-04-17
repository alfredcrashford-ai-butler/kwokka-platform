export default {
  heading: 'アトラス',
  equipment: {
    title: '装備',
    confirm: '確認',
    toSkillTree: '呪文へ移動',
    toEssenceActivations: 'エッセンスアクティベーションへ移動',
    arena: {
      title: '対戦アリーナ',
      dialogTitle: '対戦アリーナを選択',
    },
    cardsSkins: {
      title: 'カードスキン',
      dialogTitle: 'カードスキンを選択',
    },
    cardBack: {
      title: 'カードの裏面',
      dialogTitle: 'カードの裏面を選択',
    },
    activeSkill: {
      dialogTitle: '装備中の呪文',
      dialogText:
        'これはゲーム中に積極的に使える呪文です。呪文は通常、カードをプレイする代わりに自分のターンで特定の行動を行う能力を与えます。各呪文には3ターンのクールダウンがあり、再び使用するには最低でも3ターン待つ必要があります。呪文はアトラスの呪文メニューで学習・装備できます。',
      emptyTitle: '呪文未装備',
      emptyText: 'まだ呪文を装備していません。詳細はこちらをクリックしてください。',
    },
    passiveSkill: {
      dialogTitle: 'エッセンスアクティベーション',
      dialogText:
        'この能力は受け取るエッセンスの量を受動的に増加させます。各アクティベーションはエッセンスの乗数を1増やします。アトラス→エッセンスアクティベーションメニューで解除可能です。',
    },
  },
  skillTree: {
    title: '呪文',
    learn: '{cost} エッセンスで解除',
    equip: '装備',
    equipped: '装備中',
    emptyActionPlaceholder: '呪文を選択してください',
    passiveHint: '（受動）',
    equippedHint: '（装備中）',
    unlockSkillTitle: 'この呪文を解除しますか？',
    unlockSkillConfirm: '解除する',
    unlockSkillNotEnoughEssence:
      '申し訳ありませんが、"{name}" の呪文を解除するのに必要なエッセンスが足りません（{balance}/{cost}）。',
    unlockSkillText: '{cost} エッセンスで "{name}" の呪文を解除しますか？',
  },
  essenceMultipliers: {
    title: 'エッセンスアクティベーション',
  },
  journey: {
    title: '旅路',
    unlock: '解除 ({cost})',
    emptyActionPlaceholder: '報酬を選択してください',
    unlocked: '解除済み',
    unlockedHint: '（解除済み）',
    unlockRewardTitle: 'この報酬を解除しますか？',
    unlockRewardNotEnoughEssence:
      '申し訳ありませんが、"{name}" の解除に必要なエッセンスが足りません（{balance}/{cost}）。',
    unlockRewardConfirm: '解除する',
    unlockRewardText: '{cost} エッセンスで "{name}" を解除しますか？',
    infoClose: '閉じる',
    info: '情報',
  },
  crypt: {
    title: '宝物庫',
  },
};
