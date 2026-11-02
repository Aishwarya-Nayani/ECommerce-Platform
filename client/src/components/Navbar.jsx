import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, User, LogOut, Package, ArrowUpRight, Compass } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 text-[var(--color-ink)]">
      <div className="flex h-8 items-center justify-center bg-[var(--color-cherry)] px-4 text-center text-[9px] font-medium uppercase tracking-[0.16em] text-white sm:text-[10px]">
        Thoughtful finds for everyday living <span className="mx-2 text-white/50">·</span> Welcome to Pulse
      </div>
      <div className="border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[4.25rem] max-w-[1440px] items-center justify-between px-4 sm:px-8 lg:px-12">
        <Link to="/" className="group flex items-center gap-2.5 text-xl font-semibold tracking-[-0.06em] transition hover:text-[var(--color-cherry)] sm:text-2xl">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-cherry)] font-serif text-base font-normal tracking-normal text-white transition group-hover:rotate-[-8deg]">P</span>
          <span>Pulse<span className="font-normal">Commerce</span></span>
        </Link>

        <nav aria-label="Main navigation" className="flex items-center gap-2 text-sm sm:gap-3">
          <Link to="/products" className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-[var(--color-rose)] hover:text-[var(--color-cherry)] sm:inline-flex">
            <Compass className="h-4 w-4" /> Discover
          </Link>
          {isAdmin && (
            <Link to="/admin" className="rounded-full px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-[var(--color-rose)] hover:text-[var(--color-cherry)]">
              Admin Panel
            </Link>
          )}
          {user ? (
            <>
              <Link to="/orders" className="flex items-center gap-1.5 rounded-full px-3 py-2 text-slate-600 transition hover:bg-[var(--color-rose)] hover:text-[var(--color-cherry)] font-semibold">
                <Package className="h-4 w-4" /> <span className="hidden sm:inline">Orders</span>
              </Link>
              <Link to="/cart" className="flex items-center gap-1.5 rounded-full px-3 py-2 text-slate-600 transition hover:bg-[var(--color-rose)] hover:text-[var(--color-cherry)] font-semibold">
                <ShoppingCart className="h-4 w-4" /> <span className="hidden sm:inline">Cart</span>
              </Link>
              <button
                onClick={() => { logout(); navigate('/login'); }}
                className="flex items-center gap-1.5 rounded-full px-3 py-2 text-slate-600 transition hover:bg-[var(--color-rose)] hover:text-[var(--color-cherry)] font-semibold"
                aria-label={`Log out ${user.fullName?.split(' ')[0] || 'User'}`}
              >
                <LogOut className="h-4 w-4" /> <span className="hidden md:inline">Log out</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="flex items-center gap-2 rounded-full px-3 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-[var(--color-rose)] hover:text-[var(--color-cherry)]">
                <User className="h-4 w-4 sm:hidden" /> <span className="hidden sm:inline">Sign in</span>
              </Link>
              <Link to="/register" className="flex items-center gap-2 rounded-full bg-[var(--color-cherry)] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[var(--color-cherry-light)]">
                <span className="sm:hidden">Join</span><span className="hidden sm:inline">Create account</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </>
          )}
        </nav>
        </div>
      </div>
    </header>
  );
}