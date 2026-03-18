console.log('Hello, world!');
console.log('Hello, world!');
const a = 1;

export interface ICore {
  a: number;
  b: string;
  c: number;
}

export const b = '1';
export const c = 5;

export const core: ICore = {
  a,
  b,
  c,
};
