'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Truck,
  MapPin,
  Search,
  X,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowRight,
  ChevronLeft,
  Navigation,
  PackageOpen,
} from 'lucide-react';
import { useFulfillmentStore } from '@/app/store/fulfillmentStore';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Suggestion {
  place_name: string;
  center: [number, number]; // [lng, lat]
}

type ModalStep = 'method' | 'address' | 'validating' | 'eligible' | 'ineligible';

// ─── Component ────────────────────────────────────────────────────────────────
export default function FulfillmentModal() {
  const {
    orderType,
    address: savedAddress,
    coordinates: savedCoordinates,
    drivingDistanceMiles,
    deliveryFeeCents,
    isEligible,
    isModalOpen,
    setPickup,
    setDelivery,
    setDistanceResult,
    closeModal,
    hasValidFulfillment,
  } = useFulfillmentStore();

  // ── Local state ──
  const [step, setStep] = useState<ModalStep>('method');
  const [addressInput, setAddressInput] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [validatedMiles, setValidatedMiles] = useState<number | null>(null);
  const [validatedFeeCents, setValidatedFeeCents] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suggestionBoxRef = useRef<HTMLDivElement>(null);

  // ── When modal opens, decide which step to land on ──
  useEffect(() => {
    if (isModalOpen) {
      // If editing existing fulfillment
      if (orderType === 'delivery' && savedAddress) {
        setAddressInput(savedAddress);
        setSelectedSuggestion(
          savedCoordinates
            ? { place_name: savedAddress, center: [savedCoordinates.lng, savedCoordinates.lat] }
            : null
        );
        setStep('method');
      } else {
        setStep('method');
        setAddressInput('');
        setSelectedSuggestion(null);
      }
      setSuggestions([]);
      setValidationError(null);
      setValidatedMiles(null);
      setValidatedFeeCents(null);
    }
  }, [isModalOpen]);

  // ── Address autocomplete (debounced) ──
  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    setIsFetchingSuggestions(true);
    try {
      const res = await fetch(`/api/address-search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setSuggestions(data.suggestions || []);
      setShowSuggestions(true);
    } catch {
      setSuggestions([]);
    } finally {
      setIsFetchingSuggestions(false);
    }
  }, []);

  const handleAddressInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setAddressInput(val);
    setSelectedSuggestion(null); // Clear selection on manual edit
    setValidationError(null);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      fetchSuggestions(val);
    }, 300);
  };

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    setAddressInput(suggestion.place_name);
    setSelectedSuggestion(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
    setValidationError(null);
  };

  // ── Close suggestion dropdown on outside click ──
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        suggestionBoxRef.current &&
        !suggestionBoxRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // ── Validate address and calculate distance + fee ──
  const handleValidateAddress = async () => {
    if (!selectedSuggestion) {
      setValidationError('Please select an address from the suggestions list.');
      return;
    }

    setStep('validating');
    setValidationError(null);

    const [lng, lat] = selectedSuggestion.center;

    try {
      // 1. Get driving distance via OSRM
      const distRes = await fetch(`/api/distance?lng=${lng}&lat=${lat}`);
      if (!distRes.ok) {
        const err = await distRes.json();
        throw new Error(err.error || 'Unable to calculate delivery distance.');
      }
      const { distanceMiles } = await distRes.json();

      // 2. Calculate delivery fee
      const feeRes = await fetch(`/api/delivery-fee?miles=${distanceMiles}`);
      if (!feeRes.ok) {
        throw new Error('Unable to calculate delivery fee.');
      }
      const { feeCents, eligible, message } = await feeRes.json();

      // 3. Store address in fulfillment store (regardless of eligibility)
      setDelivery(selectedSuggestion.place_name, { lat, lng });
      setDistanceResult(distanceMiles, feeCents, eligible);

      setValidatedMiles(distanceMiles);
      setValidatedFeeCents(feeCents);

      if (eligible) {
        setStep('eligible');
      } else {
        setStep('ineligible');
        setValidationError(message || 'Sorry, delivery is only available within 50 miles.');
      }
    } catch (err: any) {
      setStep('address');
      setValidationError(err.message || 'Unable to validate address. Please try again.');
    }
  };

  // ── Handle modal close (only allow if fulfillment is set) ──
  const handleClose = () => {
    if (hasValidFulfillment()) {
      closeModal();
    }
  };

  // ── Don't render if modal shouldn't be shown ──
  if (!isModalOpen) return null;

  const feeDisplay =
    validatedFeeCents === null
      ? '—'
      : validatedFeeCents === 0
        ? 'FREE'
        : `$${(validatedFeeCents / 100).toFixed(2)}`;

  const distanceDisplay =
    validatedMiles === null ? '' : `${validatedMiles.toFixed(1)} mi`;

  return (
    <AnimatePresence>
      {isModalOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
          />

          {/* Modal Panel */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-lg bg-[#1a1008] rounded-2xl shadow-2xl border border-[#c9a84c]/20 overflow-hidden">

              {/* Decorative top gradient bar */}
              <div className="h-1 w-full bg-gradient-to-r from-[#c9a84c] via-[#f0d080] to-[#c9a84c]" />

              {/* Close button — only show if fulfillment already set (edit mode) */}
              {hasValidFulfillment() && (
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-white/10 text-white/60 hover:bg-white/20 hover:text-white transition-colors"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              {/* ── STEP: METHOD SELECTION ────────────────────────────── */}
              {step === 'method' && (
                <div className="p-7 space-y-7">
                  {/* Header */}
                  <div className="text-center space-y-1.5">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#c9a84c]/15 border border-[#c9a84c]/30 mx-auto mb-3">
                      <PackageOpen className="h-6 w-6 text-[#c9a84c]" />
                    </div>
                    <h2 className="font-heading text-2xl text-white font-extrabold tracking-tight">
                      How would you like your order?
                    </h2>
                    <p className="text-sm text-white/55 font-body">
                      Choose your fulfillment method to get started.
                    </p>
                  </div>

                  {/* Method Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Pickup Card */}
                    <button
                      id="fulfillment-pickup-btn"
                      onClick={() => setPickup()}
                      className="group relative flex flex-col items-center text-center gap-3 p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-[#c9a84c]/10 hover:border-[#c9a84c]/50 transition-all duration-200 active:scale-[0.98]"
                    >
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/30 group-hover:border-emerald-400/60 transition-colors">
                        <MapPin className="h-6 w-6 text-emerald-400" />
                      </div>
                      <div>
                        <p className="font-cinzel text-sm font-bold text-white uppercase tracking-wider">Pickup</p>
                        <p className="text-xs text-white/50 font-body mt-1 leading-relaxed">
                          Pick Up Location: Sugar Land Texas 77498.
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-[10px] font-cinzel font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                        Free
                      </span>
                    </button>

                    {/* Delivery Card */}
                    <button
                      id="fulfillment-delivery-btn"
                      onClick={() => {
                        setStep('address');
                        setTimeout(() => inputRef.current?.focus(), 100);
                      }}
                      className="group relative flex flex-col items-center text-center gap-3 p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-[#c9a84c]/10 hover:border-[#c9a84c]/50 transition-all duration-200 active:scale-[0.98]"
                    >
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#c9a84c]/15 border border-[#c9a84c]/30 group-hover:border-[#c9a84c]/60 transition-colors">
                        <Truck className="h-6 w-6 text-[#c9a84c]" />
                      </div>
                      <div>
                        <p className="font-cinzel text-sm font-bold text-white uppercase tracking-wider">Delivery</p>
                        <p className="text-xs text-white/50 font-body mt-1 leading-relaxed">
                          We deliver within 50 miles. Fee based on distance.
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-[10px] font-cinzel font-bold uppercase tracking-wider bg-[#c9a84c]/15 text-[#c9a84c] border border-[#c9a84c]/25">
                        Up to 50 mi
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP: ADDRESS ENTRY ───────────────────────────────── */}
              {step === 'address' && (
                <div className="p-7 space-y-6">
                  {/* Header with back button */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setStep('method')}
                      className="p-1.5 rounded-full bg-white/10 text-white/60 hover:bg-white/20 hover:text-white transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <div>
                      <h2 className="font-heading text-xl text-white font-extrabold">Enter Delivery Address</h2>
                      <p className="text-xs text-white/50 font-body">Select an address from the suggestions.</p>
                    </div>
                  </div>

                  {/* Address input + autocomplete */}
                  <div className="relative">
                    <div className="relative flex items-center">
                      <Search className="absolute left-3.5 h-4 w-4 text-white/40 pointer-events-none" />
                      <input
                        ref={inputRef}
                        id="delivery-address-input"
                        type="text"
                        value={addressInput}
                        onChange={handleAddressInputChange}
                        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                        placeholder="Start typing your address..."
                        autoComplete="off"
                        className="w-full pl-10 pr-10 py-3 bg-white/8 border border-white/15 rounded-xl text-sm text-white placeholder-white/35 font-body focus:outline-none focus:border-[#c9a84c]/60 focus:ring-1 focus:ring-[#c9a84c]/30 transition-colors"
                      />
                      {addressInput && (
                        <button
                          onClick={() => {
                            setAddressInput('');
                            setSelectedSuggestion(null);
                            setSuggestions([]);
                            inputRef.current?.focus();
                          }}
                          className="absolute right-3 p-0.5 text-white/40 hover:text-white/70 transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                      {isFetchingSuggestions && (
                        <Loader2 className="absolute right-3 h-4 w-4 text-[#c9a84c] animate-spin" />
                      )}
                    </div>

                    {/* Suggestions Dropdown */}
                    <AnimatePresence>
                      {showSuggestions && suggestions.length > 0 && (
                        <motion.div
                          ref={suggestionBoxRef}
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 right-0 mt-1.5 z-10 bg-[#251606] border border-[#c9a84c]/20 rounded-xl shadow-2xl overflow-hidden"
                        >
                          {suggestions.map((suggestion, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSelectSuggestion(suggestion)}
                              className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-[#c9a84c]/10 transition-colors border-b border-white/5 last:border-b-0"
                            >
                              <MapPin className="h-3.5 w-3.5 text-[#c9a84c]/70 shrink-0 mt-0.5" />
                              <span className="text-xs text-white/80 font-body leading-snug">{suggestion.place_name}</span>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Selected address confirmation */}
                  {selectedSuggestion && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2.5 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/25"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      <p className="text-xs text-emerald-300 font-body leading-snug">{selectedSuggestion.place_name}</p>
                    </motion.div>
                  )}

                  {/* Validation error */}
                  {validationError && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-start gap-2.5 p-3 rounded-lg bg-red-500/10 border border-red-500/25"
                    >
                      <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-red-300 font-body leading-snug">{validationError}</p>
                    </motion.div>
                  )}

                  {/* CTA */}
                  <button
                    id="validate-address-btn"
                    onClick={handleValidateAddress}
                    disabled={!selectedSuggestion}
                    className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-cinzel text-sm font-bold uppercase tracking-widest transition-all duration-200 ${selectedSuggestion
                      ? 'bg-[#c9a84c] text-[#1a1008] hover:bg-[#f0d080] active:scale-[0.98] shadow-lg shadow-[#c9a84c]/20'
                      : 'bg-white/10 text-white/30 cursor-not-allowed'
                      }`}
                  >
                    Check Delivery Availability
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  {/* Switch to pickup link */}
                  <p className="text-center text-xs text-white/40 font-body">
                    Prefer to pick up?{' '}
                    <button
                      onClick={() => setPickup()}
                      className="text-[#c9a84c] hover:text-[#f0d080] underline underline-offset-2 transition-colors"
                    >
                      Switch to Pickup
                    </button>
                  </p>
                </div>
              )}

              {/* ── STEP: VALIDATING (loading) ────────────────────────── */}
              {step === 'validating' && (
                <div className="p-10 flex flex-col items-center gap-5 text-center">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-2 border-[#c9a84c]/20 flex items-center justify-center">
                      <Loader2 className="h-8 w-8 text-[#c9a84c] animate-spin" />
                    </div>
                  </div>
                  <div>
                    <p className="font-cinzel text-base font-bold text-white uppercase tracking-wider">
                      Checking availability...
                    </p>
                    <p className="text-xs text-white/50 font-body mt-1">
                      Calculating driving distance and delivery fee.
                    </p>
                  </div>
                </div>
              )}

              {/* ── STEP: ELIGIBLE ────────────────────────────────────── */}
              {step === 'eligible' && (
                <div className="p-7 space-y-6">
                  {/* Success header */}
                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 mx-auto mb-3">
                      <CheckCircle2 className="h-7 w-7 text-emerald-400" />
                    </div>
                    <h2 className="font-heading text-xl text-white font-extrabold">Delivery Available!</h2>
                    <p className="text-xs text-white/55 font-body leading-relaxed px-4">
                      Great news — we deliver to your area.
                    </p>
                  </div>

                  {/* Delivery details card */}
                  <div className="rounded-xl border border-white/10 bg-white/5 divide-y divide-white/8 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3">
                      <span className="text-xs text-white/50 font-body">Delivering to</span>
                      <span className="text-xs text-white font-body font-semibold text-right max-w-[60%] leading-snug">
                        {savedAddress}
                      </span>
                    </div>
                    <div className="flex items-center justify-between px-4 py-3">
                      <span className="text-xs text-white/50 font-body">Driving distance</span>
                      <span className="text-xs text-white font-cinzel font-bold">{distanceDisplay}</span>
                    </div>
                    <div className="flex items-center justify-between px-4 py-3">
                      <span className="text-xs text-white/50 font-body">Delivery fee</span>
                      <span
                        className={`text-sm font-cinzel font-bold ${validatedFeeCents === 0 ? 'text-emerald-400' : 'text-[#c9a84c]'
                          }`}
                      >
                        {feeDisplay}
                      </span>
                    </div>
                  </div>

                  {/* CTA */}
                  <button
                    id="start-browsing-btn"
                    onClick={closeModal}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#c9a84c] text-[#1a1008] font-cinzel text-sm font-bold uppercase tracking-widest hover:bg-[#f0d080] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-[#c9a84c]/20"
                  >
                    Start Browsing
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  {/* Change address link */}
                  <p className="text-center text-xs text-white/40 font-body">
                    Wrong address?{' '}
                    <button
                      onClick={() => {
                        setStep('address');
                        setValidatedMiles(null);
                        setValidatedFeeCents(null);
                      }}
                      className="text-[#c9a84c] hover:text-[#f0d080] underline underline-offset-2 transition-colors"
                    >
                      Change Address
                    </button>
                  </p>
                </div>
              )}

              {/* ── STEP: INELIGIBLE ──────────────────────────────────── */}
              {step === 'ineligible' && (
                <div className="p-7 space-y-6">
                  {/* Error header */}
                  <div className="text-center space-y-2">

                    <h2 className="font-heading text-xl text-white font-extrabold">Outside Delivery Area</h2>
                    <p className="text-sm text-white/55 font-body leading-relaxed px-4">
                      {validationError || 'Sorry, delivery is only available within 50 miles of our store.'}
                    </p>
                  </div>

                  {/* Distance info */}


                  {/* Actions */}
                  <div className="space-y-3">
                    <button
                      id="change-address-btn"
                      onClick={() => {
                        setStep('address');
                        setValidatedMiles(null);
                        setValidatedFeeCents(null);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#c9a84c] text-[#1a1008] font-cinzel text-sm font-bold uppercase tracking-widest hover:bg-[#f0d080] active:scale-[0.98] transition-all duration-200"
                    >
                      <MapPin className="h-4 w-4" />
                      Change Address
                    </button>
                    <button
                      id="switch-to-pickup-btn"
                      onClick={() => setPickup()}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/15 bg-white/5 text-white font-cinzel text-sm font-bold uppercase tracking-widest hover:bg-white/10 active:scale-[0.98] transition-all duration-200"
                    >
                      <MapPin className="h-4 w-4 text-emerald-400" />
                      Switch to Pickup
                    </button>
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        </>
      )
      }
    </AnimatePresence >
  );
}
