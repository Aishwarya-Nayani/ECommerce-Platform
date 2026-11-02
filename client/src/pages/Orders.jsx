import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, Check, Heart, PackageCheck, PackageOpen, ShoppingBag, Sparkles, Truck } from 'lucide-react';
import API from '../api/client';

const statusStyles = (status) => {
  const normalized = status?.toLowerCase();
  if (['delivered', 'completed'].includes(normalized)) {
    return 'bg-emerald-50 text-emerald-800';
  }
  if (['cancelled', 'canceled', 'refunded'].includes(normalized)) {
    return 'bg-rose-50 text-rose-800';
  }
  return 'bg-[var(--color-rose)] text-[var(--color-cherry)]';
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    API.get('/orders')
      .then((res) => {
        if (active) setOrders(res.data);
      })
      .catch(() => {
        if (active) setError('We couldn’t load your orders. Please try again.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const totalSpent = orders.reduce((total, order) => total + (Number(order.totalAmount) || 0), 0);

  return (
    <div className="min-h-[calc(100vh-7.25rem)] bg-[#fbf9f7]">
      <div className="mx-auto max-w-[1180px] px-4 pb-16 pt-8 sm:px-8 sm:pt-12 lg:px-12">
        <div className="relative overflow-hidden rounded-[28px] bg-[var(--color-cherry)] px-6 py-8 text-white sm:px-10 sm:py-10">
          <div className="absolute -right-12 -top-20 h-56 w-56 rounded-full border border-white/15" />
          <div className="absolute -bottom-28 right-24 h-52 w-52 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex flex-col justify-between gap-7 sm:flex-row sm:items-end">
            <div>
              <p className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#edc9c7]">
                <Sparkles className="h-3.5 w-3.5" /> Made for everyday living
              </p>
              <h1 className="mt-3 font-serif text-4xl font-medium tracking-[-0.04em] sm:text-5xl">Your considered finds</h1>
              <p className="mt-3 max-w-lg text-sm leading-6 text-white/75">A little home for everything you’ve chosen, all in one place.</p>
            </div>
            {!loading && !error && orders.length > 0 && (
              <div className="flex gap-3">
                <div className="min-w-28 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-white/65">Orders</p>
                  <p className="mt-1 font-serif text-2xl">{orders.length}</p>
                </div>
                <div className="min-w-32 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-white/65">Together</p>
                  <p className="mt-1 font-serif text-2xl">${totalSpent.toFixed(2)}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8">
          {error && (
            <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800">{error}</div>
          )}

          {loading && (
            <div className="space-y-5" aria-label="Loading orders">
              {Array.from({ length: 2 }, (_, index) => (
                <div key={index} className="h-56 animate-pulse rounded-3xl bg-white shadow-sm" />
              ))}
            </div>
          )}

          {!loading && !error && orders.length === 0 && (
            <div className="rounded-[28px] border border-[#eee6e1] bg-white px-6 py-16 text-center shadow-[0_12px_40px_rgba(74,34,37,0.04)] sm:py-20">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-rose)] text-[var(--color-cherry)]">
                <PackageOpen className="h-7 w-7" strokeWidth={1.5} />
              </span>
              <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-cherry)]">The story starts here</p>
              <h2 className="mt-2 font-serif text-3xl font-medium tracking-tight text-slate-950">No orders just yet.</h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">When you find something that feels just right, your order details will be waiting here.</p>
              <Link to="/products" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[var(--color-cherry)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[var(--color-cherry-light)]">
                Explore the collection <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="mt-6 inline-flex items-center gap-1.5 text-[11px] text-slate-400"><Heart className="h-3.5 w-3.5 text-[var(--color-cherry)]" /> Thoughtful finds, coming right up.</p>
            </div>
          )}

          {!loading && !error && orders.length > 0 && (
            <section aria-label="Your orders" className="space-y-5">
              <div className="mb-1 flex items-center justify-between">
                <h2 className="font-serif text-xl font-medium text-slate-950">A look back</h2>
                <Link to="/products" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-cherry)] transition hover:text-[var(--color-cherry-light)]">
                  Discover more <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              {orders.map((order) => {
                const itemCount = order.items?.reduce((count, item) => count + (Number(item.quantity) || 0), 0) || 0;
                return (
                  <article key={order.id} className="overflow-hidden rounded-3xl border border-[#eee6e1] bg-white shadow-[0_12px_40px_rgba(74,34,37,0.04)]">
                    <div className="flex flex-col justify-between gap-4 border-b border-[#eee6e1] bg-[#fdfcfb] px-5 py-5 sm:flex-row sm:items-center sm:px-7">
                      <div className="flex items-center gap-3.5">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-rose)] text-[var(--color-cherry)]">
                          <PackageCheck className="h-5 w-5" strokeWidth={1.6} />
                        </span>
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">Order #{order.id}</p>
                          <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                            <CalendarDays className="h-3.5 w-3.5" />
                            {new Date(order.orderDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] ${statusStyles(order.status)}`}>
                        {['delivered', 'completed'].includes(order.status?.toLowerCase()) ? <Check className="h-3 w-3" /> : <Truck className="h-3 w-3" />}
                        {order.status}
                      </span>
                    </div>

                    <div className="px-5 py-5 sm:px-7">
                      <div className="mb-4 flex items-center justify-between">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">{itemCount} {itemCount === 1 ? 'piece' : 'pieces'} picked with care</p>
                        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-slate-400">{order.paymentMethod}</p>
                      </div>
                      <div className="divide-y divide-[#f1ece8]">
                        {order.items?.map((item, index) => (
                          <div key={`${item.productId}-${index}`} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                            <div className="flex min-w-0 items-center gap-3">
                              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-stone)] text-[var(--color-cherry)]">
                                <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
                              </span>
                              <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-slate-800">{item.productTitle}</p>
                                <p className="mt-0.5 text-[11px] text-slate-400">Quantity {item.quantity}</p>
                              </div>
                            </div>
                            <span className="shrink-0 text-sm font-medium text-slate-700">${Number(item.subtotal || 0).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-5 flex items-center justify-between border-t border-[#eee6e1] pt-4">
                        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Total paid</span>
                        <span className="font-serif text-xl font-medium text-[var(--color-cherry)]">${Number(order.totalAmount || 0).toFixed(2)}</span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
