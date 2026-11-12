import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Smartphone, CheckCircle2, ShieldCheck, X, Loader2, ArrowRight } from 'lucide-react';

interface MpesaModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceId: string;
  defaultAmount: number;
  unitLabel: string;
}

export const MpesaModal: React.FC<MpesaModalProps> = ({
  isOpen,
  onClose,
  invoiceId,
  defaultAmount,
  unitLabel,
}) => {
  const { currentUser, processMpesaPayment, formatKSh } = useApp();
  const [phone, setPhone] = useState(currentUser.phone || '0701456789');
  const [amount, setAmount] = useState(defaultAmount);
  const [step, setStep] = useState<'input' | 'prompt' | 'success'>('input');
  const [receiptCode, setReceiptCode] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleInitiate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStep('prompt');

    try {
      const result = await processMpesaPayment(invoiceId, phone, amount);
      if (result.success) {
        setReceiptCode(result.mpesaReceipt);
        setStep('success');
      }
    } catch {
      alert('Error processing M-Pesa payment');
      setStep('input');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('input');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-[#E7E4DE]">
        {/* Header */}
        <div className="bg-[#143642] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">
              M
            </div>
            <div>
              <h3 className="font-semibold text-base tracking-tight text-white">Safaricom M-Pesa Express</h3>
              <p className="text-xs text-[#E7E4DE]/70">Lipa na M-Pesa · Paybill 4082200</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'input' && (
            <form onSubmit={handleInitiate} className="space-y-4">
              <div className="bg-[#F8F6F2] p-4 rounded-xl border border-[#E7E4DE] text-xs space-y-1">
                <div className="flex justify-between text-[#687477]">
                  <span>Account / Unit:</span>
                  <span className="font-semibold text-[#202A2D]">{unitLabel}</span>
                </div>
                <div className="flex justify-between text-[#687477]">
                  <span>Business Name:</span>
                  <span className="font-semibold text-[#202A2D]">MAKAZI PROPERTIES LTD</span>
                </div>
                <div className="flex justify-between text-[#687477]">
                  <span>Paybill Number:</span>
                  <span className="font-mono font-bold text-[#143642]">4082200</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202A2D] mb-1.5">
                  Safaricom Phone Number
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-[#687477]">
                    🇰🇪 +254
                  </span>
                  <input
                    type="tel"
                    required
                    value={phone.replace(/^\+254\s?|^0/, '')}
                    onChange={(e) => setPhone('0' + e.target.value.replace(/\D/g, ''))}
                    placeholder="712345678"
                    className="w-full pl-20 pr-4 py-2.5 bg-white border border-[#E7E4DE] rounded-xl text-sm font-mono text-[#202A2D] focus:outline-hidden focus:border-[#B76935] focus:ring-1 focus:ring-[#B76935]"
                  />
                </div>
                <p className="text-[11px] text-[#687477] mt-1">
                  You will receive an STK prompt on this phone to enter your M-Pesa PIN.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202A2D] mb-1.5">
                  Amount to Pay (KSh)
                </label>
                <input
                  type="number"
                  required
                  min={100}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-white border border-[#E7E4DE] rounded-xl text-base font-semibold text-[#143642] focus:outline-hidden focus:border-[#B76935]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#B76935] hover:bg-[#a05b2d] text-white font-medium text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <Smartphone className="w-4 h-4" />
                  Request M-Pesa STK Push ({formatKSh(amount)})
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#687477]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-Bit SSL Encrypted & Safaricom Daraja API Verified</span>
              </div>
            </form>
          )}

          {step === 'prompt' && (
            <div className="py-8 text-center space-y-5">
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 animate-ping" />
                <div className="relative w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-200">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-semibold text-lg text-[#143642]">Check your handset now</h4>
                <p className="text-xs text-[#687477] max-w-xs mx-auto">
                  An STK push request has been dispatched to{' '}
                  <strong className="text-[#202A2D]">{phone}</strong>. Enter your M-Pesa PIN to complete payment of{' '}
                  <strong className="text-[#143642]">{formatKSh(amount)}</strong>.
                </p>
              </div>

              <div className="bg-[#F8F6F2] p-3 rounded-lg border border-[#E7E4DE] text-[11px] text-[#687477]">
                Simulating backend webhook verification with Safaricom Daraja gateway...
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="py-4 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="font-semibold text-xl text-[#143642]">Payment Confirmed</h4>
                <p className="text-xs text-emerald-700 font-medium mt-0.5">Rent payment successfully recorded</p>
              </div>

              <div className="bg-[#F8F6F2] rounded-xl p-4 border border-[#E7E4DE] text-left text-xs space-y-2">
                <div className="flex justify-between border-b border-[#E7E4DE] pb-1.5">
                  <span className="text-[#687477]">M-Pesa Receipt:</span>
                  <span className="font-mono font-bold text-[#143642]">{receiptCode}</span>
                </div>
                <div className="flex justify-between border-b border-[#E7E4DE] pb-1.5">
                  <span className="text-[#687477]">Amount Paid:</span>
                  <span className="font-semibold text-[#202A2D]">{formatKSh(amount)}</span>
                </div>
                <div className="flex justify-between border-b border-[#E7E4DE] pb-1.5">
                  <span className="text-[#687477]">Paid By:</span>
                  <span className="text-[#202A2D]">{currentUser.name} ({phone})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#687477]">Allocated Unit:</span>
                  <span className="text-[#202A2D]">{unitLabel}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleClose}
                  className="w-full py-2.5 bg-[#143642] hover:bg-[#0e2730] text-white font-medium text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Done & View Updated Ledger</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
