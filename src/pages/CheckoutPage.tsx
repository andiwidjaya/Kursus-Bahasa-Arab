import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PaymentMethod, Order } from '../types';
import { generatePaymentDetails } from '../lib/payment';
import { 
  ShieldCheck, CreditCard, QrCode, ArrowRight, 
  AlertCircle, Sparkles, Copy, Check, Clock, Loader2 
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { 
    selectedCourseId, 
    courses, 
    currentUser, 
    createOrderAndCheckout, 
    verifyPaymentAndFulfillOrder, 
    navigateTo, 
    showToast 
  } = useApp();

  const course = courses.find(c => c.id === selectedCourseId) || courses[0];

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('QRIS');
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const rawPrice = course.discount_price || course.price;
  const discountAmount = (rawPrice * discountPercent) / 100;
  const finalTotal = Math.max(0, rawPrice - discountAmount);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'ARAB2026' || promoCode.trim().toUpperCase() === 'DISCOUNT10') {
      setDiscountPercent(10);
      showToast('Kode promo berhasil dipasang! Diskon 10% applied.', 'success');
    } else {
      showToast('Kode promo tidak valid atau kadaluarsa.', 'warning');
    }
  };

  const handleProcessCheckout = () => {
    if (!currentUser) {
      showToast('Harap login terlebih dahulu untuk melakukan transaksi.', 'warning');
      return;
    }
    const order = createOrderAndCheckout(course.id, paymentMethod);
    setActiveOrder(order);
  };

  const handleVerifyPaymentWebhook = async () => {
    if (!activeOrder) return;
    setIsVerifying(true);

    try {
      const verified = await verifyPaymentAndFulfillOrder(activeOrder.id);
      if (verified) {
        setTimeout(() => {
          navigateTo('learn', { courseId: course.id, courseSlug: course.slug });
        }, 1200);
      }
    } catch (err: any) {
      showToast('Gagal memverifikasi status pembayaran.', 'error');
    } finally {
      setIsVerifying(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    showToast('Nomor tersalin ke clipboard!', 'info');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const paymentDetails = activeOrder 
    ? generatePaymentDetails(activeOrder.order_number, activeOrder.payment_method, activeOrder.amount)
    : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Pembayaran Kursus</h1>
        <p className="text-xs text-slate-500 mt-1">
          Selesaikan transaksi untuk mendapatkan akses seumur hidup & fitur tracking LMS.
        </p>
      </div>

      {!activeOrder ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Payment Method Selector */}
          <div className="md:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            
            <h2 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              Pilih Metode Pembayaran (Midtrans Integration)
            </h2>

            <div className="space-y-3">
              
              {/* QRIS */}
              <label 
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'QRIS' ? 'border-emerald-500 bg-emerald-50/50 shadow-sm' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'QRIS'}
                    onChange={() => setPaymentMethod('QRIS')}
                    className="accent-emerald-600"
                  />
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">QRIS (Scan & Bayar Instan)</p>
                    <p className="text-[10px] text-slate-500">BCA, Mandiri, GoPay, OVO, ShopeePay, Dana</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                  Bebas Admin
                </span>
              </label>

              {/* Bank Transfer BCA */}
              <label 
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'BCA_VA' ? 'border-emerald-500 bg-emerald-50/50 shadow-sm' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'BCA_VA'}
                    onChange={() => setPaymentMethod('BCA_VA')}
                    className="accent-emerald-600"
                  />
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                    BCA
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">BCA Virtual Account</p>
                    <p className="text-[10px] text-slate-500">Konfirmasi Pembayaran Otomatis Backend</p>
                  </div>
                </div>
              </label>

              {/* Bank Transfer Mandiri */}
              <label 
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'MANDIRI_VA' ? 'border-emerald-500 bg-emerald-50/50 shadow-sm' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'MANDIRI_VA'}
                    onChange={() => setPaymentMethod('MANDIRI_VA')}
                    className="accent-emerald-600"
                  />
                  <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-xs">
                    MDR
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Mandiri Virtual Account</p>
                    <p className="text-[10px] text-slate-500">Konfirmasi Pembayaran Otomatis Backend</p>
                  </div>
                </div>
              </label>

              {/* GoPay */}
              <label 
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'GOPAY' ? 'border-emerald-500 bg-emerald-50/50 shadow-sm' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'GOPAY'}
                    onChange={() => setPaymentMethod('GOPAY')}
                    className="accent-emerald-600"
                  />
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    GPY
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">GoPay / GoPay Later</p>
                    <p className="text-[10px] text-slate-500">Bayar via aplikasi Gojek</p>
                  </div>
                </div>
              </label>

            </div>

            {/* Promo Code Box */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <label className="block text-xs font-bold text-slate-700">Kode Promo / Diskon (Opsional)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={e => setPromoCode(e.target.value)}
                  placeholder="Masukkan ARAB2026"
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono uppercase focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                >
                  Pasang
                </button>
              </div>
            </div>

          </div>

          {/* Right Summary Card */}
          <div className="md:col-span-1 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h2 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">Ringkasan Pesanan</h2>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <img src={course.thumbnail_url} alt={course.title} className="w-14 h-14 rounded-xl object-cover" />
                  <div>
                    <h3 className="font-bold text-xs text-slate-900 line-clamp-2">{course.title}</h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">{course.level}</p>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Harga Kursus</span>
                    <span>{formatRupiah(rawPrice)}</span>
                  </div>
                  
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Diskon Kode Promo (10%)</span>
                      <span>-{formatRupiah(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-900 font-extrabold text-sm border-t border-slate-100 pt-2">
                    <span>Total Bayar</span>
                    <span className="text-emerald-700">{formatRupiah(finalTotal)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleProcessCheckout}
                className="w-full py-3.5 rounded-xl font-bold text-xs text-white emerald-gradient hover:opacity-95 transition-opacity shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-1.5"
              >
                Bayar Sekarang
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Transaksi Terenkripsi & Aman
              </div>
            </div>
          </div>

        </div>
      ) : (
        /* Active Payment Modal / Webhook Engine Simulator View */
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl max-w-2xl mx-auto space-y-6 text-center animate-in zoom-in-95">
          
          <div className="inline-flex p-3 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
            <AlertCircle className="w-6 h-6" />
          </div>

          <div>
            <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 border border-amber-500/20 uppercase tracking-wide flex items-center justify-center gap-1.5 w-fit mx-auto">
              <Clock className="w-3.5 h-3.5" /> STATUS PEMBAYARAN: PENDING
            </span>
            <h2 className="text-xl font-black text-slate-900 mt-2">Selesaikan Pembayaran Anda</h2>
            <p className="text-xs text-slate-500">Nomor Invoice: #{activeOrder.order_number}</p>
          </div>

          {/* Payment Detail Details depending on method */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 max-w-md mx-auto space-y-4">
            
            {paymentDetails?.vaNumber ? (
              <div className="space-y-3 text-left">
                <p className="text-xs font-bold text-slate-800">Transfer {paymentDetails.bank} Virtual Account:</p>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-slate-400">Nomor Virtual Account</p>
                    <p className="text-sm font-mono font-bold text-slate-900">{paymentDetails.vaNumber}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(paymentDetails.vaNumber || '')}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex justify-between text-xs font-semibold pt-1">
                  <span className="text-slate-500">Total Tagihan:</span>
                  <span className="text-emerald-700 font-extrabold">{formatRupiah(activeOrder.amount)}</span>
                </div>

                <div className="pt-2 text-[11px] text-slate-500 space-y-1">
                  <p className="font-bold text-slate-700">Petunjuk Pembayaran:</p>
                  <ol className="list-decimal list-inside space-y-0.5 text-[10px]">
                    {paymentDetails.instructions.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-800">Scan QRIS Nasional melalui Aplikasi E-Wallet / Mobile Banking</p>
                <div className="w-48 h-48 mx-auto bg-white p-3 rounded-2xl border border-slate-300 shadow-inner flex items-center justify-center relative group">
                  <svg className="w-full h-full text-slate-900" viewBox="0 0 100 100" fill="currentColor">
                    <rect x="10" y="10" width="25" height="25" fill="#0f172a"/>
                    <rect x="15" y="15" width="15" height="15" fill="#ffffff"/>
                    <rect x="18" y="18" width="9" height="9" fill="#0f172a"/>
                    
                    <rect x="65" y="10" width="25" height="25" fill="#0f172a"/>
                    <rect x="70" y="15" width="15" height="15" fill="#ffffff"/>
                    <rect x="73" y="18" width="9" height="9" fill="#0f172a"/>

                    <rect x="10" y="65" width="25" height="25" fill="#0f172a"/>
                    <rect x="15" y="70" width="15" height="15" fill="#ffffff"/>
                    <rect x="18" y="73" width="9" height="9" fill="#0f172a"/>

                    <rect x="45" y="45" width="12" height="12" fill="#10b981"/>
                    <rect x="60" y="60" width="20" height="20" fill="#0f172a"/>
                  </svg>
                </div>
                <p className="text-[11px] font-bold text-emerald-700">Total Nominal: {formatRupiah(activeOrder.amount)}</p>
              </div>
            )}

          </div>

          {/* Webhook Payment Status Simulator */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-xs text-emerald-800">
              <p className="font-bold flex items-center justify-center gap-1">
                <Sparkles className="w-4 h-4 text-emerald-600" /> Payment Gateway Webhook Status Verification
              </p>
              <p className="text-[11px] mt-0.5 text-emerald-700">
                Sesuai persyatan PRD §14, akses kelas baru diterbitkan setelah status verifikasi server bernilai <strong>PAID</strong>.
              </p>
            </div>

            <button
              onClick={handleVerifyPaymentWebhook}
              disabled={isVerifying}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-xs font-extrabold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center justify-center gap-2 mx-auto"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Memverifikasi Sinyal Webhook Server...
                </>
              ) : (
                'Verifikasi Pembayaran & Aktifkan Akses Kelas (Webhook Engine)'
              )}
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
