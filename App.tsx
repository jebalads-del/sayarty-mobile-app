import 'react-native-url-polyfill/auto';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// إعداد كائن Supabase للتطبيق
const SUPABASE_URL = 'https://your-supabase-url.supabase.co'; // ضع رابط Supabase الخاص بك هنا
const SUPABASE_ANON_KEY = 'your-anon-key';                   // ضع المفتاح الخاص بك هنا

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

interface Car {
  id: string;
  brand: string;
  model: string;
  price: number;
  year?: number;
  kilometers?: number;
  color?: string;
  description?: string;
  currency?: string;
  status: string;
  created_at: string;
  images?: any;
  is_featured?: boolean;
}

export default function App() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const getFirstImage = (images: any): string | null => {
    if (!images) return null;
    if (Array.isArray(images) && images.length > 0) return images[0];
    if (typeof images === 'string') {
      try {
        const parsed = JSON.parse(images);
        return parsed.length > 0 ? parsed[0] : null;
      } catch {
        if (images.startsWith('http')) return images;
      }
    }
    return null;
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .in('status', ['approved', 'sold'])
        .order('created_at', { ascending: false });

      if (!error && data) {
        setCars(data);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaProvider>
      <View style={styles.mainContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
        
        {/* Safe Top Header */}
        <SafeAreaView style={styles.headerSafeArea}>
          <View style={styles.headerContent}>
            <View style={styles.brandContainer}>
              <View style={styles.logoBadge}>
                <Text style={styles.logoBadgeText}>🚗</Text>
              </View>
              <View>
                <Text style={styles.appName}>سيارتي ستور</Text>
                <Text style={styles.appTagline}>تطبيق السيارات الأول</Text>
              </View>
            </View>

            <View style={styles.headerButtons}>
              <TouchableOpacity style={styles.addBtn}>
                <Text style={styles.addBtnText}>➕ أعلن</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.loginBtn}>
                <Text style={styles.loginBtnText}>🔑 دخول</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>

        {/* Content Body */}
        <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
          {/* Search Bar */}
          <View style={styles.searchSection}>
            <TextInput
              style={styles.searchInput}
              placeholder="ابحث عن ماركة، موديل، أو نوع السيارة..."
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Featured Horizontal List */}
          {cars.filter((c) => c.is_featured).length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>⭐ سيارات مميزة</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row-reverse' }}>
                {cars.filter((c) => c.is_featured).map((car) => {
                  const img = getFirstImage(car.images);
                  return (
                    <TouchableOpacity key={car.id} style={styles.featuredCard}>
                      <View style={styles.featuredImgContainer}>
                        {img ? (
                          <Image source={{ uri: img }} style={styles.cardImg} />
                        ) : (
                          <View style={styles.noImg}><Text style={{ color: '#94a3b8' }}>🚗</Text></View>
                        )}
                        <View style={styles.featuredBadge}><Text style={styles.featuredBadgeText}>مميز</Text></View>
                      </View>
                      <Text style={styles.cardTitle}>{car.brand} {car.model}</Text>
                      <Text style={styles.cardPrice}>{car.price} {car.currency || 'د.ك'}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {/* Main Feed */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🚙 أحدث العروض</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 20 }} />
            ) : (
              cars
                .filter((c) => !searchQuery || c.brand.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((car) => {
                  const img = getFirstImage(car.images);
                  return (
                    <TouchableOpacity key={car.id} style={styles.mainCard}>
                      <View style={styles.mainImgContainer}>
                        {img ? (
                          <Image source={{ uri: img }} style={styles.cardImg} />
                        ) : (
                          <View style={styles.noImg}><Text style={{ color: '#94a3b8' }}>🚗 لا توجد صورة</Text></View>
                        )}
                        {car.status === 'sold' && (
                          <View style={styles.soldBadge}><Text style={styles.soldBadgeText}>تم البيع</Text></View>
                        )}
                      </View>

                      <View style={styles.cardDetails}>
                        <Text style={styles.mainCardTitle}>{car.brand} {car.model}</Text>
                        <View style={styles.specsRow}>
                          {car.year && <Text style={styles.specTag}>📅 {car.year}</Text>}
                          {car.kilometers && <Text style={styles.specTag}>📊 {car.kilometers} كم</Text>}
                          {car.color && <Text style={styles.specTag}>🎨 {car.color}</Text>}
                        </View>

                        <View style={styles.cardFooter}>
                          <Text style={styles.mainCardPrice}>{car.price} <Text style={{ fontSize: 12 }}>{car.currency || 'د.ك'}</Text></Text>
                          <Text style={styles.detailsBtnText}>التفاصيل ←</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })
            )}
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navIcon}>🏠</Text>
            <Text style={[styles.navLabel, { color: '#2563eb' }]}>الرئيسية</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navIcon}>➕</Text>
            <Text style={styles.navLabel}>أضف إعلان</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navIcon}>📧</Text>
            <Text style={styles.navLabel}>اتصل بنا</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navIcon}>👤</Text>
            <Text style={styles.navLabel}>حسابي</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#f8fafc' },
  headerSafeArea: { backgroundColor: '#0f172a' },
  headerContent: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  brandContainer: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10 },
  logoBadge: { width: 38, height: 38, backgroundColor: '#2563eb', borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  logoBadgeText: { fontSize: 20 },
  appName: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  appTagline: { color: '#fbbf24', fontSize: 10 },
  headerButtons: { flexDirection: 'row-reverse', gap: 6 },
  addBtn: { backgroundColor: '#10b981', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  addBtnText: { color: 'white', fontSize: 11, fontWeight: 'bold' },
  loginBtn: { backgroundColor: '#fbbf24', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  loginBtnText: { color: '#0f172a', fontSize: 11, fontWeight: 'bold' },

  scrollBody: { flex: 1, paddingHorizontal: 14, paddingBottom: 80 },
  searchSection: { marginTop: 12, marginBottom: 14 },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    textAlign: 'right',
    fontSize: 13,
  },

  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#0f172a', marginBottom: 10, textAlign: 'right' },
  featuredCard: { width: 140, backgroundColor: 'white', borderRadius: 12, padding: 8, marginLeft: 10, borderWidth: 1, borderColor: '#fde68a' },
  featuredImgContainer: { height: 90, borderRadius: 8, overflow: 'hidden', backgroundColor: '#f1f5f9', position: 'relative' },
  featuredBadge: { position: 'absolute', top: 4, right: 4, backgroundColor: '#f59e0b', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  featuredBadgeText: { color: 'white', fontSize: 9, fontWeight: 'bold' },
  cardTitle: { fontSize: 12, fontWeight: 'bold', marginVertical: 4, textAlign: 'right' },
  cardPrice: { fontSize: 13, fontWeight: 'bold', color: '#059669', textAlign: 'right' },

  mainCard: { backgroundColor: 'white', borderRadius: 14, overflow: 'hidden', marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  mainImgContainer: { height: 180, width: '100%', backgroundColor: '#f1f5f9', position: 'relative' },
  cardImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  noImg: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  soldBadge: { position: 'absolute', top: 10, right: 10, backgroundColor: '#e11d48', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  soldBadgeText: { color: 'white', fontSize: 11, fontWeight: 'bold' },
  cardDetails: { padding: 12 },
  mainCardTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a', textAlign: 'right' },
  specsRow: { flexDirection: 'row-reverse', gap: 10, marginVertical: 8 },
  specTag: { fontSize: 11, color: '#64748b', backgroundColor: '#f1f5f9', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  cardFooter: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginTop: 6, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  mainCardPrice: { fontSize: 18, fontWeight: 'bold', color: '#059669' },
  detailsBtnText: { color: '#2563eb', fontWeight: 'bold', fontSize: 12 },

  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 65,
    backgroundColor: 'white',
    flexDirection: 'row-reverse',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  navItem: { alignItems: 'center' },
  navIcon: { fontSize: 18 },
  navLabel: { fontSize: 10, color: '#64748b', marginTop: 2, fontWeight: 'bold' },
});
