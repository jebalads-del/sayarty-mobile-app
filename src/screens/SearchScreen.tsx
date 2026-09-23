import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native';
import { supabase } from '../lib/supabase';

export default function SearchScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMake, setSelectedMake] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [ads, setAds] = useState<any[]>([]);
  const [filteredAds, setFilteredAds] = useState<any[]>([]);

  const brands = ['الكل', 'مرسيدس', 'بي إم دبليو', 'لكزس', 'أودي', 'جينيسيس', 'تويوتا', 'هوندا'];

  useEffect(() => {
    fetchAds();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedMake, maxPrice, selectedYear, ads]);

  const fetchAds = async () => {
    const { data } = await supabase.from('ads').select('*').order('created_at', { ascending: false });
    if (data) {
      setAds(data);
      setFilteredAds(data);
    }
  };

  const applyFilters = () => {
    let result = [...ads];

    if (searchQuery) {
      result = result.filter(item => 
        (item.title && item.title.includes(searchQuery)) ||
        (item.make && item.make.includes(searchQuery)) ||
        (item.model && item.model.includes(searchQuery)) ||
        (item.description && item.description.includes(searchQuery))
      );
    }

    if (selectedMake && selectedMake !== 'الكل') {
      result = result.filter(item => item.make === selectedMake);
    }

    if (maxPrice) {
      result = result.filter(item => Number(item.price) <= Number(maxPrice));
    }

    if (selectedYear) {
      result = result.filter(item => String(item.year) === selectedYear);
    }

    setFilteredAds(result);
  };

  return (
    <View style={styles.container}>
      {/* شريط البحث العلوي */}
      <View style={styles.searchHeader}>
        <TextInput
          style={styles.searchInput}
          placeholder="ابحث عن سيارة، موديل، أو مواصفة..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* الفلاتر السريعة */}
      <View style={styles.filterSection}>
        <Text style={styles.filterTitle}>تصفح حسب الماركة:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.brandsList}>
          {brands.map((b, index) => (
            <TouchableOpacity 
              key={index} 
              style={[styles.brandChip, (selectedMake === b || (b === 'الكل' && !selectedMake)) && styles.activeBrandChip]}
              onPress={() => setSelectedMake(b === 'الكل' ? '' : b)}
            >
              <Text style={[(selectedMake === b || (b === 'الكل' && !selectedMake)) ? styles.activeBrandText : styles.brandText]}>{b}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.inputsRow}>
          <TextInput
            style={styles.smallInput}
            placeholder="الحد الأقصى للسعر (د.ك)"
            keyboardType="numeric"
            value={maxPrice}
            onChangeText={setMaxPrice}
          />
          <TextInput
            style={styles.smallInput}
            placeholder="سنة الصنع (مثال: 2023)"
            keyboardType="numeric"
            value={selectedYear}
            onChangeText={setSelectedYear}
          />
        </View>
      </View>

      {/* نتائج البحث */}
      <Text style={styles.resultsCount}>عدد النتائج: {filteredAds.length}</Text>

      <FlatList
        data={filteredAds}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('AdDetails', { ad: item })}>
            <Image source={{ uri: item.images && item.images[0] ? item.images[0] : 'https://via.placeholder.com/150' }} style={styles.cardImg} />
            <View style={styles.cardDetails}>
              <Text style={styles.cardTitle}>{item.title || `${item.make} ${item.model}`}</Text>
              <Text style={styles.cardPrice}>{item.price} د.ك</Text>
              <Text style={styles.cardSub}>{item.year} • {item.mileage ? `${item.mileage} كم` : ''}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 12 },
  searchHeader: { marginBottom: 12 },
  searchInput: { backgroundColor: '#fff', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#e0e0e0', textAlign: 'right' },
  filterSection: { backgroundColor: '#fff', padding: 12, borderRadius: 12, marginBottom: 12 },
  filterTitle: { textAlign: 'right', fontWeight: 'bold', marginBottom: 8, color: '#0a192f' },
  brandsList: { flexDirection: 'row-reverse', gap: 8, paddingBottom: 8 },
  brandChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f0f4f8' },
  activeBrandChip: { backgroundColor: '#0a192f' },
  brandText: { color: '#333' },
  activeBrandText: { color: '#fff', fontWeight: 'bold' },
  inputsRow: { flexDirection: 'row-reverse', gap: 10, marginTop: 8 },
  smallInput: { flex: 1, backgroundColor: '#f8f9fa', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#eee', textAlign: 'right', fontSize: 12 },
  resultsCount: { textAlign: 'right', color: '#666', marginBottom: 8, fontSize: 12 },
  card: { flexDirection: 'row-reverse', backgroundColor: '#fff', borderRadius: 12, padding: 10, marginBottom: 10, elevation: 1 },
  cardImg: { width: 100, height: 80, borderRadius: 8 },
  cardDetails: { flex: 1, marginRight: 12, justifyContent: 'center', alignItems: 'flex-end' },
  cardTitle: { fontWeight: 'bold', fontSize: 15, color: '#0a192f' },
  cardPrice: { color: '#10b981', fontWeight: 'bold', fontSize: 14, marginVertical: 4 },
  cardSub: { color: '#888', fontSize: 12 }
});
