import { IBase } from '../base/IBase';
export interface ITemplate extends IBase {
  name: string;
  content: string;
  tags: Array<string>;
}
