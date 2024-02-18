import { regexps } from '@/constants/regexps.js';

export function extractPathWithoutExtension(url, isAt) {
  const match = url.match(regexps.EXTRACT_PATH_WITHOUT_EXTENSION);
  return match ? (isAt ? `@${match[1]}` : match[1]) : null;
}
