import { IBaseFilter } from '../base/IBaseFilter';

export interface ITemplateFilter extends IBaseFilter {
  name: string;
  content: string;
  tags?: Array<string>;
}
