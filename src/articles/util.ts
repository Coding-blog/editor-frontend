export function isHttps(link: string) {
  return link.startsWith('https://');
}

export function ensureHttps(link: string, allowEmpty = true) {
  if (!isHttps(link)) {
    if (allowEmpty && link.length === 0) { return link; }
    if ('https://'.startsWith(link)) { return ''; }

    return 'https://' + link;
  } else { return link; }
}

export function isURL(link: string) {
  return /https:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/
    .test(link);
}
