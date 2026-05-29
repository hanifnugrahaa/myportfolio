/** Swiper `loop` butuh cukup slide; kalau tidak, pakai `rewind` agar tidak ada warning. */
export function getSwiperLoopSettings(slideCount: number) {
  const canLoop = slideCount >= 6;
  return {
    loop: canLoop,
    rewind: !canLoop,
  };
}
