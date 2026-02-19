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
  Platform
} from 'react-native';

const cartIconImage = require('./image_1.png');

export default function App() {
  const [products, setProducts] = useState([]);

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
            placeholder="Цена (грн)"
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
            <Text style={styles.addButtonText}>ДОБАВИТЬ В КАТАЛОГ</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={products}
          numColumns={2}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 6 }}
          renderItem={({ item }) => (
            <View style={styles.card}>

              <TouchableOpacity
                style={styles.deleteTag}
                onPress={() => deleteProduct(item.id)}
              >
                <Text style={styles.deleteText}>Удалить</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.heartIcon}>
                <Text style={styles.heartText}>♡</Text>
              </TouchableOpacity>

              <Image
                source={{ uri: item.image }}
                style={styles.productImage}
              />

              <Text
                style={styles.productName}
                numberOfLines={2}
              >
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

            </View>
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

  container: {
    flex: 1,
  },

  form: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 10,
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
    backgroundColor: '#fafafa',
  },

  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  addButton: {
    backgroundColor: '#00a046',
    padding: 14,
    borderRadius: 6,
    marginTop: 8,
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

  deleteTag: {
    position: 'absolute',
    left: 8,
    top: 8,
    zIndex: 1,
  },

  deleteText: {
    fontSize: 12,
    color: '#f84147',
  },

  heartIcon: {
    position: 'absolute',
    right: 8,
    top: 6,
  },

  heartText: {
    fontSize: 20,
    color: '#ffa500',
  },

  productImage: {
    width: '100%',
    height: 120,
    resizeMode: 'contain',
    marginTop: 18,
    marginBottom: 6,
  },

  productName: {
    fontSize: 14,
    height: 36,
    marginBottom: 6,
  },

  oldPrice: {
    fontSize: 13,
    color: '#999',
    textDecorationLine: 'line-through',
  },

  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },

  productPrice: {
    fontSize: 22,
    fontWeight: 'bold',
  },

  cartButton: {
    padding: 4,
  },

  cartIcon: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
  },

  bottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: 4,
  },

  shippingText: {
    fontSize: 12,
    color: '#00a046',
    flex: 1,
    paddingRight: 6,
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
});
