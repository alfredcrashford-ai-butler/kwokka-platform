type Scalable = number | string | Date;
type All = Scalable | null;

interface MinOperator<T = Scalable> {
  min?: T;
}

interface MaxOperator<T = Scalable> {
  max?: T;
}

interface EqualsOperator<T = All> {
  eq?: T;
}

interface UnequalsOperator<T = All> {
  neq?: T;
}

export type DeepSearchOperator = MinOperator & MaxOperator & EqualsOperator & UnequalsOperator;

export interface DeepSearchParameter {
  [field: string]: DeepSearchOperator | DeepSearchParameter;
}
