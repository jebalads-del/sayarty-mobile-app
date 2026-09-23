import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function ForgotPasswordScreen({ navigation }: any) {
  const [email, setEmail] = useState('');

  const handleResetPassword = () => {
    if (!email) {
      Alert.alert('تنبيه', 'يرجى إدخال البريد الإلكتروني أو رقم الهاتف المسجل');
      return;
    }
    Alert.alert('تم الإرسال', 'تم إرسال تعليمات إعادة تعيين كلمة السر إلى بريدك الإلكتروني', [
      { text: 'حسناً', onPress: () => navigation.navigate('Auth') }
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>استعادة كلمة السر</Text>
      <Text style={styles.subtitle}>أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة السر</Text>

      <TextInput
        style={styles.input}
        placeholder="البريد الإلكتروني أو رقم الهاتف"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.btn} onPress={handleResetPassword}>
        <Text style={styles.btnText}>إرسال رابط الاستعادة</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.linkBtn}>
        <Text style={styles.linkText}>العودة لصفحة <Text style={styles.boldText}>تسجيل الدخول</Text></Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', color: '#0a192f', marginBottom: 6 },
  subtitle: { fontSize: 13, color: '#64748b', textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 10, padding: 14, textAlign: 'right', marginBottom: 16, fontSize: 14 },
  btn: { backgroundColor: '#0066cc', padding: 16, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  linkBtn: { marginTop: 20, alignItems: 'center' },
  linkText: { color: '#64748b', fontSize: 14 },
  boldText: { color: '#0066cc', fontWeight: 'bold' }
});
