import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Minus, Package, Plus, ShieldCheck, ShoppingBag, Truck } from 'lucide-react';
import API from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function ProductDetail() {
  const { id } = useParams();
  const [productResult, setProductResult] = useState({ id: null, product: null, error: '' });
  const [qty, setQty] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const loading = productResult.id !== id;
  const product = loading ? null : productResult.product;
  const error = loading ? '' : productResult.error;

  useEffect(() => {
    let active = true;

    API.get(`/products/${id}`)
      .then((res) => {
        if (active) {
          setProductResult({ id, product: res.data, error: '' });
          setQty(1);
        }
      })
      .catch(() => {
        if (active) {
          setProductResult({
            id,
            product: null,
            error: 'We couldn’t find this product. It may have been removed.',
          });
        }
      });

    return () => {
      active = false;
    };
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setAddingToCart(true);
    try {
      await API.post('/cart/add', { productId: product.id, quantity: qty });
      navigate('/cart');
    } catch {
      setProductResult((current) => ({
        ...current,
        error: 'We couldn’t add this item to your cart. Please try again.',
      }));
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid animate-pulse gap-10 lg:grid-cols-2">
          <div className="aspect-square rounded-3xl bg-slate-200" />
          <div className="space-y-5 py-8">
            <div className="h-4 w-28 rounded bg-slate-200" />
            <div className="h-10 w-3/4 rounded bg-slate-200" />
            <div className="h-8 w-32 rounded bg-slate-200" />
            <div className="h-24 rounded bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <Package className="mx-auto h-10 w-10 text-slate-300" />
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Product unavailable</h1>
        <p role="alert" className="mt-2 text-slate-500">{error}</p>
        <Link to="/products" className="mt-6 inline-flex items-center gap-2 font-semibold text-[var(--color-cherry)] hover:text-[var(--color-cherry-light)]">
          <ArrowLeft className="h-4 w-4" /> Back to products
        </Link>
      </div>
    );
  }

  const stock = Math.max(0, Number(product.stockQuantity) || 0);
  const inStock = stock > 0;
  const price = Number(product.price || 0);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white">
      <div className="mx-auto max-w-[1440px] px-4 pb-16 pt-5 sm:px-8 sm:pt-7 lg:px-12">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.14em] text-slate-400 sm:mb-8">
          <Link to="/products" className="transition hover:text-slate-900">Collection</Link>
          <span aria-hidden="true">/</span>
          <span className="max-w-[65vw] truncate text-slate-800">{product.title}</span>
        </nav>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)] lg:gap-16 xl:gap-24">
          <div className="relative overflow-hidden bg-[var(--color-stone)]">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.title} className="aspect-[4/4.5] w-full object-contain p-8 sm:p-12 lg:p-16" />
            ) : (
              <div className="flex aspect-[4/4.5] items-center justify-center text-slate-300">
                <Package className="h-16 w-16" strokeWidth={1} />
              </div>
            )}
          </div>

          <section className="lg:sticky lg:top-24 lg:py-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-cherry)]">{product.categoryName || 'The collection'}</p>
            <h1 className="mt-3 font-serif text-3xl font-medium leading-tight tracking-[-0.035em] text-slate-950 sm:text-4xl lg:text-[2.75rem]">{product.title}</h1>
            <p className="mt-3 text-sm text-slate-500">A considered addition to your everyday.</p>
            <div className="mt-7 flex flex-wrap items-baseline gap-x-4 gap-y-2 border-b border-slate-200 pb-6">
              <span className="text-2xl font-medium tracking-tight text-slate-950">${price.toFixed(2)}</span>
              <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.1em] ${inStock ? 'text-[var(--color-cherry)]' : 'text-slate-500'}`}>
                {inStock && <Check className="h-3.5 w-3.5" />}
                {inStock ? `${stock} in stock` : 'Out of stock'}
              </span>
            </div>

            <p className="mt-6 whitespace-pre-line text-sm leading-7 text-slate-600 sm:text-[15px]">
              {product.description || 'A thoughtful choice, selected to bring a little more to your everyday.'}
            </p>

            {error && (
              <p role="alert" className="mt-5 border-l-2 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
            )}

            <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Quantity</p>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <div className="flex h-12 items-center justify-between border border-slate-300 sm:w-36">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQty((current) => Math.max(1, current - 1))}
                  disabled={qty <= 1 || !inStock}
                  className="flex h-full w-11 items-center justify-center text-slate-600 transition hover:text-[var(--color-cherry)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span aria-live="polite" className="min-w-8 text-center text-sm font-semibold text-slate-900">{qty}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQty((current) => Math.min(stock, current + 1))}
                  disabled={qty >= stock || !inStock}
                  className="flex h-full w-11 items-center justify-center text-slate-600 transition hover:text-[var(--color-cherry)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!inStock || addingToCart}
                className="inline-flex h-12 flex-1 items-center justify-center gap-2 bg-[var(--color-cherry)] px-6 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[var(--color-cherry-light)] disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
                {addingToCart ? 'Adding to cart…' : inStock ? 'Add to cart' : 'Out of stock'}
              </button>
            </div>

            <div className="mt-8 border-t border-slate-200">
              <details className="group border-b border-slate-200 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-semibold uppercase tracking-[0.12em] text-slate-800">
                  Product details
                  <Plus className="h-4 w-4 transition group-open:rotate-45" />
                </summary>
                <p className="mt-4 whitespace-pre-line text-sm leading-6 text-slate-600">
                  {product.description || `${product.title} from ${product.categoryName || 'our collection'}.`}
                </p>
              </details>
              <details className="group border-b border-slate-200 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-semibold uppercase tracking-[0.12em] text-slate-800">
                  Delivery &amp; service
                  <Plus className="h-4 w-4 transition group-open:rotate-45" />
                </summary>
                <div className="mt-4 space-y-4 text-sm text-slate-600">
                  <div className="flex items-start gap-3">
                    <Truck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-cherry)]" strokeWidth={1.5} />
                    <p>Shipping options and estimated delivery are shown at checkout.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-cherry)]" strokeWidth={1.5} />
                    <p>Checkout is secure. Your order details are protected.</p>
                  </div>
                </div>
              </details>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
