import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Home, Mail, Phone, Facebook, Instagram } from 'lucide-react'

interface FooterProps {
  company?: {
    name: string
    address: string
    city: string
    zip: string
    country: string
    email: string
    phone: string
  }
}

const DEFAULT_COMPANY = {
  name: 'TestOposiciones',
  address: 'Dirección de la empresa',
  city: 'Ciudad',
  zip: '00000',
  country: 'España',
  email: 'info@testoposiciones.es',
  phone: '+34 000 000 000',
}

const SOCIAL_LINKS = [
  { href: 'https://facebook.com', icon: Facebook, label: 'Facebook' },
  { href: 'https://instagram.com', icon: Instagram, label: 'Instagram' },
]

export function Footer({ company = DEFAULT_COMPANY }: FooterProps) {
  const { t } = useTranslation()
  const current_year = new Date().getFullYear()

  const QUICK_LINKS = [
    { href: '/about', label: t('footer.about_us') },
    { href: '/privacy', label: t('footer.privacy') },
    { href: '/cookies', label: t('footer.cookies') },
    { href: '/legal', label: t('footer.legal') },
  ]

  return (
    <footer className="border-t-[3px] border-border/20 pt-8 mt-8">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h5 className="font-bold uppercase mb-4">{t('footer.about_us')}</h5>
            <p className="text-muted-foreground text-sm mb-4">
              {t('footer.owned_by', { name: company.name })}
            </p>
            <p className="text-muted-foreground text-sm">
              {t('footer.follow_us')}
            </p>
          </div>

          {/* Company Info */}
          <div>
            <h5 className="font-bold uppercase mb-4">{company.name}</h5>

            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <Home className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="text-muted-foreground">
                  {company.address}
                  <br />
                  {company.city}, {company.zip}, {company.country}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <a
                  href={`mailto:${company.email}`}
                  className="text-foreground hover:text-primary transition-colors"
                >
                  {company.email}
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <a
                  href={`tel:${company.phone}`}
                  className="text-foreground hover:text-primary transition-colors"
                >
                  {company.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-bold uppercase mb-4">{t('footer.quick_links')}</h5>
            <ul className="space-y-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.href} className="border-b border-border/20 pb-2">
                  <Link
                    to={link.href}
                    className="text-sm text-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-4 mb-8">
          {SOCIAL_LINKS.map((social) => (
            <a
              key={social.href}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 hover:bg-violet-200 dark:hover:bg-violet-900/50 transition-colors"
              title={social.label}
            >
              <social.icon className="w-6 h-6" />
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div className="text-center py-4 border-t text-sm text-muted-foreground">
          © 2020 - {current_year}{' '}
          <Link to="/about" className="hover:text-primary transition-colors">
            {company.name}
          </Link>
        </div>
      </div>
    </footer>
  )
}
