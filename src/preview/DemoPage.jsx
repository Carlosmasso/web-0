import { SECTION_ORDER } from '../config/schema'
import { resolveSection } from '../registry/sections'
import { ContentContext } from '../content/context'
import { DEFAULT_CONTENT } from '../content/defaults'
import { Nav, Footer } from './Chrome'

export function DemoPage({ config, content = DEFAULT_CONTENT }) {
  return (
    <ContentContext.Provider value={content}>
      <div className="db-page">
        <Nav config={config} />
        <main>
          {SECTION_ORDER.map((type) => {
            const Cmp = resolveSection(type, config.sections[type])
            return Cmp ? <Cmp key={type} config={config} /> : null
          })}
        </main>
        <Footer />
      </div>
    </ContentContext.Provider>
  )
}
