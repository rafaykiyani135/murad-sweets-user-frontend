'use client';

import { useEffect, useState } from 'react';
import { api } from '@/app/lib/api';

// ─── Types ─────────────────────────────────────────────────────────────────

interface OrderSummary {
  order_number: string;
  status: string;
  customer_name: string;
  total: number;
  scheduled_date: string;
  item_count: number;
  fulfillment_type: string;
  created_at: string;
}

interface StockSummary {
  product_id: string;
  slug: string;
  name: string;
  category: string;
  product_type: string;
  quantity_on_hand: number;
  is_in_stock: boolean;
}

// ─── Status Badge ───────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  pending:          { bg: '#fef3c7', text: '#92400e', dot: '#d97706' },
  confirmed:        { bg: '#dbeafe', text: '#1e40af', dot: '#3b82f6' },
  preparing:        { bg: '#ede9fe', text: '#5b21b6', dot: '#7c3aed' },
  ready:            { bg: '#d1fae5', text: '#065f46', dot: '#10b981' },
  out_for_delivery: { bg: '#cffafe', text: '#0e7490', dot: '#06b6d4' },
  completed:        { bg: '#dcfce7', text: '#166534', dot: '#22c55e' },
  cancelled:        { bg: '#fee2e2', text: '#991b1b', dot: '#ef4444' },
};

function StatusBadge({ status }: { status: string }) {
  const colors = STATUS_COLORS[status] ?? { bg: '#f3f4f6', text: '#374151', dot: '#9ca3af' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      padding: '3px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 600,
      backgroundColor: colors.bg, color: colors.text,
    }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: colors.dot, flexShrink: 0 }} />
      {status.replace(/_/g, ' ')}
    </span>
  );
}

function StockBadge({ inStock, qty }: { inStock: boolean; qty: number }) {
  if (inStock) {
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        padding: '3px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 600,
        backgroundColor: '#dcfce7', color: '#166534',
      }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#22c55e', flexShrink: 0 }} />
        In Stock ({qty})
      </span>
    );
  }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      padding: '3px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 600,
      backgroundColor: '#fee2e2', color: '#991b1b',
    }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#ef4444', flexShrink: 0 }} />
      Out of Stock (0)
    </span>
  );
}

// ─── Restock Modal ─────────────────────────────────────────────────────────

function RestockModal({
  product,
  onClose,
  onSuccess,
}: {
  product: StockSummary;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [qty, setQty] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRestock = async () => {
    const amount = parseInt(qty);
    if (!amount || amount <= 0) { setError('Enter a valid quantity greater than 0.'); return; }
    setLoading(true);
    setError('');
    try {
      // NOTE: no auth for now — this is a temp endpoint
      await api.patch(`/admin/products/${product.product_id}/restock`, { quantity: amount });
      onSuccess();
      onClose();
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? 'Restock failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
      backdropFilter: 'blur(4px)',
    }}
      onClick={onClose}
    >
      <div style={{
        background: '#1c1c2e', border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '400px',
        boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
      }}
        onClick={e => e.stopPropagation()}
      >
        <h3 style={{ margin: '0 0 6px', color: '#fff', fontSize: '18px', fontWeight: 700 }}>
          Restock Product
        </h3>
        <p style={{ margin: '0 0 24px', color: '#9ca3af', fontSize: '14px' }}>
          {product.name} — currently <strong style={{ color: '#fff' }}>{product.quantity_on_hand}</strong> units
        </p>

        <label style={{ display: 'block', marginBottom: '8px', color: '#d1d5db', fontSize: '13px', fontWeight: 500 }}>
          Units to add
        </label>
        <input
          type="number"
          min={1}
          value={qty}
          onChange={e => setQty(e.target.value)}
          placeholder="e.g. 50"
          autoFocus
          style={{
            width: '100%', padding: '12px 14px', borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)',
            color: '#fff', fontSize: '15px', outline: 'none', boxSizing: 'border-box',
          }}
          onKeyDown={e => e.key === 'Enter' && handleRestock()}
        />

        {error && (
          <p style={{ color: '#f87171', fontSize: '13px', marginTop: '10px', marginBottom: 0 }}>{error}</p>
        )}

        <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: '11px', borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.15)', background: 'transparent',
              color: '#9ca3af', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleRestock}
            disabled={loading}
            style={{
              flex: 1, padding: '11px', borderRadius: '10px', border: 'none',
              background: loading ? '#4b5563' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff', fontSize: '14px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'opacity 0.2s',
            }}
          >
            {loading ? 'Restocking…' : 'Confirm Restock'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────

export default function HistoryPage() {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [stock, setStock] = useState<StockSummary[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingStock, setLoadingStock] = useState(true);
  const [restockTarget, setRestockTarget] = useState<StockSummary | null>(null);
  const [activeTab, setActiveTab] = useState<'orders' | 'stock'>('orders');
  const [orderFilter, setOrderFilter] = useState('all');

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await api.get('/history/orders');
      setOrders(res.data);
    } catch { /* silent */ } finally {
      setLoadingOrders(false);
    }
  };

  const fetchStock = async () => {
    setLoadingStock(true);
    try {
      const res = await api.get('/history/stock');
      setStock(res.data);
    } catch { /* silent */ } finally {
      setLoadingStock(false);
    }
  };

  useEffect(() => { fetchOrders(); fetchStock(); }, []);

  // Filtered orders
  const filteredOrders = orderFilter === 'all'
    ? orders
    : orders.filter(o => o.status === orderFilter);

  // Stats
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((s, o) => s + o.total, 0);
  const outOfStock = stock.filter(s => !s.is_in_stock).length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a14 0%, #0f0f1f 50%, #0a0a14 100%)',
      fontFamily: "'Inter', 'Outfit', sans-serif",
      color: '#fff',
    }}>
      {/* Header */}
      <div style={{
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(255,255,255,0.02)',
        backdropFilter: 'blur(12px)',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '18px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 800, background: 'linear-gradient(90deg, #a78bfa, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Murad Sweets — Dashboard
            </h1>
            <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#6b7280' }}>
              Temporary history & stock view · /history
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => { fetchOrders(); fetchStock(); }}
              style={{
                padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.05)', color: '#9ca3af', fontSize: '13px',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
              }}
            >
              ↻ Refresh
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px' }}>

        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {[
            { label: 'Total Orders', value: orders.length, icon: '📦', color: '#818cf8' },
            { label: 'Pending', value: pendingOrders, icon: '⏳', color: '#fbbf24' },
            { label: 'Revenue (non-cancelled)', value: `$${totalRevenue.toFixed(2)}`, icon: '💰', color: '#34d399' },
            { label: 'Out of Stock Items', value: outOfStock, icon: '⚠️', color: '#f87171' },
          ].map(card => (
            <div key={card.label} style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '14px', padding: '20px 22px',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>{card.icon}</div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: card.color }}>{card.value}</div>
              <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>{card.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '4px', width: 'fit-content' }}>
          {(['orders', 'stock'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '8px 20px', borderRadius: '9px', border: 'none', cursor: 'pointer',
                background: activeTab === tab ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent',
                color: activeTab === tab ? '#fff' : '#9ca3af',
                fontSize: '14px', fontWeight: activeTab === tab ? 700 : 500,
                transition: 'all 0.2s',
              }}
            >
              {tab === 'orders' ? `📦 Orders (${orders.length})` : `📊 Stock (${stock.length})`}
            </button>
          ))}
        </div>

        {/* ── Orders Tab ── */}
        {activeTab === 'orders' && (
          <div>
            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
              {['all', 'pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'].map(f => (
                <button
                  key={f}
                  onClick={() => setOrderFilter(f)}
                  style={{
                    padding: '6px 14px', borderRadius: '999px', fontSize: '13px', fontWeight: 500,
                    border: '1px solid', cursor: 'pointer',
                    borderColor: orderFilter === f ? '#6366f1' : 'rgba(255,255,255,0.1)',
                    background: orderFilter === f ? 'rgba(99,102,241,0.2)' : 'transparent',
                    color: orderFilter === f ? '#a5b4fc' : '#9ca3af',
                    transition: 'all 0.15s',
                  }}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1).replace('_', ' ')}
                  {f !== 'all' && (
                    <span style={{ marginLeft: '6px', opacity: 0.7 }}>
                      ({orders.filter(o => o.status === f).length})
                    </span>
                  )}
                </button>
              ))}
            </div>

            {loadingOrders ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>Loading orders…</div>
            ) : filteredOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>No orders found.</div>
            ) : (
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      {['Order #', 'Customer', 'Date Placed', 'Scheduled', 'Type', 'Items', 'Total', 'Status'].map(h => (
                        <th key={h} style={{ padding: '14px 16px', textAlign: 'left', color: '#6b7280', fontWeight: 600, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order, i) => (
                      <tr
                        key={order.order_number}
                        style={{
                          borderBottom: i < filteredOrders.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <td style={{ padding: '14px 16px', fontWeight: 700, color: '#a5b4fc', fontFamily: 'monospace' }}>
                          {order.order_number}
                        </td>
                        <td style={{ padding: '14px 16px', color: '#e5e7eb' }}>{order.customer_name}</td>
                        <td style={{ padding: '14px 16px', color: '#9ca3af', whiteSpace: 'nowrap' }}>
                          {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td style={{ padding: '14px 16px', color: '#9ca3af', whiteSpace: 'nowrap' }}>{order.scheduled_date}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{
                            fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: '6px',
                            background: order.fulfillment_type === 'delivery' ? 'rgba(14,165,233,0.15)' : 'rgba(168,85,247,0.15)',
                            color: order.fulfillment_type === 'delivery' ? '#38bdf8' : '#c084fc',
                          }}>
                            {order.fulfillment_type === 'delivery' ? '🚗 Delivery' : '🏪 Pickup'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', color: '#d1d5db', textAlign: 'center' }}>{order.item_count}</td>
                        <td style={{ padding: '14px 16px', fontWeight: 700, color: '#34d399', whiteSpace: 'nowrap' }}>
                          ${order.total.toFixed(2)}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <StatusBadge status={order.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Stock Tab ── */}
        {activeTab === 'stock' && (
          <div>
            <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '20px', marginTop: 0 }}>
              Only actively tracked products are shown. Pitha (pre-order), party trays, and Mix &amp; Match box containers are excluded.
            </p>

            {loadingStock ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>Loading stock…</div>
            ) : stock.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>No tracked products found.</div>
            ) : (
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      {['Product', 'Category', 'Type', 'Qty on Hand', 'Status', 'Action'].map(h => (
                        <th key={h} style={{ padding: '14px 16px', textAlign: 'left', color: '#6b7280', fontWeight: 600, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {stock.map((item, i) => (
                      <tr
                        key={item.product_id}
                        style={{
                          borderBottom: i < stock.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                          transition: 'background 0.15s',
                          background: !item.is_in_stock ? 'rgba(239,68,68,0.04)' : 'transparent',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                        onMouseLeave={e => (e.currentTarget.style.background = !item.is_in_stock ? 'rgba(239,68,68,0.04)' : 'transparent')}
                      >
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 600, color: '#e5e7eb' }}>{item.name}</div>
                          <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px', fontFamily: 'monospace' }}>{item.slug}</div>
                        </td>
                        <td style={{ padding: '14px 16px', color: '#9ca3af' }}>{item.category}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{
                            fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: '6px',
                            background: item.product_type === 'selection_item' ? 'rgba(250,204,21,0.12)' : 'rgba(139,92,246,0.12)',
                            color: item.product_type === 'selection_item' ? '#fbbf24' : '#c084fc',
                          }}>
                            {item.product_type === 'selection_item' ? 'Dry Sweet' : 'Specialty'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{
                            fontSize: '20px', fontWeight: 800,
                            color: item.quantity_on_hand === 0 ? '#f87171' : item.quantity_on_hand <= 5 ? '#fbbf24' : '#34d399',
                          }}>
                            {item.quantity_on_hand}
                          </span>
                          {item.quantity_on_hand <= 5 && item.quantity_on_hand > 0 && (
                            <span style={{ marginLeft: '6px', fontSize: '11px', color: '#fbbf24' }}>⚠ Low</span>
                          )}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <StockBadge inStock={item.is_in_stock} qty={item.quantity_on_hand} />
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <button
                            onClick={() => setRestockTarget(item)}
                            style={{
                              padding: '7px 14px', borderRadius: '8px', border: '1px solid rgba(99,102,241,0.4)',
                              background: 'rgba(99,102,241,0.1)', color: '#a5b4fc',
                              fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                              transition: 'all 0.15s',
                            }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.25)'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.1)'; }}
                          >
                            + Restock
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Restock Modal */}
      {restockTarget && (
        <RestockModal
          product={restockTarget}
          onClose={() => setRestockTarget(null)}
          onSuccess={fetchStock}
        />
      )}
    </div>
  );
}
