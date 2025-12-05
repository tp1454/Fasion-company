import DOMPurify from 'dompurify';

export function sanitizeHtml(html) {
  if (!html || typeof html !== 'string') return '';
  return DOMPurify.sanitize(html, { ALLOWED_TAGS: false });
}

export function stripHtml(html) {
  if (!html || typeof html !== 'string') return '';
  // sanitize first to remove scripts/styles
  const clean = DOMPurify.sanitize(html);
  const tmp = document.createElement('div');
  tmp.innerHTML = clean;
  return tmp.textContent || tmp.innerText || '';
}
