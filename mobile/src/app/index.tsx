import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Dummy menu data — we'll replace this with real backend data later
const MENU_ITEMS = [
  {
    id: '1',
    name: 'Veg Puff',
    price: 20,
    category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300',
  },
  {
    id: '2',
    name: 'Masala Dosa',
    price: 45,
    category: 'Breakfast',
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=300',
  },
  {
    id: '3',
    name: 'Veg Biryani',
    price: 80,
    category: 'Lunch',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300',
  },
  {
    id: '4',
    name: 'Cold Coffee',
    price: 35,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300',
  },
  {
    id: '5',
    name: 'Samosa',
    price: 15,
    category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300',
  },
];

export default function MenuScreen() {
  const [cart, setCart] = useState<string[]>([]);

  const addToCart = (id: string) => {
    setCart([...cart, id]);
  };

  const renderItem = ({ item }: { item: (typeof MENU_ITEMS)[0] }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>₹{item.price}</Text>
      </View>
      <TouchableOpacity style={styles.addButton} onPress={() => addToCart(item.id)}>
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

      <FlatList
        data={MENU_ITEMS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />

      {cart.length > 0 && (
        <View style={styles.cartBar}>
          <Text style={styles.cartText}>{cart.length} item(s) in cart</Text>
          <TouchableOpacity style={styles.cartButton}>
            <Text style={styles.cartButtonText}>View Cart</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
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
  image: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: '#eee',
  },
  details: {
    flex: 1,
    marginLeft: 14,
  },
  category: {
    fontSize: 12,
    color: '#999',
    textTransform: 'uppercase',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginTop: 2,
  },
  price: {
    fontSize: 15,
    color: '#2E7D32',
    fontWeight: '600',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  cartBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  cartText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  cartButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  cartButtonText: {
    color: '#4F46E5',
    fontWeight: '700',
  },
});