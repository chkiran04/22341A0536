import { withLogging } from "./logger/withLogging";
import { randomCode, isAlnum } from "../utils/base62";

const KEY = "__urls__";

function readAll() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
function writeAll(list) { localStorage.setItem(KEY, JSON.stringify(list)); }
function findByCode(code) { return readAll().find(u => u.code === code) || null; }
function isUniqueCode(code) { return !findByCode(code); }
function ensureUniqueCode(baseLen = 6, maxTry = 50) {
  let attempt = 0;
  while (attempt < maxTry) {
    const code = randomCode(baseLen + Math.floor(attempt / 10));
    if (isUniqueCode(code)) return code;
    attempt++;
  }
  throw new Error("Unable to generate unique shortcode, Please check");
}
function isExpired(item) {
  return Date.now() > (new Date(item.createdAt).getTime() + item.ttlMinutes * 60 * 1000);
}

async function _createOne({ longUrl, ttlMinutes, customCode }) {
  if (!longUrl || typeof longUrl !== "string") throw new Error("Longest URL required");
  try { 
    new URL(longUrl); 
}
    catch { 
        throw new Error("Invalid URL format, Please enter the correct url");
     }
  const ttl = Number.isInteger(ttlMinutes) && ttlMinutes > 0 ? ttlMinutes : 30;

  let code;
  if (customCode && customCode.trim()) {
    const cc = customCode.trim();
    if (cc.length < 4 || cc.length > 32) throw new Error("Custom code must be 4-32 chars");
    if (!isAlnum(cc)) throw new Error("Custom code must be alphanumeric");
    if (!isUniqueCode(cc)) throw new Error("Custom code already in use");
    code = cc;
  } else {
    code = ensureUniqueCode();
  }

  const item = {
    id: crypto.randomUUID?.() ?? String(Date.now()) + Math.random(),
    code,
    longUrl,
    ttlMinutes: ttl,
    createdAt: new Date().toISOString(),
    clicks: 0
  };
  const all = readAll();
  all.push(item);
  writeAll(all);
  return item;
}
async function _createBatch(entries) {
  if (!Array.isArray(entries)) throw new Error("Arrays required for entry");
  if (entries.length === 0) throw new Error("Minimum one URL required");
  if (entries.length > 5) throw new Error("Atmost 5 URLs at once");

  const results = [];
  const errors = [];
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    try {
      const created = await _createOne(e);
      results.push(created);
    } catch (err) {
      errors.push({ index: i, error: String(err?.message || err) });
    }
  }
  return { success: results, errors };
}

async function _getByCode(code) {
  const item = findByCode(code);
  if (!item) return null;
  return { ...item, expired: isExpired(item) };
}

async function _incrementClick(code) {
  const all = readAll();
  const idx = all.findIndex(u => u.code === code);
  if (idx === -1) return null;
  all[idx].clicks += 1;
  writeAll(all);
  return { ...all[idx], expired: isExpired(all[idx]) };
}

async function _listAll() {
  return readAll().map(x => ({ ...x, expired: isExpired(x) })).sort((a,b) => new Date(b.createdAt)-new Date(a.createdAt));
}

export const urlService = {
  createBatch: withLogging(_createBatch, { op: "createBatch" }),
  getByCode: withLogging(_getByCode, { op: "getByCode" }),
  incrementClick: withLogging(_incrementClick, { op: "incrementClick" }),
  listAll: withLogging(_listAll, { op: "listAll" })
};
