import Airtable from 'airtable';

const apiKey = process.env.AIRTABLE_API_KEY;
const baseId = process.env.AIRTABLE_BASE_ID;

if (!apiKey || !baseId) {
  throw new Error("Environment variables AIRTABLE_API_KEY or AIRTABLE_BASE_ID are not defined");
}

export const base = new Airtable({ apiKey }).base(baseId);
