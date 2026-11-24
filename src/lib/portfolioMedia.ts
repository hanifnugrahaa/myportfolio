import type { PortfolioMedia, PortfolioMediaFields } from '../data';

export function getPortfolioMedia(post: PortfolioMediaFields): PortfolioMedia[] {
  if (Array.isArray(post.media)) {
    const slides = post.media.filter(isPortfolioMedia);
    if (slides.length) return slides;
  }
  if (typeof post.imageUrl !== 'string' || !post.imageUrl) return [];
  return [{
    url: post.imageUrl,
    type: /\.(mp4|webm|mov)(?:[?#]|$)/i.test(post.imageUrl) ? 'video' : 'image',
  }];
}

function isPortfolioMedia(value: unknown): value is PortfolioMedia {
  if (typeof value !== 'object' || value === null || !('url' in value) || !('type' in value)) return false;
  return typeof value.url === 'string' && value.url.length > 0 && (value.type === 'image' || value.type === 'video');
}

export const maxMediaCount = 10;

export function parseMediaUrl(value: string): string | null {
  try {
    const url = new URL(value.trim());
    return url.protocol === 'https:' && !url.username && !url.password && url.href.length <= 2048 ? url.href : null;
  } catch {
    return null;
  }
}

export function moveMedia<T>(items: T[], index: number, offset: number): T[] {
  const destination = index + offset;
  if (index < 0 || index >= items.length || destination < 0 || destination >= items.length) return items;
  const reordered = [...items];
  [reordered[index], reordered[destination]] = [reordered[destination], reordered[index]];
  return reordered;
}
