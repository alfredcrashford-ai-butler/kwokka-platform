export enum TrackingCategory {
  Auth = 'auth',
  PageView = 'page_view',
  Feedback = 'feedback',
  Share = 'share',
  Game = 'game',
  Onboarding = 'onboarding',
  Journal = 'journal',
  Shop = 'shop',
  Menu = 'menu',
  Ads = 'ads',
}

export enum TrackingEvent {
  // Onboarding / Tutorial events
  TutorialStarted = 'tutorial_started',
  TutorialLeft = 'tutorial_left',
  TutorialCompleted = 'tutorial_completed',
  OnboardingScenarioStarted = 'onboarding_scenario_started',
  OnboardingScenarioFinished = 'onboarding_scenario_finished',

  // Double reward events
  DoubleRewardAdCancelled = 'double_reward_ad_cancelled',
  DoubleRewardAdCompleted = 'double_reward_ad_completed',
  AfterGameRewardBonusAdClick = 'after_game_reward_bonus_ad_click',

  // Game events
  GameStarted = 'game_started',
  GameFinished = 'game_finished',
  FeedbackFormAfterRoomLobbyClick = 'feedback_form_after_room_lobby_click',

  // Game/Practive events
  PracticeStarted = 'practice_started',
  PracticeLobbyTypeFinished = 'practice_lobby_type_finished',
  PracticePlayAgainClick = 'practice_play_again_click',

  // Game/Quick Match events
  QuickMatchSearchStarted = 'quick_match_search_started',
  QuickMatchLobbyTypeFinished = 'quick_match_lobby_type_finished',
  QuickMatchPlayAgainClick = 'quick_match_play_again_click',

  // Game/Ranked Match events
  RankedMatchSearchStarted = 'ranked_match_search_started',
  RankedMatchLobbyTypeFinished = 'ranked_match_lobby_type_finished',
  RankedMatchPlayAgainClick = 'ranked_match_play_again_click',

  // Game/Room events
  RoomLobbyTypeJoined = 'room_lobby_type_joined',
  RoomLobbyTypeCreated = 'room_lobby_type_created',
  RoomLobbyTypeFinished = 'room_lobby_type_finished',
  RoomPlayAgainClick = 'room_play_again_click',

  // Auth events
  SignIn = 'sign_in',
  SignUp = 'sign_up',
  PrivacyPolicyClick = 'privacy_policy_click',

  // Shop events
  PurchaseForCurrencyClicked = 'purchase_for_currency_clicked',
  PurchaseForEssenceClicked = 'purchase_for_essence_clicked',

  // Journal events
  JournalTutorialPageClick = 'journal_tutorial_page_click',
  JournalTutorialStart = 'journal_tutorial_start',
  JournalCardSetView = 'journal_card_set_view',
  JournalRankedLearnMoreClick = 'journal_ranked_learn_more_click',
  JournalNotesPageClick = 'journal_notes_page_click',

  // Main menu events
  PracticeStartClick = 'practice_start_click',
  PlayClick = 'play_click',
  ShopClick = 'shop_click',
  JournalClick = 'journal_click',
  JoinDiscordClick = 'join_discord_click',
  AtlasClick = 'atlas_click',
  CredentialsAdded = 'credentials_added',
}
