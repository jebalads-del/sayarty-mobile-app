import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';

export default function AdminScreen() {
  const [activeTab, setActiveTab] = useState<'ADS' | 'USERS' | 'FEATURED' | 'PAYMENTS'>('ADS');

  const handleDeleteUser = (user: any) => {
    if (user.role === 'admin' || user.email === 'admin@sayarty.store') {
      Alert.alert('محظور', 'حساب الأدمن الرئيسي محمي ولا يمكن حذفه نهائياً!');
      return;
    }
    Alert.alert('تأكيد', `هل أنت متأكد من حظر/حذف المستخدم ${user.name}؟`);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>لوحة إدارة sayarty.store</Text>
      
      <View style={styles.tabBar}>
        <TouchableOpacity style={[styles.tab, activeTab === 'ADS' && styles.activeTab]} onPress={() => setActiveTab('ADS')}>
          <Text style={[styles.tabText, activeTab === 'ADS' && styles.activeTabText]}>الإعلانات</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'USERS' && styles.activeTab]} onPress={() => setActiveTab('USERS')}>
          <Text style={[styles.tabText, activeTab === 'USERS' && styles.activeTabText]}>المستخدمين</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'PAYMENTS' && styles.activeTab]} onPress={() => setActiveTab('PAYMENTS')}>
          <Text style={[styles.tabText, activeTab === 'PAYMENTS' && styles.activeTabText]}>الدفع</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'PAYMENTS' && (
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>إعدادات طرق الدفع المتاحة</Text>
          <TouchableOpacity style={styles.payOption}>
            <Text style={styles.payText}>إعدادات PayPal (تفعيل / تعطيل)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.payOption}>
            <Text style={styles.payText}>إعدادات Western Union (بيانات التحويل)</Text>
          </TouchableOpacity>
        </View>
      )}

      {activeTab === 'USERS' && (
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>إدارة أذونات المستخدمين</Text>
          <TouchableOpacity 
            style={[styles.payOption, { borderRightColor: '#d32f2f' }]}
            onPress={() => handleDeleteUser({ name: 'مستخدم تجريبي', role: 'user' })}
          >
            <Text style={{ color: '#d32f2f', fontWeight: 'bold' }}>حظر مستخدم مخالف</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f9f9f9' },
  header: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 15, marginTop: 10 },
  tabBar: { flexDirection: 'row-reverse', justifyContent: 'space-around', backgroundColor: '#fff', borderRadius: 8, padding: 5, elevation: 2 },
  tab: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6 },
  activeTab: { backgroundColor: '#0066cc' },
  tabText: { fontWeight: 'bold', color: '#333' },
  activeTabText: { color: '#fff' },
  content: { marginTop: 20 },
  sectionTitle: { textAlign: 'right', fontWeight: 'bold', fontSize: 16, marginBottom: 10 },
  payOption: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10, borderRightWidth: 4, borderRightColor: '#0066cc', elevation: 1 },
  payText: { textAlign: 'right', fontWeight: '500' }
});
