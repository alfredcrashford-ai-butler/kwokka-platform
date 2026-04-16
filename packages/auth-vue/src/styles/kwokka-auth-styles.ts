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
  textShadow?: string;
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

export interface KwokkaAuthStyles {
  links?: Color & Text & Filter;
  card?: Block;
  button?: Block;
  input?: Block;
  inputBox?: Block;
  inputLabel?: Block;
  icon?: Block;
  loader?: Loader;
  passwordBox?: Block;
  passwordInput?: Block;
  passwordButton?: Block;
  passwordButtonIcon?: Block;
  backButton?: Block;
  heading?: Block;
  optionsList?: Block;
  emailButton?: Block;
  googleButton?: Block;
  discordButton?: Block;
  anonButton?: Block;
  delimiter?: Block;
  suggestionIcon?: Block;
  suggestion?: Block;
  suggestionPositive?: Block;
  suggestionNegative?: Block;
  success?: Block;
  successHeading?: Block;
  successCaption?: Block;
  terms?: Block;
  email?: {
    emailInput?: Block;
    passwordInput?: Block;
    suggestionList?: Block;
    submit?: Block;
    resetPasswordButton?: Block;
  };
  resetPasswordRequest?: {
    heading?: Block;
    description?: Block;
    input?: Block;
    submit?: Block;
    loader?: Block;
    successIcon?: Block;
  },
  resetPassword?: {
    heading?: Block;
    suggestionList?: Block;
    description?: Block;
    input?: Block;
    loader?: Block;
    submit?: Block;
    successIcon?: Block;
  },
  anon?: {
    retryButton?: Block;
  };
}
