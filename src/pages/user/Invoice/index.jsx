import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getOrder } from '../../../features/checkout/api/checkoutApi';
import { getProduct } from '../../../api/publicApi';
import { FiLoader } from 'react-icons/fi';

const Invoice = () => {
  const { orderNumber } = useParams();
  const [vendors, setVendors] = useState([]);
  const [vendorsLoaded, setVendorsLoaded] = useState(false);

  const { data: orderData, isLoading } = useQuery({
    queryKey: ['invoice', orderNumber],
    queryFn: () => getOrder(orderNumber),
  });

  const order = orderData?.data?.order;

  // Get items - items veya products olabilir
  const orderItems = order?.items || order?.products || [];

  // Ürünlerden slug ile vendor bilgilerini çek
  useEffect(() => {
    const fetchVendors = async () => {
      if (!order || orderItems.length === 0) return;
      
      try {
        // Her benzersiz ürün slug'ı için vendor bilgisi çek
        const slugs = [...new Set(orderItems.map(item => item.slug).filter(Boolean))];
        console.log('[Invoice] Product slugs:', slugs);
        
        const vendorMap = new Map();
        
        for (const slug of slugs) {
          try {
            const productData = await getProduct(slug);
            console.log('[Invoice] Product data for slug', slug, ':', productData);
            const vendor = productData?.data?.product?.vendor || productData?.data?.vendor;
            console.log('[Invoice] Vendor from product:', vendor);
            if (vendor && vendor.id) {
              vendorMap.set(vendor.id, vendor);
            }
          } catch (err) {
            console.log('[Invoice] Vendor fetch error for slug:', slug, err);
          }
        }
        
        setVendors(Array.from(vendorMap.values()));
      } catch (error) {
        console.error('[Invoice] Error fetching vendors:', error);
      } finally {
        setVendorsLoaded(true);
      }
    };
    
    if (order && !vendorsLoaded) {
      fetchVendors();
    }
  }, [order, orderItems, vendorsLoaded]);

  useEffect(() => {
    if (order && vendorsLoaded) {
      console.log('[Invoice] Vendors loaded:', vendors);
      // Auto-print when order and vendors are loaded
      setTimeout(() => window.print(), 500);
    }
  }, [order, vendorsLoaded, vendors]);

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount || 0);
  };

  // Calculate totals - using the same logic as vendor invoice
  const calculateTotals = () => {
    if (!order) {
      return { subtotalWithoutTax: 0, totalTax: 0, total: 0 };
    }

    const subtotalWithoutTax = (order.subtotal_amount || order.subtotal || 0) - (order.tax_amount || 0) - (order.discount_amount || order.coupon_discount || 0);
    const totalTax = order.tax_amount || 0;
    const total = order.total_amount || order.total || order.amount || 0;

    return { subtotalWithoutTax, totalTax, total };
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <FiLoader className="animate-spin" size={48} color="#2563eb" />
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <p style={{ fontSize: '18px', color: '#6b7280' }}>Fatura bulunamadı</p>
      </div>
    );
  }

  const totals = calculateTotals();

  return (
    <>
      <style>{`
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; line-height: 1.6; background-color: #FFFFFF; }
        .container { max-width: 800px; margin: 0 auto; border: 1px solid #eee; padding: 40px; box-shadow: 0 0 10px rgba(0,0,0,0.05); background-color: #FFFFFF; }
        
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #1F2937; padding-bottom: 20px; margin-bottom: 30px; }
        .brand { font-size: 28px; font-weight: 800; color: #1F2937; letter-spacing: -1px; }
        .invoice-meta { text-align: right; }
        .invoice-meta h3 { margin: 0 0 5px 0; color: #111827; }
        .meta-item { font-size: 14px; color: #6B7280; }

        .info-section { display: flex; justify-content: space-between; margin-bottom: 40px; }
        .info-box h4 { font-size: 12px; text-transform: uppercase; color: #9CA3AF; margin-bottom: 8px; letter-spacing: 0.5px; }
        .info-box p { margin: 0; font-size: 14px; color: #1F2937; }
        .info-box .address { max-width: 300px; line-height: 1.5; }

        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { text-align: left; background: #F9FAFB; padding: 12px 16px; border-bottom: 1px solid #E5E7EB; font-size: 12px; text-transform: uppercase; color: #6B7280; }
        td { padding: 16px; border-bottom: 1px solid #F3F4F6; font-size: 14px; color: #374151; }
        .col-price { text-align: right; font-weight: 600; }
        .col-qty { text-align: center; }
        .product-name { display: block; font-weight: 600; color: #111827; }
        .product-variant { font-size: 12px; color: #6B7280; }

        .totals-area { display: flex; justify-content: flex-end; margin-top: 30px; }
        .totals-table { width: 300px; }
        .totals-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; color: #6B7280; }
        .grand-total { display: flex; justify-content: space-between; padding-top: 15px; margin-top: 10px; border-top: 2px solid #E5E7EB; font-size: 18px; font-weight: 800; color: #1F2937; }

        .footer { margin-top: 60px; text-align: center; font-size: 12px; color: #9CA3AF; border-top: 1px solid #E5E7EB; padding-top: 20px; }
        
        @media print {
          body { padding: 0; background-color: #FFFFFF; }
          .container { border: none; box-shadow: none; background-color: #FFFFFF; }
        }
      `}</style>

      <div className="container">
        <div className="header">
          <div className="brand">Ticaret.com</div>
          <div className="invoice-meta">
            <h3>SİPARİŞ ÖZETİ</h3>
            <div className="meta-item">No: <strong>{order.order_number}</strong></div>
            <div className="meta-item">Tarih: {order.date}</div>
          </div>
        </div>

        {/* Satıcı Bilgileri */}
        {vendors.length > 0 && (
          <div style={{ 
            backgroundColor: '#f9fafb', 
            border: '1px solid #e5e7eb', 
            borderRadius: '8px', 
            padding: '20px',
            marginBottom: '30px'
          }}>
            <h4 style={{ 
              fontSize: '12px', 
              textTransform: 'uppercase', 
              color: '#9CA3AF', 
              marginBottom: '12px', 
              letterSpacing: '0.5px',
              margin: '0 0 12px 0'
            }}>
              Satıcı Bilgileri
            </h4>
            {vendors.map((vendor, idx) => (
              <div key={idx} style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '16px',
                marginBottom: vendors.length > 1 ? '16px' : 0,
                paddingBottom: vendors.length > 1 && idx < vendors.length - 1 ? '16px' : 0,
                borderBottom: vendors.length > 1 && idx < vendors.length - 1 ? '1px solid #e5e7eb' : 'none'
              }}>
                <div>
                  <p style={{ margin: '0 0 4px 0', fontSize: '14px' }}>
                    <strong style={{ color: '#111827' }}>{vendor.business_name || vendor.store_name || vendor.name}</strong>
                  </p>
                  {vendor.tax_number && (
                    <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#6B7280' }}>
                      Vergi No: {vendor.tax_number}
                    </p>
                  )}
                  {vendor.tax_office && (
                    <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#6B7280' }}>
                      Vergi Dairesi: {vendor.tax_office}
                    </p>
                  )}
                </div>
                <div>
                  {vendor.phone && (
                    <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#6B7280' }}>
                      Tel: {vendor.phone}
                    </p>
                  )}
                  {vendor.email && (
                    <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#6B7280' }}>
                      E-posta: {vendor.email}
                    </p>
                  )}
                  {vendor.address && (
                    <p style={{ margin: '0', fontSize: '13px', color: '#6B7280', lineHeight: '1.5' }}>
                      {vendor.address}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="info-section">
          <div className="info-box">
            <h4>Müşteri Bilgileri</h4>
            <p><strong>{order.shipping_address?.full_name || 'Müşteri'}</strong></p>
            <p>{order.shipping_address?.phone || ''}</p>
            <div style={{ marginTop: '16px' }}>
              <h4>Teslimat Adresi</h4>
              <p className="address">
                {order.shipping_address?.address_line}<br />
                {order.shipping_address?.district}, {order.shipping_address?.city}<br />
                {order.shipping_address?.postal_code}
              </p>
            </div>
            <p style={{ marginTop: '12px' }}><strong>Ödeme:</strong> {order.payment_method || 'Kredi Kartı'}</p>
          </div>
          <div className="info-box">
            <h4>Fatura Adresi</h4>
            <p className="address">
              {(order.billing_address?.address_line || order.shipping_address?.address_line)}<br />
              {(order.billing_address?.district || order.shipping_address?.district)}, {(order.billing_address?.city || order.shipping_address?.city)}<br />
              {(order.billing_address?.postal_code || order.shipping_address?.postal_code)}
            </p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th width="40%">Ürün / Hizmet</th>
              <th width="12%" className="col-price">Birim Fiyat</th>
              <th width="8%" className="col-qty">Adet</th>
              <th width="10%" className="col-price">KDV (%)</th>
              <th width="15%" className="col-price">KDV Tutarı</th>
              <th width="15%" className="col-price">Toplam</th>
            </tr>
          </thead>
          <tbody>
            {orderItems.map((item, index) => {
              const itemName = item.product_name || item.name || 'Ürün';
              const itemVariant = item.variant_name || item.variant || null;
              const quantity = item.quantity || item.qty || 1;
              const unitPrice = parseFloat(item.unit_price || item.price || 0);
              const totalPrice = parseFloat(item.total_price || (unitPrice * quantity));
              const taxRate = parseFloat(item.tax_rate || 18);
              const priceWithoutTax = totalPrice / (1 + taxRate / 100);
              const taxAmount = totalPrice - priceWithoutTax;
              
              return (
                <tr key={index}>
                  <td>
                    <span className="product-name">{itemName}</span>
                    {itemVariant && <span className="product-variant">{itemVariant}</span>}
                  </td>
                  <td className="col-price">{formatMoney(priceWithoutTax / quantity)}</td>
                  <td className="col-qty">{quantity}</td>
                  <td className="col-price">{taxRate.toFixed(0)}</td>
                  <td className="col-price">{formatMoney(taxAmount)}</td>
                  <td className="col-price">{formatMoney(totalPrice)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="totals-area">
          <div className="totals-table">
            <div className="totals-row">
              <span>Ara Toplam (KDV Hariç)</span>
              <span>{formatMoney(totals.subtotalWithoutTax)}</span>
            </div>
            {(order.discount_amount || order.coupon_discount || 0) > 0 && (
              <div className="totals-row">
                <span>İndirim {(order.coupon_code || order.discount_code) && `(${order.coupon_code || order.discount_code})`}</span>
                <span>-{formatMoney(order.discount_amount || order.coupon_discount || 0)}</span>
              </div>
            )}
            <div className="totals-row">
              <span>Toplam KDV</span>
              <span>{formatMoney(totals.totalTax)}</span>
            </div>
            <div className="totals-row">
              <span>Kargo</span>
              <span>{formatMoney(order.shipping_amount || totals.totalTax)}</span>
            </div>
            <div className="totals-row">
              <span>Kargo</span>
              <span>{formatMoney(order.shipping_cost || 0)}</span>
            </div>
            <div className="grand-total">
              <span>GENEL TOPLAM</span>
              <span>{formatMoney(totals.total)}</span>
            </div>
          </div>
        </div>

        <div className="footer">
          <p>Bu belge bilgilendirme amaçlıdır. Mali değeri yoktur.</p>
          <p>Ticaret.com tarafından oluşturulmuştur.</p>
        </div>
      </div>
    </>
  );
};

export default Invoice;
