import { Helmet } from 'react-helmet-async'
import getProfile from '../../content/profile'
import { useDashboard } from '../../context/DashboardContext'

export default function SEO({ title, description, path = '' }) {
  const { profileData } = useDashboard()
  const profile = profileData || getProfile()
  const seo = profile.seo
  const fullTitle = title ? `${title} | ${seo.title}` : seo.title
  const desc = description || seo.description
  const url = `${seo.siteUrl}${path}`
  const image = seo.ogImage

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta name="keywords" content={seo.keywords.join(', ')} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={seo.title} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={image} />
      {seo.twitterHandle && <meta name="twitter:site" content={seo.twitterHandle} />}
      {seo.twitterHandle && <meta name="twitter:creator" content={seo.twitterHandle} />}

      {/* Canonical */}
      <link rel="canonical" href={url} />

      {/* Schema.org - Person */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: profile.name,
          alternateName: profile.firstName,
          url: seo.siteUrl,
          jobTitle: profile.role,
          email: profile.email,
          knowsAbout: ['Java', 'Spring Boot', 'MySQL', 'REST APIs', 'Backend Development'],
          sameAs: [
            profile.socials.github?.url,
            profile.socials.leetcode?.url,
            profile.socials.linkedin?.url,
          ].filter(Boolean),
        })}
      </script>

      {/* Prefetch key routes */}
      <link rel="prefetch" href="/admin/geca" />
    </Helmet>
  )
}
