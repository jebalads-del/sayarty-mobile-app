import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';

export default function ProfileScreen({ navigation }: any) {
  // يمكنك تغيير قيمة isAdmin لاحقاً حسب بيانات المستخدم المسجل من Supabase
  const [isAdmin, setIsAdmin] = useState(true); // تجريبي: مفعل لرؤية لوحة الأدمن
  const [userInfo, setUserInfo] = useState({
    name: 'عبدالله الكويتي',
    phone: '+965 90000000',
    email: 'user@example.com'
  });

  const handleLogout = () => {
    Alert.alert('تسجيل الخروج', 'هل أنت تأكد من تسجيل الخروج؟', [
      { text: 'إلغاء', style: 'cancel' },
      { text: 'تأكيد', onPress: () => navigation.navigate('Auth') }
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{userInfo.name.charAt(0)}</Text>
        </View>
        <Text style={styles.userName}>{userInfo.name}</Text>
        <Text style={styles.userPhone}>{userInfo.phone}</Text>
      </View>

      {/* زر لوحة الأدمن - يظهر فقط للآدمن */}
      {isAdmin && (
        <TouchableOpacity style={styles.adminBtn} onPress={() => navigation.navigate('AdminDashboard')}>
          <Text style={styles.adminBtnText}>⚡ دخول لوحة تحكم الأدمن</Text>
        </TouchableOpacity>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>إدارة الحساب</Text>
        <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('تنبيه', 'قائمة إعلاناتي')}>
          <Text style={styles.menuText}>إعلاناتي المنشورة</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('تنبيه', 'تعديل البيانات')}>
          <Text style={styles.menuText}>تعديل البيانات الشخصية</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>تسجيل الخروج</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 16 },
  headerCard: { backgroundColor: '#0a192f', padding: 20, borderRadius: 16, alignItems: 'center', marginBottom: 16 },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#ffb703', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  avatarText: { fontSize: 24, fontWeight: 'bold', color: '#0a192f' },
  userName: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  userPhone: { color: '#cbd5e1', fontSize: 13, marginTop: 4 },
  adminBtn: { backgroundColor: '#ffb703', padding: 14, borderRadius: 12, alignItems: 'center', marginBottom: 16 },
  adminBtnText: { color: '#0a192f', fontWeight: 'bold', fontSize: 15 },
  section: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  sectionTitle: { fontSize: 14, color: '#64748b', fontWeight: 'bold', textAlign: 'right', marginBottom: 10 },
  menuItem: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  menuText: { fontSize: 15, color: '#1e293b', textAlign: 'right' },
  logoutBtn: { backgroundColor: '#ef4444', padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  logoutText: { color: '#fff', fontWeight: 'bold', fontSize: 15 }
});
