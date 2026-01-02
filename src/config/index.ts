import 'dotenv/config';
import { web } from './web.js';
import { jwt } from './jwt.js';

import type { TConfig } from '../types/config.js';

export const configManager: TConfig = {
  web,
  jwt,
};
