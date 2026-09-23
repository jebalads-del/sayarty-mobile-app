import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native';

export default function AdDetailsScreen({ route }: any) {
  const { ad } = route.params || {};

  const handleCall = () => {
    if (ad?.phone) Linking.openURL(`tel:${ad.phone}`);
  };

  const handleWhatsApp = () => {
    if (ad?.phone) Linking.openURL(`https://wa.me/${ad.phone}`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 90 }}>
        {ad?.images && ad.images.length > 0 ? (
          <Image source={{ uri: ad.images[0] }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.noImage]}><Text style={{ color: '#888' }}>لا توجد صورة</Text></View>
        )}

        <View style={styles.content}>
          <Text style={styles.brandSubtitle}>{ad?.make || 'سيارة'}</Text>
          <Text style={styles.title}>{ad?.title || `${ad?.make || ''} ${ad?.model || ''}`}</Text>
          <Text style={styles.price}>{ad?.price ? `${ad.price} د.ك` : 'غير محدد'}</Text>

          {/* كروت المواصفات الشبكية */}
          <Text style={styles.sectionHeader}>المواصفات الأساسية</Text>
          <View style={styles.gridContainer}>
            <View style={styles.gridCard}>
              <Text style={styles.gridLabel}>السنة</Text>
              <Text style={styles.gridValue}>{ad?.year || '-'}</Text>
            </View>
            <View style={styles.gridCard}>
              <Text style={styles.gridLabel}>الكيلومترات</Text>
              <Text style={styles.gridValue}>{ad?.mileage ? `${ad.mileage} كم` : '-'}</Text>
            </View>
            <View style={styles.gridCard}>
              <Text style={styles.gridLabel}>اللون</Text>
              <Text style={styles.gridValue}>{ad?.color || 'أبيض'}</Text>
            </View>
            <View style={styles.gridCard}>
              <Text style={styles.gridLabel}>نوع الهيكل</Text>
              <Text style={styles.gridValue}>{ad?.body_type || 'سيدان'}</Text>
            </View>
          </View>

          {/* الوصف */}
          <Text style={styles.sectionHeader}>الوصف التفصيلي</Text>
          <View style={styles.descCard}>
            <Text style={styles.description}>{ad?.description || 'لا يوجد وصف إضافي مرفق لهذه السيارة.'}</Text>
          </View>

          {/* معلومات البائع */}
          <Text style={styles.sectionHeader}>البائع</Text>
          <View style={styles.sellerCard}>
            <Text style={styles.sellerName}>{ad?.seller_name || 'بائع خاص'}</Text>
            <Text style={styles.sellerTag}>حساب موثق</Text>
          </View>
        </View>
      </ScrollView>

      {/* أزرار الاتصال المثبتة في الأسفل */}
      <View style={styles.fixedBottomBar}>
        <TouchableOpacity style={[styles.btn, { backgroundColor: '#25D366' }]} onPress={handleWhatsApp}>
          <Text style={styles.btnText}>واتساب</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, { backgroundColor: '#1d4ed8' }]} onPress={handleCall}>
          <Text style={styles.btnText}>اتصل بالبائع</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: { width: '100%', height: 270, resizeMode: 'cover' },
  noImage: { backgroundColor: '#cbd5e1', justifyContent: 'center', alignItems: 'center' },
  content: { padding: 16 },
  brandSubtitle: { color: '#64748b', fontSize: 13, textAlign: 'right' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#0f172a', textAlign: 'right', marginVertical: 4 },
  price: { fontSize: 22, color: '#1d4ed8', fontWeight: 'bold', textAlign: 'right', marginBottom: 16 },
  sectionHeader: { fontSize: 16, fontWeight: 'bold', color: '#0f172a', textAlign: 'right', marginTop: 12, marginBottom: 8 },
  gridContainer: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 10 },
  gridCard: { width: '48%', backgroundColor: '#fff', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0', alignItems: 'flex-end' },
  gridLabel: { color: '#64748b', fontSize: 12 },
  gridValue: { color: '#0f172a', fontWeight: 'bold', fontSize: 14, marginTop: 4 },
  descCard: { backgroundColor: '#fff', padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0' },
  description: { fontSize: 14, color: '#334155', textAlign: 'right', lineHeight: 22 },
  sellerCard: { backgroundColor: '#fff', padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0', flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
  sellerName: { fontWeight: 'bold', fontSize: 15, color: '#0f172a' },
  sellerTag: { color: '#16a34a', backgroundColor: '#dcfce7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, fontSize: 11 },
  fixedBottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', padding: 12, flexDirection: 'row', gap: 10, borderTopWidth: 1, borderTopColor: '#e2e8f0' },
  btn: { flex: 1, padding: 14, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 }
});
