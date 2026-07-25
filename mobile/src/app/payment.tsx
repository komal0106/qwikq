import { useCart } from '@/context/CartContext';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const API_URL = 'http://10.141.163.206:8000';

type PaymentMethod = 'UPI' | 'Card';

export default function PaymentScreen() {
  const { totalPrice, clearCart, cartItems } = useCart();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('UPI');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePayment = async () => {
    setProcessing(true);
    try {
      // Step 1: Create payment
      const createRes = await fetch(`${API_URL}/payment/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalPrice,
          payment_method: selectedMethod,
        }),
      });
      const paymentData = await createRes.json();

      // Simulate a brief processing delay (like a real gateway would take)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Step 2: Confirm payment
      const confirmRes = await fetch(
        `${API_URL}/payment/confirm/${paymentData.order_id}`,
        { method: 'POST' }
      );
      await confirmRes.json();

      // Step 3: Create the actual order with items
      await fetch(`${API_URL}/orders/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          total_amount: totalPrice,
          items: cartItems.map((item) => ({
            menu_item_id: item.id,
            item_name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      });

      setSuccess(true);
      setTimeout(() => {
        clearCart();
        router.push('/(tabs)');
      }, 2000);
    } catch (err) {
      console.error('Payment failed:', err);
    } finally {
      setProcessing(false);
    }
  };

  if (success) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerBox}>
          <View style={styles.successCircle}>
            <Text style={styles.successCheck}>✓</Text>
          </View>
          <Text style={styles.successTitle}>Payment Successful!</Text>
          <Text style={styles.successSubtitle}>
            Your order has been placed
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
      </View>

      <View style={styles.amountBox}>
        <Text style={styles.amountLabel}>Amount to Pay</Text>
        <Text style={styles.amountValue}>₹{totalPrice}</Text>
      </View>

      <Text style={styles.sectionTitle}>Select Payment Method</Text>

      <TouchableOpacity
        style={[
          styles.methodCard,
          selectedMethod === 'UPI' && styles.methodCardSelected,
        ]}
        onPress={() => setSelectedMethod('UPI')}
      >
        <Text style={styles.methodText}>UPI</Text>
        {selectedMethod === 'UPI' && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.methodCard,
          selectedMethod === 'Card' && styles.methodCardSelected,
        ]}
        onPress={() => setSelectedMethod('Card')}
      >
        <Text style={styles.methodText}>Credit / Debit Card</Text>
        {selectedMethod === 'Card' && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.payButton}
        onPress={handlePayment}
        disabled={processing}
      >
        {processing ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.payButtonText}>Pay ₹{totalPrice}</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 45,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: { fontSize: 16, color: '#4F46E5', marginRight: 16, fontWeight: '600' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1A1A1A' },
  amountBox: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 24,
    borderRadius: 14,
    alignItems: 'center',
  },
  amountLabel: { fontSize: 14, color: '#888' },
  amountValue: { fontSize: 36, fontWeight: '700', color: '#1A1A1A', marginTop: 8 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginLeft: 20,
    marginBottom: 10,
  },
  methodCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 18,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#fff',
  },
  methodCardSelected: {
    borderColor: '#4F46E5',
  },
  methodText: { fontSize: 16, fontWeight: '500', color: '#1A1A1A' },
  checkmark: { fontSize: 18, color: '#4F46E5', fontWeight: '700' },
  payButton: {
    backgroundColor: '#4F46E5',
    margin: 20,
    marginTop: 30,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  payButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  centerBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  successCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  successCheck: { fontSize: 40, color: '#fff', fontWeight: '700' },
  successTitle: { fontSize: 20, fontWeight: '700', color: '#1A1A1A' },
  successSubtitle: { fontSize: 14, color: '#888', marginTop: 8 },
});