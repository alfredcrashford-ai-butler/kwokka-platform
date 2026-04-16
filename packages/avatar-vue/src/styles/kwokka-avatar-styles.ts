interface Box {
  border?: string;
  padding?: string;
  margin?: string;
  gap?: string;
  borderRadius?: string;
  maxWidth?: string;
  minWidth?: string;
  maxHeight?: string;
  minHeight?: string;
  width?: string;
  height?: string;
  boxShadow?: string;
}

interface Text {
  fontSize?: string;
  lineHeight?: string;
  fontFamily?: string;
  fontWeight?: string;
  textAlign?: string;
}

interface Filter {
  filter?: string;
}

interface NineBox {
  nineBoxWidth?: string;
  nineBoxHeight?: string;
  nineBoxTopLeft?: string;
  nineBoxTop?: string;
  nineBoxTopRight?: string;
  nineBoxLeft?: string;
  nineBoxCenter?: string;
  nineBoxRight?: string;
  nineBoxBottomLeft?: string;
  nineBoxBottom?: string;
  nineBoxBottomRight?: string;
}

interface Loader {
  style?: string;
}

interface Color {
  color?: string;
  backgroundColor?: string;
}

type Block = Text & Filter & NineBox & Box & Color;

export interface KwokkaAvatarImageStyles {
  emptyImage?: Block;
}

export interface KwokkaAvatarStyles extends KwokkaAvatarImageStyles {
  button?: Block;
  input?: Block;
  inputBox?: Block;
  inputLabel?: Block;
  icon?: Block;
  loader?: Loader;
  emptyBackground?: Block;
  avatar?: Block;
  avatarName?: Block;
}

export interface KwokkaAvatarSetupStyles extends KwokkaAvatarStyles {
  container?: Block;
  description?: Block;
  name?: Block;
  nextButton?: Block;
  decorations?: Block;
  caption?: Block;
  backgroundLeftButton?: Block;
  backgroundLeftIcon?: Block;
  backgroundRightButton?: Block;
  backgroundRightIcon?: Block;
  imageLeftButton?: Block;
  imageLeftIcon?: Block;
  imageRightButton?: Block;
  imageRightIcon?: Block;
}

export interface KwokkaSimpleAvatarSetupStyles extends KwokkaAvatarStyles {
  container?: Block;
  description?: Block;
  name?: Block;
  nextButton?: Block;
}

export interface KwokkaAvatarSettingsStyles extends KwokkaAvatarStyles {
  container?: Block;
  tabButtonFirst?: Block;
  tabButtonFirstActive?: Block;
  tabButton?: Block;
  tabButtonActive?: Block;
  tabButtonLast?: Block;
  tabButtonLastActive?: Block;
  tabContainer?: Block;
  decoration?: Block;
  decorationActive?: Block;
  decorationSlot?: Block;
  decorationImage?: Block;
  decorationBackground?: Block;
  tabs?: Block;
  confirmButton?: Block;
  prevPageButton?: Block;
  nextPageButton?: Block;
}
