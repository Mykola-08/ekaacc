import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Banner, Head, Search } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'

export const metadata = {
  title: 'Ekaacc Documentation'
}

const navbar = (
  <Navbar
    logo={<span>Ekaacc Documentation</span>}
    projectLink="https://github.com/Mykola-08/ekaacc"
  />
)

const footer = <Footer>MIT {new Date().getFullYear()} © Ekaacc.</Footer>

export default async function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head>
        {/* Your additional tags should be passed as children of <Head> element */}
      </Head>
      <body>
        <Layout
          navbar={navbar}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/Mykola-08/ekaacc/tree/main/apps/docs"
          editLink="Edit this page on GitHub"
          sidebar={{ defaultMenuCollapseLevel: 1 }}
          footer={footer}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
