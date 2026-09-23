import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';

export default function SignUpScreen({ navigation }: any) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
    if (!fullName || !email || !password) {
      Alert.alert('تنبيه', 'يرجى تعبئة جميع الحقول المطلوبة');
      return;
    }
    Alert.alert('نجاح', 'تم إنشاء الحساب بنجاح!', [
      { text: 'تسجيل الدخول', onPress: () => navigation.navigate('Auth') }
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>إنشاء حساب جديد</Text>
      <Text style={styles.subtitle}>أدخل بياناتك للانضمام إلى منصة سيارتي ستور</Text>

      <TextInput
        style={styles.input}
        placeholder="الاسم الكامل"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="البريد الإلكتروني"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="رقم الهاتف"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="كلمة السر"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.btn} onPress={handleSignUp}>
        <Text style={styles.btnText}>إنشاء الحساب</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Auth')} style={styles.linkBtn}>
        <Text style={styles.linkText}>لديك حساب بالفعل؟ <Text style={styles.boldText}>تسجيل الدخول</Text></Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', color: '#0a192f', marginBottom: 6 },
  subtitle: { fontSize: 13, color: '#64748b', textAlign: 'center', marginBottom: 24 },
  input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 10, padding: 14, textAlign: 'right', marginBottom: 14, fontSize: 14 },
  btn: { backgroundColor: '#16a34a', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  linkBtn: { marginTop: 20, alignItems: 'center' },
  linkText: { color: '#64748b', fontSize: 14 },
  boldText: { color: '#0066cc', fontWeight: 'bold' }
});
