export type OptionValue = string | number | undefined;

export interface Option<T extends OptionValue> {
  label: string;
  value: T;
}
