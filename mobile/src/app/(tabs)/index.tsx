import { MenuItem, useCart } from '@/context/CartContext';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// IMPORTANT: Replace with YOUR laptop's IP address (same one shown in Expo QR code)
const API_URL = 'http://192.168.0.195:8000';

export default function MenuScreen() {
  const { addToCart, totalItems, totalPrice } = useCart();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/menu`);
      const data = await response.json();
      setMenuItems(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch menu:', err);
      setError('Could not load menu. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: MenuItem }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>₹{item.price}</Text>
      </View>
      <TouchableOpacity style={styles.addButton} onPress={() => addToCart(item)}>
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>QwikQ</Text>
        <Text style={styles.headerSubtitle}>Campus Canteen Menu</Text>
      </View>

      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>Loading menu...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerBox}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchMenu}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={menuItems}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}

      {totalItems > 0 && (
        <TouchableOpacity
          style={styles.cartBar}
          onPress={() => router.push('/cart')}
        >
          <Text style={styles.cartText}>
            {totalItems} item(s) · ₹{totalPrice}
          </Text>
          <Text style={styles.cartButtonText}>View Cart →</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: { fontSize: 26, fontWeight: '700', color: '#1A1A1A' },
  headerSubtitle: { fontSize: 14, color: '#888', marginTop: 2 },
  centerBox: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { color: '#888', fontSize: 14 },
  errorText: { color: '#D32F2F', fontSize: 14, textAlign: 'center', paddingHorizontal: 30 },
  retryButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: { color: '#fff', fontWeight: '600' },
  list: { padding: 16, paddingBottom: 100 },
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
  image: { width: 64, height: 64, borderRadius: 10, backgroundColor: '#eee' },
  details: { flex: 1, marginLeft: 14 },
  category: { fontSize: 12, color: '#999', textTransform: 'uppercase' },
  name: { fontSize: 16, fontWeight: '600', color: '#1A1A1A', marginTop: 2 },
  price: { fontSize: 15, color: '#2E7D32', fontWeight: '600', marginTop: 4 },
  addButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  cartBar: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  cartText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  cartButtonText: { color: '#fff', fontWeight: '700' },
});