function sanitize(p) {
  let cleaned = p.replace(/\D/g, '');
  if (cleaned.length === 10) return '91' + cleaned;
  return cleaned;
}
console.log(sanitize(' 98765 43210 '));
console.log(sanitize('+1 555-1234'));
