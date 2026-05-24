const DEFAULT_IMAGE_BASE = 'https://img.ophim.live';

const normalizeImageBase = (base) => {
  if (!base) {
    return DEFAULT_IMAGE_BASE;
  }
  return base.replace('img.ophim1.com', 'img.ophim.live');
};

export function getImageBase() {
  return normalizeImageBase(process.env.NEXT_PUBLIC_IMAGE_BASE || DEFAULT_IMAGE_BASE);
}

export function getImageUrl(path = '') {
  if (!path) {
    return getImageBase();
  }
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return normalizeImageBase(path);
  }
  const base = getImageBase();
  const trimmedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const trimmedPath = path.startsWith('/') ? path : `/${path}`;
  return `${trimmedBase}${trimmedPath}`;
}
