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

export type UsecaseDeepSearchOperator = MinOperator & MaxOperator & EqualsOperator & UnequalsOperator;

export interface UsecaseDeepSearchParameter {
  [field: string]: UsecaseDeepSearchOperator | UsecaseDeepSearchParameter;
}
