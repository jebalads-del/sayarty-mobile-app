import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 36) / 2;

export default function HomeScreen({ navigation }: any) {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const { data, error } = await supabase.from('cars').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setAds(data || []);
    } catch (err) {
      console.error('Error fetching cars:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.authBtn} onPress={() => navigation.navigate('Auth')}>
          <Text style={styles.authBtnText}>دخول / حساب جديد</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.postBtn} onPress={() => navigation.navigate('AddAd')}>
          <Text style={styles.postBtnText}>+ نشر إعلان مجاناً</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0066cc" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={ads}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('AdDetails', { ad: item })}>
              <Image source={{ uri: item.images?.[0] || 'https://via.placeholder.com/150' }} style={styles.image} />
              <View style={styles.cardInfo}>
                <Text style={styles.price}>{item.price} د.ك</Text>
                <Text style={styles.title} numberOfLines={1}>{item.make} {item.model} {item.year}</Text>
                <Text style={styles.subText}>{item.mileage} كم • {item.color}</Text>
                <Text style={styles.dateText}>{new Date(item.created_at).toLocaleDateString('ar-KW')}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f8', padding: 10 },
  header: { flexDirection: 'row-reverse', justifyContent: 'space-between', marginBottom: 12, marginTop: 10 },
  postBtn: { backgroundColor: '#ff9800', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8 },
  postBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  authBtn: { backgroundColor: '#0066cc', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8 },
  authBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  row: { justifyContent: 'space-between' },
  card: { width: COLUMN_WIDTH, backgroundColor: '#fff', borderRadius: 10, marginBottom: 12, overflow: 'hidden', elevation: 2 },
  image: { width: '100%', height: 120 },
  cardInfo: { padding: 8, alignItems: 'flex-end' },
  price: { color: '#2e7d32', fontWeight: 'bold', fontSize: 15 },
  title: { fontWeight: '600', fontSize: 13, marginTop: 2 },
  subText: { color: '#666', fontSize: 11, marginTop: 2 },
  dateText: { color: '#999', fontSize: 10, marginTop: 4 }
});
