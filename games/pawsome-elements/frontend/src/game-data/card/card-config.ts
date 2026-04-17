import { CardElement } from './card-element';
import { CardType } from './card-type';

export interface CardConfig {
  element: CardElement;
  type: CardType;
  power: number;
}
