import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image,
  TouchableOpacity, ActivityIndicator, Modal, Clipboard, Alert
} from 'react-native';
import { supabase } from '../lib/supabase';

interface Car {
  id: string;
  brand: string;
  model: string;
  year?: number;
  price: number;
  kilometers?: number;
  color?: string;
  description?: string;
  currency?: string;
  status: string;
  created_at: string;
  images?: string | string[];
  user_id?: string;
  user_phone?: string;
}

interface User {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
}

export default function CarDetailsScreen({ route, navigation }: any) {
  const carId = route?.params?.id || '';

  const [car, setCar] = useState<Car | null>(null);
  const [seller, setSeller] = useState<User | null>(null);
  const [imagesList, setImagesList] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  useEffect(() => {
    if (carId) {
      fetchCarDetails();
    } else {
      setError('لم يتم العثور على معرف السيارة');
      setLoading(false);
    }
  }, [carId]);

  const fetchCarDetails = async () => {
    try {
      setLoading(true);
      const { data: carData, error: carError } = await supabase
        .from('cars')
        .select('*')
        .eq('id', carId)
        .single();

      if (carError || !carData) {
        setError('الإعلان غير موجود أو تم حذفه');
        setLoading(false);
        return;
      }

      setCar(carData);

      // معالجة مرنة للصور
      let parsedImages: string[] = [];
      if (carData.images) {
        if (Array.isArray(carData.images)) {
          parsedImages = carData.images;
        } else if (typeof carData.images === 'string') {
          const cleanStr = carData.images.trim();
          if (cleanStr.startsWith('[') && cleanStr.endsWith(']')) {
            try {
              parsedImages = JSON.parse(cleanStr);
            } catch {
              parsedImages = [];
            }
          } else if (cleanStr.startsWith('http')) {
            parsedImages = [cleanStr];
          } else {
            parsedImages = cleanStr.split(',').map((u: string) => u.trim()).filter(Boolean);
          }
        }
      }
      setImagesList(parsedImages);

      // جلب بيانات المعلن
      if (carData.user_id) {
        const { data: userData } = await supabase
          .from('users')
          .select('id, name, email, phone')
          .eq('id', carData.user_id)
          .single();
        if (userData) setSeller(userData);
      }
    } catch (err) {
      console.error(err);
      setError('حدث خطأ أثناء تحميل بيانات الإعلان');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    Clipboard.setString(text);
    Alert.alert('تم النسخ', 'تم نسخ رقم الهاتف للحافظة بنجاح');
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>⏳ جاري تحميل التفاصيل...</Text>
      </View>
    );
  }

  if (error || !car) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>❌ {error}</Text>
        <TouchableOpacity style={styles.backBtnAction} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnActionText}>🏠 العودة للرئيسية</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const sellerName = seller?.name || 'المعلن';
  const finalPhone = car.user_phone || seller?.phone || 'غير متوفر';

  const publishDate = car.created_at
    ? new Date(car.created_at).toLocaleDateString('ar-KW', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'غير معروف';

  return (
    <View style={styles.mainWrapper}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* الهيدر العلوي */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backBtnText}>🔙 العودة</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>تفاصيل المركبة</Text>
          <View style={{ width: 60 }} />
        </View>

        {/* قسم معرض الصور */}
        <View style={styles.imageSection}>
          {imagesList.length > 0 ? (
            <View style={styles.imageCard}>
              <View style={styles.mainImageWrapper}>
                <Image
                  source={{ uri: imagesList[currentImageIndex] }}
                  style={styles.mainImage}
                  resizeMode="cover"
                />

                {imagesList.length > 1 && (
                  <>
                    <TouchableOpacity
                      style={[styles.navBtn, { left: 10 }]}
                      onPress={() => setCurrentImageIndex(prev => (prev > 0 ? prev - 1 : imagesList.length - 1))}
                    >
                      <Text style={styles.navBtnText}>‹</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.navBtn, { right: 10 }]}
                      onPress={() => setCurrentImageIndex(prev => (prev < imagesList.length - 1 ? prev + 1 : 0))}
                    >
                      <Text style={styles.navBtnText}>›</Text>
                    </TouchableOpacity>
                  </>
                )}

                <View style={styles.counterBadge}>
                  <Text style={styles.counterText}>{currentImageIndex + 1} / {imagesList.length}</Text>
                </View>
              </View>

              {/* الصور المصغرة */}
              {imagesList.length > 1 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbScroll}>
                  {imagesList.map((img, idx) => (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => setCurrentImageIndex(idx)}
                      style={[
                        styles.thumbWrapper,
                        idx === currentImageIndex && styles.thumbActive
                      ]}
                    >
                      <Image source={{ uri: img }} style={styles.thumbImage} />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
          ) : (
            <View style={styles.noImgBox}>
              <Text style={styles.noImgText}>🚗 لا توجد صور لهذه السيارة</Text>
            </View>
          )}
        </View>

        {/* معلومات السعر والاسم */}
        <View style={styles.infoCard}>
          <View style={styles.titlePriceRow}>
            <Text style={styles.carTitle}>{car.brand} {car.model}</Text>
            <View style={styles.priceTag}>
              <Text style={styles.priceText}>
                {car.price ? car.price.toLocaleString() : '0'} {car.currency || 'د.ك'}
              </Text>
            </View>
          </View>

          {/* شبكة المواصفات */}
          <View style={styles.detailsGrid}>
            {car.year ? (
              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>📅 سنة الصنع</Text>
                <Text style={styles.gridValue}>{car.year}</Text>
              </View>
            ) : null}

            {car.kilometers ? (
              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>📊 عداد الممشى</Text>
                <Text style={styles.gridValue}>{car.kilometers.toLocaleString()} كم</Text>
              </View>
            ) : null}

            {car.color ? (
              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>🎨 اللون</Text>
                <Text style={styles.gridValue}>{car.color}</Text>
              </View>
            ) : null}

            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>📌 الحالة</Text>
              <Text style={[styles.gridValue, { color: car.status === 'approved' ? '#16a34a' : '#ef4444' }]}>
                {car.status === 'approved' ? '✅ متاح' : '💰 تم البيع'}
              </Text>
            </View>

            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>🕒 تاريخ النشر</Text>
              <Text style={styles.gridValue}>{publishDate}</Text>
            </View>
          </View>

          {/* تفاصيل الوصف */}
          {car.description ? (
            <View style={styles.sectionBox}>
              <Text style={styles.sectionTitle}>📝 التفاصيل</Text>
              <Text style={styles.descriptionText}>{car.description}</Text>
            </View>
          ) : null}

          {/* كارت المعلن */}
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>👤 المعلن</Text>
            <Text style={styles.sellerName}>{sellerName}</Text>
          </View>

          {/* تنبيه الأمان والسلامة */}
          <View style={styles.warningBox}>
            <Text style={styles.warningTitle}>⚠️ تنبيه هام</Text>
            <Text style={styles.warningText}>
              منصة سيارتي لا تتحمل أي مسؤولية قانونية عن محتوى الإعلانات، وليست طرفاً في عملية البيع. يرجى معاينة السيارة بنفسك وفحصها كاملاً.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* الشريط السفلي المباشر للتواصل داخل التطبيق */}
      <View style={styles.stickyBar}>
        <TouchableOpacity
          style={styles.chatBtn}
          onPress={() => Alert.alert('المحادثة', 'جاري فتح المحادثة المباشرة في التطبيق...')}
        >
          <Text style={styles.chatBtnText}>💬 محادثة فورية</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.phoneBtn}
          onPress={() => setShowPhoneModal(true)}
        >
          <Text style={styles.phoneBtnText}>📞 إظهار الرقم</Text>
        </TouchableOpacity>
      </View>

      {/* نافذة إظهار الرقم المنبثقة داخل التطبيق */}
      <Modal visible={showPhoneModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>📱 رقم التواصل مع المعلن</Text>
            <Text style={styles.modalPhone}>{finalPhone}</Text>

            <TouchableOpacity style={styles.copyBtn} onPress={() => copyToClipboard(finalPhone)}>
              <Text style={styles.copyBtnText}>📋 نسخ الرقم</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeModalBtn} onPress={() => setShowPhoneModal(false)}>
              <Text style={styles.closeModalBtnText}>إغلاق</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: { flex: 1, backgroundColor: '#f8fafc' },
  container: { paddingBottom: 100 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  loadingText: { marginTop: 12, color: '#64748b', fontSize: 14, fontWeight: 'bold' },
  errorTitle: { fontSize: 16, color: '#dc2626', fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  backBtnAction: { backgroundColor: '#2563eb', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  backBtnActionText: { color: '#fff', fontWeight: 'bold' },

  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backBtn: { backgroundColor: '#f1f5f9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  backBtnText: { fontSize: 13, color: '#334155', fontWeight: 'bold' },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },

  imageSection: { padding: 12 },
  imageCard: { backgroundColor: '#fff', borderRadius: 16, padding: 8, borderWidth: 1, borderColor: '#e2e8f0' },
  mainImageWrapper: { position: 'relative', width: '100%', height: 250, borderRadius: 12, overflow: 'hidden', backgroundColor: '#f1f5f9' },
  mainImage: { width: '100%', height: '100%' },
  navBtn: {
    position: 'absolute',
    top: '42%',
    backgroundColor: 'rgba(255,255,255,0.9)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justify: 'center',
    alignItems: 'center',
  },
  navBtnText: { fontSize: 22, fontWeight: 'bold', color: '#1e293b', marginTop: -2 },
  counterBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(15,23,42,0.75)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  counterText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  thumbScroll: { marginTop: 10, flexDirection: 'row-reverse' },
  thumbWrapper: { width: 60, height: 45, borderRadius: 6, overflow: 'hidden', marginLeft: 8, borderWidth: 2, borderColor: 'transparent' },
  thumbActive: { borderColor: '#2563eb' },
  thumbImage: { width: '100%', height: '100%' },
  noImgBox: { height: 180, backgroundColor: '#fff', borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  noImgText: { color: '#64748b', fontWeight: 'bold' },

  infoCard: { paddingHorizontal: 12, gap: 12 },
  titlePriceRow: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  carTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  priceTag: { backgroundColor: '#f0fdf4', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  priceText: { fontSize: 16, fontWeight: 'bold', color: '#16a34a' },

  detailsGrid: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 8,
  },
  gridItem: { width: '48%', backgroundColor: '#f8fafc', padding: 10, borderRadius: 10 },
  gridLabel: { fontSize: 11, color: '#64748b', fontWeight: 'bold', textAlign: 'right' },
  gridValue: { fontSize: 13, color: '#1e293b', fontWeight: 'bold', textAlign: 'right', marginTop: 2 },

  sectionBox: { backgroundColor: '#fff', padding: 14, borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#475569', textAlign: 'right', marginBottom: 8, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', paddingBottom: 4 },
  descriptionText: { fontSize: 13, color: '#334155', textAlign: 'right', lineHeight: 20 },
  sellerName: { fontSize: 14, color: '#1e293b', fontWeight: 'bold', textAlign: 'right' },

  warningBox: { backgroundColor: '#fef2f2', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#fecaca' },
  warningTitle: { color: '#dc2626', fontWeight: 'bold', fontSize: 13, textAlign: 'right', marginBottom: 4 },
  warningText: { color: '#7f1d1d', fontSize: 11, textAlign: 'right', lineHeight: 18 },

  stickyBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    flexDirection: 'row-reverse',
    gap: 10,
  },
  chatBtn: { flex: 2, backgroundColor: '#2563eb', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  chatBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  phoneBtn: { flex: 1, backgroundColor: '#1e293b', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  phoneBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', width: '100%', borderRadius: 16, padding: 20, alignItems: 'center' },
  modalTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e293b', marginBottom: 12 },
  modalPhone: { fontSize: 20, fontWeight: 'bold', color: '#2563eb', marginBottom: 16, letterSpacing: 1 },
  copyBtn: { backgroundColor: '#f1f5f9', width: '100%', padding: 12, borderRadius: 10, alignItems: 'center', marginBottom: 8 },
  copyBtnText: { color: '#334155', fontWeight: 'bold', fontSize: 14 },
  closeModalBtn: { padding: 8 },
  closeModalBtnText: { color: '#ef4444', fontWeight: 'bold', fontSize: 13 },
});
