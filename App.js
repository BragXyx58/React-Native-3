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
import { Picker } from '@react-native-picker/picker';
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

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  const [cart, setCart] = useState([]);

  const [areas, setAreas] = useState([]);
  const [cities, setCities] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);

  const API_KEY = "NOVA POST API KEY";

  const fetchAreas = async () => {
    const res = await fetch("https://api.novaposhta.ua/v2.0/json/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        apiKey: API_KEY,
        modelName: "Address",
        calledMethod: "getAreas",
        methodProperties: {}
      })
    });
    const data = await res.json();
    setAreas(data.data);
  };

  const fetchCities = async (areaRef) => {
    const res = await fetch("https://api.novaposhta.ua/v2.0/json/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        apiKey: API_KEY,
        modelName: "Address",
        calledMethod: "getCities",
        methodProperties: { AreaRef: areaRef }
      })
    });
    const data = await res.json();
    setCities(data.data);
  };

  const fetchWarehouses = async (cityRef) => {
    const res = await fetch("https://api.novaposhta.ua/v2.0/json/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        apiKey: API_KEY,
        modelName: "Address",
        calledMethod: "getWarehouses",
        methodProperties: { CityRef: cityRef }
      })
    });
    const data = await res.json();
    setWarehouses(data.data);
  };

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
      isFavorite: false,
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

  const toggleFavorite = (id) => {
    setProducts(products.map(p =>
      p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
    ));
  };
  
  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const renderCheckout = () => {
    return (
      <View style={styles.safeArea}>
        <ScrollView style={{ flex: 1, padding: 16 }}>

          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>
            Оформление заказа
          </Text>

          <TouchableOpacity
            style={styles.addButton}
            onPress={fetchAreas}
          >
            <Text style={styles.addButtonText}>Загрузить области</Text>
          </TouchableOpacity>

          {areas.length > 0 && (
            <View style={styles.pickerContainer}>
            <Picker
              style={styles.picker}
              selectedValue={selectedArea?.Ref}
              onValueChange={(value) => {
                const area = areas.find(a => a.Ref === value);
                setSelectedArea(area);
                fetchCities(value);
              }}
            >
              <Picker.Item label="Выберите область" value={null} color="#999" />
              {areas.map(area => (
                <Picker.Item
                  key={area.Ref}
                  label={area.Description}
                  value={area.Ref}
                />
              ))}
            </Picker>
          </View>
        )}

          {cities.length > 0 && (
            <View style={styles.pickerContainer}>
            <Picker
              style={styles.picker}
              selectedValue={selectedCity?.Ref}
              onValueChange={(value) => {
                const city = cities.find(c => c.Ref === value);
                setSelectedCity(city);
                fetchWarehouses(value);
              }}
            >
              <Picker.Item label="Выберите город" value={null} color="#999" />
              {cities.map(city => (
                <Picker.Item
                  key={city.Ref}
                  label={city.Description}
                  value={city.Ref}
                />
              ))}
            </Picker>
          </View>
        )}

          {warehouses.length > 0 && (
            <View style={styles.pickerContainer}>
            <Picker
              style={styles.picker}
              selectedValue={selectedWarehouse?.Ref}
              onValueChange={(value) => {
                const w = warehouses.find(w => w.Ref === value);
                setSelectedWarehouse(w);
              }}
            >
              <Picker.Item label="Выберите отделение" value={null} color="#999" />
              {warehouses.map(w => (
                <Picker.Item
                  key={w.Ref}
                  label={w.Description}
                  value={w.Ref}
                />
              ))}
            </Picker>
          </View>
        )}

          <TouchableOpacity
            style={styles.buyButton}
            onPress={() => {
              alert("Заказ оформлен!");
              setCart([]);
              setIsCheckoutOpen(false);
              setIsCartOpen(false);
            }}
          >
            <Text style={styles.buyText}>Подтвердить заказ</Text>
          </TouchableOpacity>

        </ScrollView>
      </View>
    );
  };

  if (isCheckoutOpen) {
    return renderCheckout();
  }
  
  const renderCart = () => {
    const total = cart.reduce((sum, item) => sum + Number(item.price), 0);

    return (
      <View style={styles.safeArea}>
        <ScrollView style={{ flex: 1, padding: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>
            Корзина
          </Text>

          {cart.length === 0 ? (
            <Text>Корзина пуста</Text>
          ) : (
            cart.map(item => (
              <View
                key={item.id}
                style={{
                  backgroundColor: '#fff',
                  padding: 10,
                  marginBottom: 8,
                  borderRadius: 6
                }}
              >
                <Text>{item.name}</Text>
                <Text>{item.price} ₴</Text>
              </View>
            ))
          )}

          <Text style={{ fontSize: 18, marginVertical: 12 }}>
            Итого: {total} ₴
          </Text>

          <TouchableOpacity
            style={styles.buyButton}
            onPress={() => {
              setIsCartOpen(false);
              setIsCheckoutOpen(true);
            }}
          >
            <Text style={styles.buyText}>Оформить заказ</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsCartOpen(false)}
          >
            <Text style={{ color: '#fff' }}>Назад</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  };

  const renderProfile = () => {
    const favoriteProducts = products.filter(p => p.isFavorite);

    return (
      <View style={styles.safeArea}>
        <ScrollView style={{ flex: 1, padding: 16 }}>

          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>
            Профиль пользователя
          </Text>

          <TextInput
            placeholder="ФИО"
            value={fullName}
            onChangeText={setFullName}
            style={styles.input}
          />

          <TextInput
            placeholder="Почта"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />

          <TextInput
            placeholder="Частый адрес доставки"
            value={address}
            onChangeText={setAddress}
            style={styles.input}
          />

          <Text style={{ fontSize: 18, marginVertical: 12 }}>
            Избранное
          </Text>

          {favoriteProducts.length === 0 ? (
            <Text>Нет избранных товаров</Text>
          ) : (
            favoriteProducts.map(item => (
              <View
                key={item.id}
                style={{
                  backgroundColor: '#fff',
                  padding: 10,
                  marginBottom: 8,
                  borderRadius: 6,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <View>
                  <Text style={{ fontWeight: 'bold' }}>
                    {item.name}
                  </Text>
                  <Text>{item.price} ₴</Text>
                </View>

                <TouchableOpacity
                  onPress={() => toggleFavorite(item.id)}
                  style={{
                    backgroundColor: '#f84147',
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 4
                  }}
                >
                  <Text style={{ color: '#fff' }}>
                    Убрать
                  </Text>
                </TouchableOpacity>
              </View>
            ))
          )}

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsProfileOpen(false)}
          >
            <Text style={{ color: '#fff' }}>Назад</Text>
          </TouchableOpacity>

        </ScrollView>
      </View>
    );
  };


  if (isCartOpen) {
    return renderCart();
  }

  if (isProfileOpen) {
    return renderProfile();
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
        <TouchableOpacity
          style={{ padding: 10, backgroundColor: '#222', alignItems: 'center' }}
          onPress={() => setIsProfileOpen(true)}
        >
          <Text style={{ color: '#fff' }}>Профиль</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ padding: 10, backgroundColor: '#f84147', alignItems: 'center' }}
          onPress={() => setIsCartOpen(true)}
        >
          <Text style={{ color: '#fff' }}>
            Корзина ({cart.length})
          </Text>
        </TouchableOpacity>
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
            <TouchableOpacity
              style={{ position: 'absolute', right: 8, top: 8, zIndex: 1 }}
              onPress={() => toggleFavorite(item.id)}
            >
              <Text style={{ fontSize: 20 }}>
                {item.isFavorite ? '❤️' : '🤍'}
              </Text>
            </TouchableOpacity>
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

                <TouchableOpacity
                  style={styles.cartButton}
                  onPress={() => addToCart(item)}
                >
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    backgroundColor: '#fff',
    marginBottom: 12,
    overflow: 'hidden', 
    justifyContent: 'center',
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#333',
  },
});