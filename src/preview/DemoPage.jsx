import { SECTION_ORDER } from '../config/schema'
import { resolveSection } from '../registry/sections'
import { ContentContext } from '../content/context'
import { DEFAULT_CONTENT } from '../content/defaults'
import { useStructure } from './PreviewCanvas'
import { Nav, Footer } from './Chrome'

export function DemoPage({ content = DEFAULT_CONTENT }) {
  const { sections, sectionOrder } = useStructure()
  const order = sectionOrder?.length ? sectionOrder : SECTION_ORDER

  return (
    <ContentContext.Provider value={content}>
      <div className="db-page">
        <Nav />
        <main>
          {order.map((type) => {
            const Cmp = resolveSection(type, sections[type])
            return Cmp ? <Cmp key={type} /> : null
          })}
        </main>
        <Footer />
      </div>
    </ContentContext.Provider>
  )
}
