import { injectable } from 'inversify';
import { UserEntity } from '@/entity/user.entity';

@injectable()
export abstract class TrackerService {
  /**
   * List of all categories for tracker events.
   * @property {Object} E_CAT
   * @readonly
   * @static
   * @public
   */
  public static readonly E_CAT = {
    GENERAL: 'general',
    AUTH: 'auth',
    SIGN_IN: 'sign_in',
    SIGN_UP: 'sign_up',
    GUEST_UPGRADE: 'guest_upgrade',
    DASHBOARD: 'dashboard',
    COLLECTION: 'collection',
    GAME_LOBBY: 'game_lobby',
    GAME_RESULTS: 'game_results',
    GAME: 'game',
    PARTY_PASS: 'party_pass',
  };

  /**
   * List of all event names
   * @property {Object} E_NAME
   * @readonly
   * @static
   * @public
   */
  public static readonly E_NAME = {
    LOGIN: 'login',
    LOGOUT: 'logout',

    DASHBOARD_RETRY_CLICK: 'dashboard_retry_click',
    DASHBOARD_COLLECTION_WIDGET_PLAY_CLICK: 'dashboard_collection_widget_play_click',
    DASHBOARD_COLLECTION_WIDGET_COLLECTION_CLICK: 'dashboard_collection_widget_collection_click',
    DASHBOARD_HIGHLIGHT_WIDGET_EXPLORE_CLICK: 'dashboard_highlight_widget_explore_click',
    DASHBOARD_PLAYED_LAST_WIDGET_PLAY_CLICK: 'dashboard_played_last_widget_play_click',
    DASHBOARD_GUEST_PROFILE_UPGRADE_CLICK: 'dashboard_guest_profile_upgrade_click',
    DASHBOARD_UNRANKED_CLICK: 'dashboard_unranked_click',
    DASHBOARD_COMPETITIVE_CLICK: 'dashboard_competitive_click',
    DASHBOARD_PARTY_PASS_CLICK: 'dashboard_party_pass_click',
    DASHBOARD_LOBBIES_CLICK: 'dashboard_lobbies_click',

    COLLECTION_GAME_SELECT: 'collection_game_select',
    COLLECTION_GAME_CREATE: 'collection_game_create',

    AUTH_PRIVACY_POLICY_CLICK: 'auth_privacy_policy_click',

    SIGN_IN_CONFIRM_CLICK: 'sign_in_confirm_click',
    SIGN_IN_SUCCESS: 'sign_in_success',
    SIGN_IN_SIGN_UP_CLICK: 'sign_in_sign_up_click',
    SIGN_IN_FORGOT_PASSWORD_CLICK: 'sign_in_forgot_password_click',
    SIGN_UP_CONFIRM_CLICK: 'sign_up_confirm_click',
    SIGN_UP_SUCCESS: 'sign_up_success',
    SIGN_UP_PRIVACY_POLICY_CLICK: 'sign_up_privacy_policy_click',
    SIGN_UP_SIGN_IN_CLICK: 'sign_up_sign_in_click',
    SIGN_UP_GUEST_SIGN_IN_CLICK: 'sign_up_guest_sign_in_click',

    GUEST_UPGRADE_SUBMIT_CLICK: 'guest_upgrade_submit_click',
    GUEST_UPGRADE_PRIVACY_POLICY_CLICK: 'guest_upgrade_privacy_policy_click',

    GAME_CHAT_MESSAGE_SEND: 'game_chat_message_send',
    GAME_CHAT_OPEN: 'game_chat_open',
    GAME_RULES_SHOW: 'game_rules_show',
    GAME_SETTINGS_CLICK: 'game_settings_click',
    GAME_MANAGE_CLICK: 'game_manage_click',
    GAME_LEAVE_CLICK: 'game_leave_click',
    GAME_LEAVE_CONFIRM: 'game_leave_confirm',
    GAME_SOUND_SETTING_CLICK: 'game_sound_setting_click',
    GAME_JOIN_ERROR_DIALOG_SHOW: 'game_join_error_dialog_show',
    GAME_JOIN_ERROR_DIALOG_CONFIRM: 'game_join_error_dialog_confirm',
    GAME_ERROR_DIALOG_CANCEL: 'game_error_dialog_cancel',
    GAME_CONNECT_ERROR_DIALOG_SHOW: 'game_connect_error_dialog_show',
    GAME_CONNECT_ERROR_DIALOG_CONFIRM: 'game_connect_error_dialog_confirm',
    GAME_DISCONNECT_ERROR_DIALOG_SHOW: 'game_disconnect_error_dialog_show',
    GAME_DISCONNECT_ERROR_DIALOG_CONFIRM: 'game_disconnect_error_dialog_confirm',
    GAME_LOBBY_START_CLICK: 'game_lobby_start_click',
    GAME_LOBBY_LINK_COPY_CLICK: 'game_lobby_link_copy_click',
    GAME_LOBBY_SHARE_CLICK: 'game_lobby_share_click',
    GAME_LOBBY_RULES_CLICK: 'game_lobby_rules_click',
    GAME_LOBBY_LANGUAGE_CHANGE_CLICK: 'game_lobby_language_change_click',
    GAME_LOBBY_LANGUAGE_CHANGE_CONFIRM: 'game_lobby_language_change_confirm',
    GAME_LOBBY_TYPE_CHANGE_CLICK: 'game_lobby_type_change_click',
    GAME_LOBBY_TYPE_CHANGE_CONFIRM: 'game_lobby_type_change_confirm',

    GAME_RESULT_DISCORD_CLICK: 'game_result_discord_click',
    GAME_RESULT_DASHBOARD_CLICK: 'game_result_dashboard_click',

    PARTY_PASS_INTERESTED: 'party_pass_interested',
  };

  public abstract event(category: string, name: string, params?: object): void;

  public abstract pageView(page: string, location: string): void;

  public abstract setUser(user: UserEntity): void;
}
