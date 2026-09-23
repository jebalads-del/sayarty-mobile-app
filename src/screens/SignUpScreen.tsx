import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';

export default function SignUpScreen({ navigation }: any) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    setError('');
    if (!fullName || !email || !password) {
      setError('يرجى تعبئة جميع الحقول المطلوبة');
      return;
    }

    setLoading(true);
    const trimmedEmail = email.trim().toLowerCase();

    try {
      // 1. إنشاء حساب في جدول المستخدمين المخصص
      const { error: dbError } = await supabase.from('users').insert([
        {
          full_name: fullName,
          email: trimmedEmail,
          phone: phone,
          password: password,
          role: 'user'
        }
      ]);

      if (dbError) {
        // إذا فشل الجدول المخصص تجربة Supabase Auth
        const { error: authError } = await supabase.auth.signUp({
          email: trimmedEmail,
          password: password,
        });

        if (authError) {
          setError(authError.message);
          setLoading(false);
          return;
        }
      }

      setLoading(false);
      Alert.alert('تم إنشاء الحساب', 'تم إنشاء حسابك بنجاح! يمكنك الآن تسجيل الدخول', [
        { text: 'تسجيل الدخول', onPress: () => navigation.navigate('Auth') }
      ]);

    } catch (err: any) {
      setLoading(false);
      setError('حدث خطأ أثناء إنشاء الحساب');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>حساب جديد</Text>
        <Text style={styles.subtitle}>أدخل بياناتك للانضمام إلى منصة سيارتي ستور</Text>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>❌ {error}</Text>
          </View>
        ) : null}

        <Text style={styles.label}>الاسم الكامل</Text>
        <TextInput style={styles.input} placeholder="عبدالله الكويتي" value={fullName} onChangeText={setFullName} />

        <Text style={styles.label}>البريد الإلكتروني</Text>
        <TextInput style={styles.input} placeholder="example@domain.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

        <Text style={styles.label}>رقم الهاتف</Text>
        <TextInput style={styles.input} placeholder="90000000" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

        <Text style={styles.label}>كلمة المرور</Text>
        <TextInput style={styles.input} placeholder="••••••••" value={password} onChangeText={setPassword} secureTextEntry />

        <TouchableOpacity style={styles.submitBtn} onPress={handleSignUp} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>إنشاء الحساب 🚀</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Auth')} style={styles.linkBtn}>
          <Text style={styles.linkText}>لديك حساب بالفعل؟ <Text style={styles.boldText}>تسجيل الدخول</Text></Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#f8fafc', justifyContent: 'center', padding: 20 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 24, borderWidth: 1, borderColor: '#e2e8f0', elevation: 2 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1e293b', textAlign: 'center', marginBottom: 6 },
  subtitle: { fontSize: 13, color: '#64748b', textAlign: 'center', marginBottom: 24 },
  errorBox: { padding: 12, backgroundColor: '#fee2e2', borderRadius: 8, marginBottom: 16 },
  errorText: { color: '#dc2626', fontSize: 13, fontWeight: '500', textAlign: 'center' },
  label: { fontSize: 14, color: '#334155', fontWeight: '500', textAlign: 'right', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 12, textAlign: 'right', marginBottom: 14, fontSize: 14 },
  submitBtn: { backgroundColor: '#16a34a', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  linkBtn: { marginTop: 20, alignItems: 'center' },
  linkText: { color: '#64748b', fontSize: 14 },
  boldText: { color: '#2563eb', fontWeight: 'bold' }
});
