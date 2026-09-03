import { HeroSplit, HeroCentered, HeroImage } from '../preview/sections/Hero'
import { FeatureGrid, FeatureRows, FeatureBento } from '../preview/sections/Features'
import { CarouselPeek, CarouselCards, CarouselFull } from '../preview/sections/Carousel'
import { TestimonialQuote, TestimonialGrid } from '../preview/sections/Testimonial'
import { CtaBoxed, CtaBanner } from '../preview/sections/Cta'

// Maps a section type + variant id to its component. The keys here must match
// SECTION_META in options.js and the DEFAULT_CONFIG variants.
export const SECTION_REGISTRY = {
  hero: { split: HeroSplit, centered: HeroCentered, image: HeroImage },
  features: { grid: FeatureGrid, rows: FeatureRows, bento: FeatureBento },
  carousel: { peek: CarouselPeek, cards: CarouselCards, full: CarouselFull },
  testimonial: { quote: TestimonialQuote, grid: TestimonialGrid },
  cta: { boxed: CtaBoxed, banner: CtaBanner },
}

export function resolveSection(type, variant) {
  const group = SECTION_REGISTRY[type]
  if (!group) return null
  return group[variant] ?? Object.values(group)[0]
}
