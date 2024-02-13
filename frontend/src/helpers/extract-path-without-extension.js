import { regexps } from '@/constants/regexps.js';

export function extractPathWithoutExtension(url) {
  const match = url.match(regexps.EXTRACT_PATH_WITHOUT_EXTENSION);
  return match ? match[1] : null;
}
