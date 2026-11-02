import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUpRight, PackageSearch, Search, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import API from '../api/client';

export default function Products() {
  const [productResult, setProductResult] = useState({ query: null, products: [], error: '' });
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [categoryError, setCategoryError] = useState('');

  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (selectedCategory) params.append('categoryId', selectedCategory);
  if (sortBy) params.append('sortBy', sortBy);
  const query = params.toString();
  const loading = productResult.query !== query;
  const products = loading ? [] : productResult.products;
  const error = loading ? '' : productResult.error;

  const scrollToCollection = () => {
    document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    let active = true;

    API.get('/categories')
      .then((res) => {
        if (active) setCategories(res.data);
      })
      .catch(() => {
        if (active) setCategoryError('Categories could not be loaded.');
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    API.get(`/products?${query}`)
      .then((res) => {
        if (active) setProductResult({ query, products: res.data.items || [], error: '' });
      })
      .catch(() => {
        if (active) {
          setProductResult({
            query,
            products: [],
            error: 'We couldn’t load the products. Please try again.',
          });
        }
      });

    return () => {
      active = false;
    };
  }, [query]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#fbf9f7]">
      <section className="overflow-hidden bg-[#f1e9e3]">
        <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-4 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1fr_0.88fr] lg:gap-16 lg:px-12 lg:py-20">
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-cherry)]/15 bg-white/70 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-cherry)]">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={1.5} />
              A little more lovely, every day
            </span>
            <h1 className="mt-6 max-w-2xl font-serif text-5xl font-medium leading-[1.04] tracking-[-0.045em] text-slate-950 sm:text-6xl lg:text-[4.5rem]">
              Everyday things,<br /><span className="italic text-[var(--color-cherry)]">thoughtfully found.</span>
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-7 text-slate-600 sm:text-base">
              Good design belongs in the everyday. Discover a considered collection of useful things made to bring a little joy to your routine.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={scrollToCollection}
                className="inline-flex items-center gap-3 rounded-full bg-[var(--color-cherry)] px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-white shadow-lg shadow-[var(--color-cherry)]/15 transition hover:-translate-y-0.5 hover:bg-[var(--color-cherry-light)]"
              >
                Explore the edit <ArrowDown className="h-4 w-4" />
              </button>
              <span className="text-xs text-slate-500">A considered collection, just for you.</span>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 border-t border-slate-900/10 pt-5 text-xs text-slate-600">
              <span className="inline-flex items-center gap-2"><Truck className="h-4 w-4 text-[var(--color-cherry)]" /> Thoughtful delivery</span>
              <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[var(--color-cherry)]" /> A quality-first edit</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[540px]">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full border border-[var(--color-cherry)]/15" />
            <div className="absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-[#d8c4b8]/50 blur-2xl" />
            <div className="relative aspect-[1.12/1] overflow-hidden rounded-[48%_48%_22px_22px] bg-[#d8c4b8] shadow-2xl shadow-[#5c3430]/15">
              <img
                src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=85"
                alt="A calm, sunlit still life of thoughtfully chosen home objects"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#281713]/45 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/75">The Pulse edit</p>
                  <p className="mt-1 font-serif text-2xl">Small joys, well made.</p>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-white/15 backdrop-blur-sm">
                  <Sparkles className="h-4 w-4" />
                </span>
              </div>
            </div>
            <div className="absolute -bottom-5 right-4 rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-xl backdrop-blur sm:right-8">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400">Picked with care</p>
              <p className="mt-1 font-serif text-lg text-slate-900">Made for real life</p>
            </div>
          </div>
        </div>
      </section>

      <section id="collection" className="mx-auto max-w-[1440px] px-4 pb-16 pt-10 sm:px-8 sm:pt-14 lg:px-12">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-cherry)]">A good place to start</p>
            <h2 className="mt-2 font-serif text-3xl font-medium tracking-tight text-slate-950 sm:text-4xl">The everyday edit</h2>
            <p className="mt-2 text-sm text-slate-500">
              {loading ? 'Finding the right things for you…' : `${products.length} ${products.length === 1 ? 'item' : 'items'} to explore`}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:w-[min(100%,44rem)]">
            <label className="relative block sm:col-span-1">
              <span className="sr-only">Search products</span>
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                placeholder="Find something lovely..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[var(--color-cherry)] focus:ring-2 focus:ring-[var(--color-rose)]"
              />
            </label>
            <label className="sm:col-span-1">
              <span className="sr-only">Filter by category</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 shadow-sm outline-none transition focus:border-[var(--color-cherry)] focus:ring-2 focus:ring-[var(--color-rose)]"
              >
                <option value="">All categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </label>
            <label className="sm:col-span-1">
              <span className="sr-only">Sort products</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 shadow-sm outline-none transition focus:border-[var(--color-cherry)] focus:ring-2 focus:ring-[var(--color-rose)]"
              >
                <option value="">Sort: Newest</option>
                <option value="price_asc">Price: Low to high</option>
                <option value="price_desc">Price: High to low</option>
                <option value="name_asc">Name: A to Z</option>
              </select>
            </label>
          </div>
        </div>

        {categories.length > 0 && (
          <div className="mb-8 flex gap-2 overflow-x-auto pb-2" aria-label="Browse by category">
            <button
              type="button"
              onClick={() => setSelectedCategory('')}
              aria-pressed={!selectedCategory}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium transition ${!selectedCategory ? 'bg-[var(--color-cherry)] text-white shadow-md shadow-[var(--color-cherry)]/15' : 'border border-slate-200 bg-white text-slate-600 hover:border-[var(--color-cherry)]/40 hover:text-[var(--color-cherry)]'}`}
            >
              Everything
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategory(String(category.id))}
                aria-pressed={selectedCategory === String(category.id)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium transition ${selectedCategory === String(category.id) ? 'bg-[var(--color-cherry)] text-white shadow-md shadow-[var(--color-cherry)]/15' : 'border border-slate-200 bg-white text-slate-600 hover:border-[var(--color-cherry)]/40 hover:text-[var(--color-cherry)]'}`}
              >
                {category.name}
              </button>
            ))}
          </div>
        )}

        {categoryError && (
          <p role="status" className="mb-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">{categoryError}</p>
        )}
        {error && (
          <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center">
            <p className="font-semibold text-red-800">{error}</p>
          </div>
        )}
        {!error && loading && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4" aria-label="Loading products">
            {Array.from({ length: 8 }, (_, index) => (
              <div key={index} className="overflow-hidden rounded-2xl bg-white p-2 shadow-sm">
                <div className="aspect-[4/5] animate-pulse rounded-xl bg-slate-100" />
                <div className="mt-4 h-3 w-1/3 animate-pulse rounded bg-slate-100" />
                <div className="mt-3 h-5 w-3/4 animate-pulse rounded bg-slate-100" />
                <div className="mt-6 h-5 w-1/2 animate-pulse rounded bg-slate-100" />
              </div>
            ))}
          </div>
        )}
        {!error && !loading && products.length === 0 && (
          <div className="border border-dashed border-slate-300 bg-[#faf9f7] px-6 py-16 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center border border-slate-200 bg-white text-slate-700">
              <PackageSearch className="h-7 w-7" strokeWidth={1.25} />
            </span>
            <h3 className="mt-5 text-lg font-semibold text-slate-900">No products found</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Try a different search or category. Your next great find might be one filter away.
            </p>
            {(search || selectedCategory) && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('');
                }}
                className="mt-5 bg-[var(--color-cherry)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[var(--color-cherry-light)]"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
        {!error && !loading && products.length > 0 && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(35,23,20,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(35,23,20,0.11)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-cherry)] focus-visible:ring-offset-4"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[var(--color-stone)]">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-300">
                      <PackageSearch className="h-12 w-12" strokeWidth={1} />
                    </div>
                  )}
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-600 shadow-sm backdrop-blur">
                    {product.categoryName || 'The collection'}
                  </span>
                  <span className="absolute bottom-3 right-3 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-white text-[var(--color-cherry)] opacity-0 shadow-md transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
                  </span>
                </div>
                <div className="flex flex-1 flex-col px-3.5 pb-4 pt-3.5 sm:px-4">
                  <div className="mt-2 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="line-clamp-2 text-sm font-medium leading-5 text-slate-900 transition group-hover:text-[var(--color-cherry)] sm:text-base">{product.title}</h3>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
                    <p className="font-serif text-lg font-medium text-slate-950">${Number(product.price || 0).toFixed(2)}</p>
                    {product.stockQuantity <= 0 && <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-medium uppercase tracking-wider text-slate-500">Unavailable</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
