export enum CapybaraAccessRight {
  // Profiles
  CreateProfile = 'CreateProfile',
  CreateOwnProfile = 'CreateOwnProfile',
  UpdateProfile = 'UpdateProfile',
  UpdateOwnProfile = 'UpdateOwnProfile',
  DeleteProfile = 'DeleteProfile',
  DeleteOwnProfile = 'DeleteOwnProfile',
  ReadOwnProfile = 'ReadOwnProfile',
  ReadProfile = 'ReadProfile',

  // Items
  CreateItem = 'CreateItem',
  ReadItem = 'ReadItem',
  UpdateItem = 'UpdateItem',
  DeleteItem = 'DeleteItem',

  // Item Trades
  CreateItemTrade = 'CreateItemTrade',
  ReadItemTrade = 'ReadItemTrade',
  RunOwnItemTrade = 'RunOwnItemTrade',
  UpdateItemTrade = 'UpdateItemTrade',
  DeleteItemTrade = 'DeleteItemTrade',

  // Item Instances
  GiveItemInstance = 'GiveItemInstance',
  TakeItemInstance = 'TakeItemInstance',
  ReadItemInstance = 'ReadItemInstance',
  ReadOwnItemInstance = 'ReadOwnItemInstance',
  RunOwnItemInstanceAction = 'RunOwnItemInstanceAction',
  RunItemInstanceAction = 'RunItemInstanceAction',
  GiveApplicationItemInstance = 'GiveApplicationItemInstance',
  TakeApplicationItemInstance = 'TakeApplicationItemInstance',

  // Decorations
  CreateDecoration = 'CreateDecoration',
  ReadDecoration = 'ReadDecoration',
  UpdateDecoration = 'UpdateDecoration',
  DeleteDecoration = 'DeleteDecoration',

  // Profile Decorations
  CreateProfileDecorations = 'CreateProfileDecorations',
  CreateOwnProfileDecorations = 'CreateOwnProfileDecorations',
  ReadProfileDecorations = 'ReadProfileDecorations',
  UpdateOwnProfileDecorations = 'UpdateOwnProfileDecorations',
  UpdateProfileDecorations = 'UpdateProfileDecorations',
  DeleteProfileDecorations = 'DeleteProfileDecorations',

  // Traits
  CreateTrait = 'CreateTrait',
  ReadTrait = 'ReadTrait',
  UpdateTrait = 'UpdateTrait',
  DeleteTrait = 'DeleteTrait',

  // Trait Instances
  ReadTraitInstance = 'ReadTraitInstance',
  UpdateTraitInstance = 'UpdateTraitInstance',
  UpdateOwnTraitInstance = 'UpdateOwnTraitInstance',
  DeleteTraitInstance = 'DeleteTraitInstance',

  // Item Management
  ManageItems = 'ManageItems',
}
