import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput, ScrollView } from 'react-native';
import { supabase } from '../lib/supabase';

const BRANDS = ['الكل', 'مرسيدس', 'بي إم دبليو', 'لكزس', 'أودي', 'جينيسيس', 'تويوتا', 'بورش'];

export default function HomeScreen({ navigation }: any) {
  const [ads, setAds] = useState<any[]>([]);
  const [filteredAds, setFilteredAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('الكل');

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('ads').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setAds(data);
      setFilteredAds(data);
    }
    setLoading(false);
  };

  const handleSearch = (text: string, brand = selectedBrand) => {
    setSearchQuery(text);
    let result = ads;

    if (brand !== 'الكل') {
      result = result.filter(item => 
        (item.make && item.make.includes(brand)) || (item.title && item.title.includes(brand))
      );
    }

    if (text.trim() !== '') {
      result = result.filter(item => 
        (item.title && item.title.toLowerCase().includes(text.toLowerCase())) ||
        (item.make && item.make.toLowerCase().includes(text.toLowerCase())) ||
        (item.model && item.model.toLowerCase().includes(text.toLowerCase()))
      );
    }

    setFilteredAds(result);
  };

  const selectBrand = (brand: string) => {
    setSelectedBrand(brand);
    handleSearch(searchQuery, brand);
  };

  return (
    <View style={styles.container}>
      {/* Header الداكن العريض مع الإحصائيات */}
      <View style={styles.headerCard}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{ads.length}</Text>
          <Text style={styles.statLabel}>إعلان نشط</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>الكويت</Text>
          <Text style={styles.statLabel}>المدينة</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>سيارتي</Text>
          <Text style={styles.statLabel}>ستور</Text>
        </View>
      </View>

      {/* محرك البحث الإشعاعي الذكي */}
      <View style={styles.searchSection}>
        <TextInput
          style={styles.searchInput}
          placeholder="ابحث عن سيارة، ماركة، أو موديل..."
          value={searchQuery}
          onChangeText={(text) => handleSearch(text)}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        {/* أزرار العمليات السريعة */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('AddAd')}>
            <Text style={styles.actionTitle}>أرسل إعلانك</Text>
            <Text style={styles.actionSub}>مجاناً وبثوانٍ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCardAlt} onPress={() => navigation.navigate('Profile')}>
            <Text style={styles.actionTitleAlt}>حسابي</Text>
            <Text style={styles.actionSubAlt}>الملف الشخصي</Text>
          </TouchableOpacity>
        </View>

        {/* شريط تصفح الماركات الأفقية */}
        <Text style={styles.sectionTitle}>تصفح حسب الماركة</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.brandBar}>
          {BRANDS.map((brand, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.brandChip, selectedBrand === brand && styles.activeBrandChip]}
              onPress={() => selectBrand(brand)}
            >
              <Text style={[styles.brandChipText, selectedBrand === brand && styles.activeBrandText]}>
                {brand}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* قسم أحدث الإعلانات */}
        <Text style={styles.sectionTitle}>أحدث الإعلانات المتاحة</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#0a192f" style={{ marginVertical: 30 }} />
        ) : (
          <FlatList
            data={filteredAds}
            scrollEnabled={false}
            numColumns={2}
            keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('AdDetails', { ad: item })}
              >
                {item.status === 'sold' && (
                  <View style={styles.soldBadge}><Text style={styles.soldText}>مباعة</Text></View>
                )}
                <Image
                  source={{ uri: item.images && item.images[0] ? item.images[0] : 'https://via.placeholder.com/200' }}
                  style={styles.cardImage}
                />
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{item.title || `${item.make || ''} ${item.model || ''}`}</Text>
                  <Text style={styles.cardPrice}>{item.price ? `${item.price} د.ك` : 'على السوم'}</Text>
                  <Text style={styles.cardSubText}>
                    {item.year ? `${item.year}` : ''} {item.mileage ? `• ${item.mileage} كم` : ''}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </ScrollView>

      {/* Bottom Bar التصفح السفلي المثبت */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Text style={[styles.navText, { color: '#0066cc', fontWeight: 'bold' }]}>الرئيسية</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('AddAd')}>
          <Text style={styles.navText}>+ إعلانك</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.navText}>حسابي</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f8', paddingHorizontal: 12, paddingTop: 10 },
  headerCard: { backgroundColor: '#0a192f', borderRadius: 16, padding: 18, flexDirection: 'row-reverse', justifyContent: 'space-around', alignItems: 'center', marginBottom: 14 },
  statBox: { alignItems: 'center' },
  statNumber: { color: '#ffb703', fontSize: 20, fontWeight: 'bold' },
  statLabel: { color: '#fff', fontSize: 12, marginTop: 4 },
  statDivider: { width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.2)' },
  searchSection: { marginBottom: 14 },
  searchInput: { backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, textAlign: 'right', fontSize: 14, borderWidth: 1, borderColor: '#e2e8f0', elevation: 2 },
  actionRow: { flexDirection: 'row-reverse', gap: 10, marginBottom: 16 },
  actionCard: { flex: 1, backgroundColor: '#fff', padding: 14, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#ffb703' },
  actionTitle: { fontWeight: 'bold', fontSize: 15, color: '#0a192f' },
  actionSub: { color: '#ff9800', fontSize: 12, marginTop: 2 },
  actionCardAlt: { flex: 1, backgroundColor: '#fff', padding: 14, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#0066cc' },
  actionTitleAlt: { fontWeight: 'bold', fontSize: 15, color: '#0a192f' },
  actionSubAlt: { color: '#0066cc', fontSize: 12, marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#0a192f', textAlign: 'right', marginBottom: 10 },
  brandBar: { flexDirection: 'row-reverse', marginBottom: 16 },
  brandChip: { backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginLeft: 8, borderWidth: 1, borderColor: '#cbd5e1' },
  activeBrandChip: { backgroundColor: '#0a192f', borderColor: '#0a192f' },
  brandChipText: { color: '#334155', fontWeight: 'bold', fontSize: 13 },
  activeBrandText: { color: '#fff' },
  card: { flex: 0.5, backgroundColor: '#fff', margin: 5, borderRadius: 12, overflow: 'hidden', elevation: 3 },
  cardImage: { width: '100%', height: 120 },
  cardContent: { padding: 10, alignItems: 'flex-end' },
  cardTitle: { fontWeight: 'bold', fontSize: 14, color: '#1e293b', textAlign: 'right' },
  cardPrice: { color: '#0284c7', fontWeight: 'bold', fontSize: 15, marginVertical: 4 },
  cardSubText: { color: '#64748b', fontSize: 11 },
  soldBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: '#22c55e', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, zIndex: 10 },
  soldText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  bottomNav: { flexDirection: 'row-reverse', justifyContent: 'space-around', backgroundColor: '#fff', paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#e2e8f0', position: 'absolute', bottom: 0, left: 0, right: 0 },
  navItem: { alignItems: 'center' },
  navText: { fontSize: 13, color: '#64748b' }
});
