import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Menu, X, Bell, Mail, User, ShoppingCart, LogOut, ChevronDown, GraduationCap } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/docs/ThemeToggle'
import { StreakWidget } from '@/components/streaks/StreakWidget'

interface NavbarProps {
  user?: {
    name: string
    email: string
    avatar?: string
  } | null
  notifications_count?: number
  streak_days?: number
  cart_items?: number
  on_logout?: () => void
}

export function Navbar({
  user,
  notifications_count = 0,
  streak_days = 0,
  cart_items = 0,
  on_logout
}: NavbarProps) {
  const { t } = useTranslation()
  const [mobile_open, set_mobile_open] = useState(false)
  const location = useLocation()

  const NAV_LINKS = [
    { href: '/tests', label: t('nav.tests') },
    { href: '/myspace/account', label: t('nav.my_space') },
    { href: '/design-system', label: t('nav.design_system') },
  ]

  const is_active = (href: string) => location.pathname.startsWith(href)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <div className="max-w-6xl mx-auto">
        <div
          className="backdrop-blur-xl rounded-2xl border border-border/30 shadow-lg shadow-black/5 bg-background/75 dark:bg-background/60"
        >
          <div className="px-4 sm:px-6">
            <div className="flex items-center justify-between h-14">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center group-hover:bg-violet-700 transition-colors">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div className="hidden sm:block">
                  <span className="font-bold text-lg text-foreground">Postal3</span>
                  <span className="block text-[10px] text-muted-foreground -mt-1 font-medium tracking-wide">ACADEMIA</span>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={cn(
                      'px-4 py-2 text-sm font-medium transition-colors relative',
                      is_active(link.href)
                        ? 'text-violet-600 dark:text-violet-400'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {link.label}
                    {is_active(link.href) && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-violet-600 dark:bg-violet-400 rounded-full" />
                    )}
                  </Link>
                ))}
              </div>

              {/* Right side actions */}
              <div className="hidden md:flex items-center gap-1">
                {/* Theme Toggle */}
                <ThemeToggle className="rounded-xl border-0 text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10" />

                {/* Streak Widget */}
                {user && streak_days > 0 && (
                  <StreakWidget days={streak_days} next_milestone_days={14} />
                )}

                {/* Notifications */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="relative p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                      <Bell className="h-5 w-5" />
                      {notifications_count > 0 && (
                        <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-background" />
                      )}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-72 rounded-xl p-2">
                    <div className="px-3 py-2 text-sm font-semibold text-foreground">
                      {t('notifications.title')}
                      {notifications_count > 0 && (
                        <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400">
                          {notifications_count}
                        </span>
                      )}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                      <Link to="/myspace/alerts" className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-muted-foreground" />
                        {t('notifications.view_all')}
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Contact */}
                <a
                  href="mailto:info@testoposiciones.es"
                  className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                >
                  <Mail className="h-5 w-5" />
                </a>

                {/* Cart */}
                {cart_items > 0 && (
                  <Link
                    to="/cart"
                    className="relative p-2 rounded-xl text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/30 transition-colors"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold bg-violet-600 text-white rounded-full px-1">
                      {cart_items}
                    </span>
                  </Link>
                )}

                {/* Divider */}
                <div className="w-px h-6 bg-border mx-2" />

                {/* User Menu */}
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-muted transition-colors">
                        <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-sm font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-foreground hidden lg:block max-w-[120px] truncate">
                          {user.name}
                        </span>
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 rounded-xl p-2">
                      <div className="px-3 py-2">
                        <p className="text-sm font-semibold text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                        <Link to="/myspace" className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          {t('user_menu.my_space')}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={on_logout}
                        className="rounded-lg cursor-pointer text-rose-600 focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950/30"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        {t('actions.logout')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex items-center gap-3">
                    <Link
                      to="/login"
                      className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {t('actions.login')}
                    </Link>
                    <Link
                      to="/register"
                      className="px-4 py-2 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors"
                    >
                      {t('actions.register')}
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <div className="flex items-center gap-1 md:hidden">
                <ThemeToggle className="rounded-xl border-0 text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10" />
                <button
                  className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                  onClick={() => set_mobile_open(!mobile_open)}
                >
                  {mobile_open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div
            className={cn(
              "md:hidden overflow-hidden transition-all duration-300 ease-out",
              mobile_open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            )}
          >
            <div className="px-4 pb-4 pt-2 border-t border-border">
              <div className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={cn(
                      'px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      is_active(link.href)
                        ? 'bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 font-semibold'
                        : 'text-muted-foreground hover:bg-muted'
                    )}
                    onClick={() => set_mobile_open(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="border-t border-border mt-3 pt-3">
                {user ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-3 px-4 py-2">
                      <div className="w-9 h-9 rounded-full bg-violet-600 flex items-center justify-center text-white text-sm font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <Link
                      to="/myspace"
                      className="block px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted"
                      onClick={() => set_mobile_open(false)}
                    >
                      {t('user_menu.my_space')}
                    </Link>
                    <button
                      onClick={() => {
                        on_logout?.()
                        set_mobile_open(false)
                      }}
                      className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    >
                      {t('actions.logout')}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 px-2">
                    <Link
                      to="/register"
                      className="py-2.5 text-center text-sm font-semibold text-white bg-violet-600 rounded-lg"
                      onClick={() => set_mobile_open(false)}
                    >
                      {t('actions.register')}
                    </Link>
                    <Link
                      to="/login"
                      className="py-2.5 text-center text-sm font-medium text-muted-foreground rounded-lg border border-border hover:bg-muted"
                      onClick={() => set_mobile_open(false)}
                    >
                      {t('actions.login')}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
