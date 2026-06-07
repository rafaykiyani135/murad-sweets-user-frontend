import { useEffect, useState } from 'react';
import { useCartStore } from './cartStore';

export function useCart() {
  const store = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return {
      cartItems: [],
      isCartOpen: false,
      isMixMatchOpen: false,
      mixMatchProduct: null,
      isCollectionModalOpen: false,
      collectionCategory: null,
      collectionSize: null,
      isPartyTrayModalOpen: false,
      toasts: [],
      fulfillment: 'pickup' as const,
      address: undefined,
      scheduledDate: '',
      scheduledSlot: '',
      contact: undefined,
      paymentMethod: 'cod' as const,
      addToCart: () => {},
      removeFromCart: () => {},
      updateQuantity: () => {},
      clearCart: () => {},
      setCartOpen: () => {},
      openMixMatch: () => {},
      closeMixMatch: () => {},
      openCollectionModal: () => {},
      closeCollectionModal: () => {},
      openPartyTrayModal: () => {},
      closePartyTrayModal: () => {},
      isSpecialtyModalOpen: false,
      openSpecialtyModal: () => {},
      closeSpecialtyModal: () => {},
      isPithaModalOpen: false,
      openPithaModal: () => {},
      closePithaModal: () => {},
      isMishtiPerPoundModalOpen: false,
      openMishtiPerPoundModal: () => {},
      closeMishtiPerPoundModal: () => {},
      addToast: () => {},
      removeToast: () => {},
      setFulfillmentType: () => {},
      setAddress: () => {},
      setSchedule: () => {},
      setContactInfo: () => {},
      setPaymentMethod: () => {},
      getCartSubtotal: () => 0,
      getCartCount: () => 0,
      getDeliveryFee: () => 0,
      getCartTotal: () => 0,
      mounted: false
    };
  }

  return {
    ...store,
    mounted: true
  };
}
