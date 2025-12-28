import 'dotenv/config';

import { web } from './web.js';
const configManager = {
  web,
};

export function getConfig<T = unknown>(path: string): T {
  const keys = path.split('.');
  const config = keys.reduce((acc: any, key) => {
    if (acc == null || !(key in acc)) {
      throw new Error(`config ${path} not found`);
    }
    return acc[key];
  }, configManager);

  return config as T;
}
