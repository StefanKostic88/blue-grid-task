export type NestedObject = { [key: string]: NestedArray | NestedObject };
export type NestedArray = Array<string | NestedObject>;

export interface FinalResult {
  [key: string]: NestedObject | NestedArray;
}
