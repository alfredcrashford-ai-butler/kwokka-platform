export default {
  heading: '地图集',
  equipment: {
    title: '装备',
    confirm: '确认',
    toSkillTree: '前往法术',
    toEssenceActivations: '前往精华激活',
    arena: {
      title: '比赛竞技场',
      dialogTitle: '选择比赛竞技场',
    },
    cardsSkins: {
      title: '卡牌皮肤',
      dialogTitle: '选择卡牌皮肤',
    },
    cardBack: {
      title: '卡牌背面',
      dialogTitle: '选择卡牌背面',
    },
    activeSkill: {
      dialogTitle: '已装备法术',
      dialogText:
        '这是你在游戏中可以主动使用的法术。法术通常允许你在自己的回合中执行某个动作, 代替出牌。每个法术有3回合冷却时间, 这意味着你需要等待至少3个自己的回合后才能再次使用。你可以在地图集/法术菜单中学习并装备法术。',
      emptyTitle: '未装备法术',
      emptyText: '你还没有装备任何法术。点击这里查看更多信息。',
    },
    passiveSkill: {
      dialogTitle: '精华激活',
      dialogText:
        '该能力被动增加你获得的精华数量。每次激活会将你的精华倍率提升1。你可以在地图集 → 精华激活菜单中解锁精华激活。',
    },
  },
  skillTree: {
    title: '法术',
    learn: '花费 {cost} 精华解锁',
    equip: '装备',
    equipped: '已装备',
    emptyActionPlaceholder: '选择一个法术',
    passiveHint: '（被动）',
    equippedHint: '（已装备）',
    unlockSkillTitle: '解锁此法术？',
    unlockSkillConfirm: '解锁',
    unlockSkillNotEnoughEssence: '抱歉，你的精华不足 ({balance}/{cost})，无法解锁“{name}”法术。',
    unlockSkillText: '花费 {cost} 精华解锁“{name}”法术？',
  },
  essenceMultipliers: {
    title: '精华激活',
  },
  journey: {
    title: '旅程',
    unlock: '解锁 ({cost})',
    emptyActionPlaceholder: '选择一个奖励',
    unlocked: '已解锁',
    unlockedHint: '（已解锁）',
    unlockRewardTitle: '解锁此奖励？',
    unlockRewardNotEnoughEssence: '抱歉，你的精华不足（{balance}/{cost}），无法解锁“{name}”。',
    unlockRewardConfirm: '解锁',
    unlockRewardText: '花费 {cost} 精华解锁"{name}"?',
    infoClose: '关闭',
    info: '信息',
  },
  crypt: {
    title: '宝库',
  },
};
