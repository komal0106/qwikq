import { useCart } from '@/context/CartContext';
import { router } from 'expo-router';
import {
    FlatList,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function CartScreen() {
  const { cartItems, addToCart, removeFromCart, totalPrice, clearCart } = useCart();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Cart</Text>
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Your cart is empty</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <View style={styles.details}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.price}>₹{item.price} each</Text>
                </View>
                <View style={styles.qtyControl}>
                  <TouchableOpacity
                    style={styles.qtyButton}
                    onPress={() => removeFromCart(item.id)}
                  >
                    <Text style={styles.qtyButtonText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyText}>{item.quantity}</Text>
                  <TouchableOpacity
                    style={styles.qtyButton}
                    onPress={() => addToCart(item)}
                  >
                    <Text style={styles.qtyButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />

          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>₹{totalPrice}</Text>
            </View>
            <TouchableOpacity style={styles.checkoutButton}>
              <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
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
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#999' },
  list: { padding: 16 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 14,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  image: { width: 56, height: 56, borderRadius: 10, backgroundColor: '#eee' },
  details: { flex: 1, marginLeft: 14 },
  name: { fontSize: 15, fontWeight: '600', color: '#1A1A1A' },
  price: { fontSize: 13, color: '#888', marginTop: 2 },
  qtyControl: { flexDirection: 'row', alignItems: 'center' },
  qtyButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#EEF0FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyButtonText: { fontSize: 16, fontWeight: '700', color: '#4F46E5' },
  qtyText: { marginHorizontal: 10, fontSize: 15, fontWeight: '600' },
  footer: {
    padding: 40,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  totalLabel: { fontSize: 16, color: '#666' },
  totalValue: { fontSize: 20, fontWeight: '700', color: '#1A1A1A' },
  checkoutButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  checkoutButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});