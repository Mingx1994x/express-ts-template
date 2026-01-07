import { configManager } from '../config/index.js';
import { getSheetsClient } from './getSheetClient.js';
import { appendRow, normalizeRows } from '../utils/normalizeSheets.js';

import type { TSheetsClient } from '../types/sheets.js';

/**
 * Reuse the Google Sheets client so we do not re-authenticate on every request.
 */

const SHEET_ID = configManager.sheets.spreadsheet_id;

type TCategory = {
  id: string;
  name: string;
  color_hex: string;
};

const CATEGORY_SHEET_RANGE =
  process.env.GOOGLE_CATEGORY_RANGE || "'categories'!A:C";
const CATEGORY_COLUMNS = ['id', 'name', 'color_hex'] as const;
const DEFAULT_CATEGORY: TCategory = {
  id: '0',
  name: '未分類',
  color_hex: '#9E9E9E',
};

const normalizeCategoryId = (value: unknown) => (value ?? '').toString().trim();

const initializeCategorySheet = async (sheets: TSheetsClient) => {
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: CATEGORY_SHEET_RANGE,
    valueInputOption: 'RAW',
    requestBody: {
      values: [
        [...CATEGORY_COLUMNS],
        CATEGORY_COLUMNS.map((key) => DEFAULT_CATEGORY[key] || ''),
      ],
    },
  });
};

// google sheet categories CRUD
export const getCategoryRows = async () => {
  const sheets = getSheetsClient();
  const response = await sheets.spreadsheets.values
    .get({
      spreadsheetId: SHEET_ID,
      range: CATEGORY_SHEET_RANGE,
    })
    .catch((error) => {
      if (error.code === 400 || error.code === 404) {
        return { data: { values: [] } };
      }
      throw error;
    });

  // return response.data;

  const rawValues = response.data.values || [];
  if (rawValues.length === 0) {
    await initializeCategorySheet(sheets);
    return [{ ...DEFAULT_CATEGORY }];
  }

  const categories = normalizeRows<TCategory>(rawValues, CATEGORY_COLUMNS).map(
    (category) => ({
      ...category,
      id: normalizeCategoryId(category.id),
    })
  );

  const hasDefault = categories.some(
    (row) =>
      normalizeCategoryId(row.id) === normalizeCategoryId(DEFAULT_CATEGORY.id)
  );

  if (!hasDefault) {
    await appendRow<TCategory>(
      sheets,
      CATEGORY_SHEET_RANGE,
      CATEGORY_COLUMNS,
      DEFAULT_CATEGORY
    );
    categories.push({ ...DEFAULT_CATEGORY });
  }

  return categories;
};
