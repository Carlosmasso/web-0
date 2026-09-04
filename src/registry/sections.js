import { HeroSplit, HeroCentered, HeroImage } from '../preview/sections/Hero'
import { LogosPlain, LogosHeadline } from '../preview/sections/Logos'
import { FeatureGrid, FeatureRows, FeatureBento } from '../preview/sections/Features'
import { CarouselPeek, CarouselCards, CarouselFull } from '../preview/sections/Carousel'
import { PricingCards, PricingRows } from '../preview/sections/Pricing'
import { TestimonialQuote, TestimonialGrid } from '../preview/sections/Testimonial'
import { FaqAccordion, FaqGrid } from '../preview/sections/Faq'
import { CtaBoxed, CtaBanner } from '../preview/sections/Cta'

// Maps a section type + variant id to its component. The keys here must match
// SECTION_META in options.js and the DEFAULT_CONFIG variants.
export const SECTION_REGISTRY = {
  hero: { split: HeroSplit, centered: HeroCentered, image: HeroImage },
  logos: { plain: LogosPlain, headline: LogosHeadline },
  features: { grid: FeatureGrid, rows: FeatureRows, bento: FeatureBento },
  carousel: { peek: CarouselPeek, cards: CarouselCards, full: CarouselFull },
  pricing: { cards: PricingCards, rows: PricingRows },
  testimonial: { quote: TestimonialQuote, grid: TestimonialGrid },
  faq: { accordion: FaqAccordion, grid: FaqGrid },
  cta: { boxed: CtaBoxed, banner: CtaBanner },
}

export function resolveSection(type, variant) {
  const group = SECTION_REGISTRY[type]
  if (!group) return null
  return group[variant] ?? Object.values(group)[0]
}
