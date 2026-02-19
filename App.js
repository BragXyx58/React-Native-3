import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Switch,
  StatusBar as RNStatusBar,
  Platform,
  ScrollView
} from 'react-native';

const cartIconImage = require('./image_1.png');

export default function App() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [oldPrice, setOldPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isFreeShipping, setIsFreeShipping] = useState(false);
  const [isSmart, setIsSmart] = useState(false);

  const addProduct = () => {
    if (!name || !price) return;

    const newProduct = {
      id: Date.now().toString(),
      name,
      price,
      oldPrice,
      image: imageUrl || 'https://via.placeholder.com/300x300.png?text=No+Image',
      isFreeShipping,
      isSmart,
    };

    setProducts([...products, newProduct]);

    setName('');
    setPrice('');
    setOldPrice('');
    setImageUrl('');
    setIsFreeShipping(false);
    setIsSmart(false);
  };

  const deleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

    if (selectedProduct) {
    return (
      <View style={styles.safeArea}>
        <ScrollView style={{ flex: 1 }}>
          <View style={styles.detailsContainer}>

            <Text style={styles.detailsTitle}>
              {selectedProduct.name}
            </Text>

            <Text style={styles.rating}>
              ⭐⭐⭐⭐⭐ {selectedProduct.reviews} 3478 отзывов
            </Text>

            {selectedProduct.isSmart && (
              <View style={styles.smartBadgeLarge}>
                <Text style={styles.smartText}>SMART</Text>
              </View>
            )}

            <Image
              source={{ uri: selectedProduct.image }}
              style={styles.detailsImage}
            />

            <Text style={styles.stock}>Є в наявності</Text>

            {selectedProduct.oldPrice ? (
              <Text style={styles.oldPriceLarge}>
                {selectedProduct.oldPrice} ₴
              </Text>
            ) : null}

            <Text
              style={[
                styles.priceLarge,
                { color: selectedProduct.oldPrice ? '#f84147' : '#222' }
              ]}
            >
              {selectedProduct.price} ₴
            </Text>

            {selectedProduct.isFreeShipping && (
              <Text style={styles.shippingLarge}>
                Бесплатная доставка
              </Text>
            )}

            <TouchableOpacity style={styles.buyButton}>
              <Text style={styles.buyText}>Купити</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedProduct(null)}
            >
              <Text style={{ color: '#fff' }}>Закрыть</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.safeArea}>
      <View style={styles.container}>

        <View style={styles.form}>
          <Text style={styles.header}>Добавить товар</Text>

          <TextInput
            placeholder="Название товара"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />

          <TextInput
            placeholder="Цена"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            style={styles.input}
          />

          <TextInput
            placeholder="Старая цена (необязательно)"
            value={oldPrice}
            onChangeText={setOldPrice}
            keyboardType="numeric"
            style={styles.input}
          />

          <TextInput
            placeholder="URL картинки"
            value={imageUrl}
            onChangeText={setImageUrl}
            style={styles.input}
          />

          <View style={styles.switchRow}>
            <Text>Бесплатная доставка</Text>
            <Switch value={isFreeShipping} onValueChange={setIsFreeShipping} />
          </View>

          <View style={styles.switchRow}>
            <Text>SMART</Text>
            <Switch value={isSmart} onValueChange={setIsSmart} />
          </View>

          <TouchableOpacity style={styles.addButton} onPress={addProduct}>
            <Text style={styles.addButtonText}>Добавить</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={products}
          numColumns={2}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => setSelectedProduct(item)}
              activeOpacity={0.9}
            >

              <Image
                source={{ uri: item.image }}
                style={styles.productImage}
              />

              <Text numberOfLines={2} style={styles.productName}>
                {item.name}
              </Text>

              {item.oldPrice ? (
                <Text style={styles.oldPrice}>
                  {item.oldPrice} ₴
                </Text>
              ) : null}

              <View style={styles.priceRow}>
                <Text
                  style={[
                    styles.productPrice,
                    { color: item.oldPrice ? '#f84147' : '#222' }
                  ]}
                >
                  {item.price} ₴
                </Text>

                <TouchableOpacity style={styles.cartButton}>
                  <Image
                    source={cartIconImage}
                    style={styles.cartIcon}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.bottomRow}>
                {item.isFreeShipping && (
                  <Text style={styles.shippingText}>
                    Бесплатная доставка
                  </Text>
                )}

                {item.isSmart && (
                  <View style={styles.smartBadge}>
                    <Text style={styles.smartText}>SMART</Text>
                  </View>
                )}
              </View>

            </TouchableOpacity>
          )}
        />

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },

  container: { flex: 1 },

  form: {
    padding: 16,
    backgroundColor: '#fff',
  },

  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
  },

  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  addButton: {
    backgroundColor: '#00a046',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },

  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  card: {
    backgroundColor: '#fff',
    flex: 1,
    margin: 6,
    padding: 10,
    borderRadius: 6,
    maxWidth: '48%',
  },

  productImage: {
    width: '100%',
    height: 120,
    resizeMode: 'contain',
    marginBottom: 6,
  },

  productName: {
    fontSize: 14,
    marginBottom: 4,
  },

  oldPrice: {
    textDecorationLine: 'line-through',
    color: '#999',
    fontSize: 12,
  },

  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },

  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  cartButton: {
    padding: 4,
  },

  cartIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },

  shippingText: {
    fontSize: 12,
    color: '#00a046',
    flex: 1,
  },

  smartBadge: {
    backgroundColor: '#ffdb00',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
  },

  smartText: {
    fontSize: 10,
    fontWeight: 'bold',
  },

   detailsContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },

  detailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },

  rating: {
    marginBottom: 8,
  },

  detailsImage: {
    width: '100%',
    height: 250,
    resizeMode: 'contain',
    marginVertical: 12,
  },

  priceLarge: {
    fontSize: 28,
    fontWeight: 'bold',
  },

  oldPriceLarge: {
    textDecorationLine: 'line-through',
    color: '#999',
  },

  stock: {
    color: '#00a046',
    marginBottom: 6,
  },

  shippingLarge: {
    color: '#00a046',
    marginVertical: 6,
  },

  buyButton: {
    backgroundColor: '#00a046',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 12,
  },

  buyText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  closeButton: {
    marginTop: 12,
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },

  smartBadgeLarge: {
    backgroundColor: '#ffdb00',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
    marginBottom: 6,
  },

  smartText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});
