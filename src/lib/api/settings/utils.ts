
/**
 * Utility functions for settings conversion
 */

import { DisparoOptions, OptionRow } from './types';
import { optionMapping } from './mappings';
import { DEFAULT_OPTIONS } from './types';

/**
 * Converts rows from the AppW_Options table to DisparoOptions object
 */
export function convertRowsToDisparoOptions(rows: OptionRow[]): DisparoOptions {
  // Start with default options
  const options = { ...DEFAULT_OPTIONS };

  rows.forEach(row => {
    const mapping = Object.entries(optionMapping).find(([key]) => key === row.option);
    if (mapping) {
      const [_, { field, key }] = mapping;
      if (field === 'text' && row.text !== null) {
        (options[key] as string) = row.text;
      } else if (field === 'numeric' && row.numeric !== null) {
        (options[key] as number) = row.numeric;
      } else if (field === 'boolean' && row.boolean !== null) {
        (options[key] as boolean) = row.boolean;
      }
    }
  });

  return options;
}

/**
 * Converts a DisparoOptions object to array of updates for the AppW_Options table
 */
export function convertDisparoOptionsToUpdates(options: DisparoOptions): { option: string; updates: Partial<OptionRow> }[] {
  const updateList: { option: string; updates: Partial<OptionRow> }[] = [];
  
  Object.entries(optionMapping).forEach(([optionName, { field, key }]) => {
    const value = options[key];
    const updateObj: Partial<OptionRow> = { option: optionName };
    
    if (field === 'text') {
      updateObj.text = value as string;
    } else if (field === 'numeric') {
      updateObj.numeric = value as number;
    } else if (field === 'boolean') {
      updateObj.boolean = value as boolean;
    }
    
    updateList.push({ option: optionName, updates: updateObj });
  });
  
  return updateList;
}
