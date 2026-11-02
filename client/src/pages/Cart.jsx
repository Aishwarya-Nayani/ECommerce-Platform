import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Heart, MapPin, PackageOpen, ShieldCheck, ShoppingBag, Sparkles, Trash2, Truck } from 'lucide-react';
import API from '../api/client';

const fetchCart = () => API.get('/cart').then((res) => res.data);

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [removingId, setRemovingId] = useState(null);
  const [checkingOut, setCheckingOut] = useState(false);
  const navigate = useNavigate();

  const loadCart = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setCart(await fetchCart());
    } catch {
      setError('We couldn’t load your bag. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    fetchCart()
      .then((items) => {
        if (active) setCart(items);
      })
      .catch(() => {
        if (active) setError('We couldn’t load your bag. Please try again.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const removeItem = async (id) => {
    setRemovingId(id);
    setError('');
    try {
      await API.delete(`/cart/${id}`);
    setCart((current) => current.filter((item) => item.id !== id));
    } catch {
      setError('We couldn’t remove that item. Please try again.');
    } finally {
      setRemovingId(null);
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setCheckingOut(true);
    setError('');
    try {
      await API.post('/orders', { shippingAddress: address, paymentMethod: 'Card' });
      navigate('/orders');
    } catch {
      setError('We couldn’t place your order. Please check your details and try again.');
      setCheckingOut(false);
    }
  };

  const total = cart.reduce((acc, item) => acc + (Number(item.totalPrice) || 0), 0);
  const itemCount = cart.reduce((acc, item) => acc + (Number(item.quantity) || 0), 0);

  return (
    <div className="min-h-[calc(100vh-7.25rem)] bg-[#fbf9f7]">
      <div className="mx-auto max-w-[1180px] px-4 pb-16 pt-8 sm:px-8 sm:pt-12 lg:px-12">
        <div className="relative overflow-hidden rounded-[28px] bg-[#f1e9e3] px-6 py-8 sm:px-10 sm:py-10">
          <div className="absolute -right-12 -top-20 h-56 w-56 rounded-full border border-[var(--color-cherry)]/10" />
          <div className="absolute -bottom-28 right-24 h-52 w-52 rounded-full bg-[#d8c4b8]/40 blur-2xl" />
          <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-cherry)]">
                <Sparkles className="h-3.5 w-3.5" /> A little something for you
              </p>
              <h1 className="mt-3 font-serif text-4xl font-medium tracking-[-0.04em] text-slate-950 sm:text-5xl">Your little edit</h1>
              <p className="mt-3 text-sm text-slate-600">
                {loading ? 'Gathering your finds…' : `${itemCount} ${itemCount === 1 ? 'lovely find' : 'lovely finds'} in your bag`}
              </p>
            </div>
            <Link to="/products" className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--color-cherry)]/20 bg-white/70 px-4 py-2.5 text-xs font-semibold text-[var(--color-cherry)] transition hover:bg-white">
              Keep exploring <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {error && (
          <div role="alert" className="mt-6 flex flex-col justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800 sm:flex-row sm:items-center">
            <p>{error}</p>
            <button type="button" onClick={() => { setLoading(true); setError(''); loadCart(); }} className="w-fit font-semibold underline underline-offset-4">Try again</button>
          </div>
        )}

        {loading ? (
          <div className="mt-8 grid animate-pulse gap-6 lg:grid-cols-[1fr_350px]">
            <div className="h-64 rounded-3xl bg-white shadow-sm" />
            <div className="h-72 rounded-3xl bg-white shadow-sm" />
          </div>
        ) : cart.length === 0 ? (
          <div className="mt-8 rounded-[28px] border border-[#eee6e1] bg-white px-6 py-16 text-center shadow-[0_12px_40px_rgba(74,34,37,0.04)] sm:py-20">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-rose)] text-[var(--color-cherry)]">
              <PackageOpen className="h-7 w-7" strokeWidth={1.5} />
            </span>
            <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-cherry)]">Room for a new favourite</p>
            <h2 className="mt-2 font-serif text-3xl font-medium tracking-tight text-slate-950">Your bag is taking a little breather.</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">When something catches your eye, you can save it here and come back whenever you’re ready.</p>
            <Link to="/products" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[var(--color-cherry)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[var(--color-cherry-light)]">
              Find your next favourite <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="mt-6 inline-flex items-center gap-1.5 text-[11px] text-slate-400"><Heart className="h-3.5 w-3.5 text-[var(--color-cherry)]" /> Thoughtfully picked, just for you.</p>
          </div>
        ) : (
          <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1fr_350px] lg:gap-8">
            <section aria-label="Items in your bag" className="rounded-3xl border border-[#eee6e1] bg-white p-5 shadow-[0_12px_40px_rgba(74,34,37,0.04)] sm:p-7">
              <div className="mb-5 flex items-center justify-between border-b border-[#eee6e1] pb-4">
                <h2 className="font-serif text-xl font-medium text-slate-950">The good things</h2>
                <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">{cart.length} {cart.length === 1 ? 'item' : 'items'}</span>
              </div>
              <div className="divide-y divide-[#eee6e1]">
                {cart.map((item) => (
                  <article key={item.id} className="flex items-center gap-4 py-5 first:pt-1 last:pb-1 sm:gap-5">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-stone)] text-[var(--color-cherry)] sm:h-20 sm:w-20">
                      <ShoppingBag className="h-7 w-7" strokeWidth={1.4} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-semibold text-slate-900">{item.productTitle}</h3>
                      <p className="mt-1 text-xs text-slate-500">${Number(item.unitPrice || 0).toFixed(2)} <span className="px-1 text-slate-300">·</span> Qty {item.quantity}</p>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        disabled={removingId === item.id}
                        className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-400 transition hover:text-[var(--color-cherry)] disabled:opacity-50"
                      >
                        <Trash2 className="h-3 w-3" /> {removingId === item.id ? 'Removing…' : 'Remove'}
                      </button>
                    </div>
                    <span className="shrink-0 text-sm font-semibold text-slate-900">${Number(item.totalPrice || 0).toFixed(2)}</span>
                  </article>
                ))}
              </div>
            </section>

            <form onSubmit={handleCheckout} className="rounded-3xl border border-[#eee6e1] bg-white p-5 shadow-[0_12px_40px_rgba(74,34,37,0.06)] sm:p-7 lg:sticky lg:top-28">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-cherry)]">All the details</p>
              <h2 className="mt-2 font-serif text-2xl font-medium text-slate-950">A little summary</h2>
              <div className="mt-5 space-y-3 border-b border-[#eee6e1] pb-5 text-sm">
                <p className="flex justify-between text-slate-500"><span>Items ({itemCount})</span><span className="font-medium text-slate-700">${total.toFixed(2)}</span></p>
                <p className="flex items-center justify-between text-slate-500"><span className="inline-flex items-center gap-1.5"><Truck className="h-3.5 w-3.5" /> Delivery</span><span className="text-xs font-medium text-[var(--color-cherry)]">On us</span></p>
              </div>
              <p className="mt-4 flex items-center justify-between text-sm font-semibold text-slate-900"><span>Total</span><span className="text-xl">${total.toFixed(2)}</span></p>
              <label htmlFor="shipping-address" className="mt-6 block text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">Where should we send it?</label>
              <div className="relative mt-2">
                <MapPin className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <textarea
                  id="shipping-address"
                  placeholder="Your shipping address"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="min-h-24 w-full resize-y rounded-xl border border-[#e9e1dd] bg-[#fdfcfb] py-3 pl-10 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[var(--color-cherry)] focus:ring-2 focus:ring-[var(--color-rose)]"
                  rows="3"
                />
              </div>
              <button type="submit" disabled={checkingOut} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-cherry)] px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-white shadow-lg shadow-[var(--color-cherry)]/15 transition hover:-translate-y-0.5 hover:bg-[var(--color-cherry-light)] disabled:cursor-wait disabled:opacity-60">
                {checkingOut ? 'Placing your order…' : 'Complete your order'} <ArrowRight className="h-4 w-4" />
              </button>
              <p className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-slate-400"><ShieldCheck className="h-3.5 w-3.5 text-[var(--color-cherry)]" /> Your details are in good hands.</p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
