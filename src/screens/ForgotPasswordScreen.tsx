import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';

export default function ForgotPasswordScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setMessage('');
    setError('');

    if (!email) {
      setError('يرجى إدخال البريد الإلكتروني');
      return;
    }

    setLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase());

      if (resetError) {
        setError(resetError.message || 'حدث خطأ، يرجى المحاولة مرة أخرى');
      } else {
        setMessage('✅ تم إرسال رابط/كود إعادة تعيين كلمة المرور إلى بريدك الإلكتروني');
        setTimeout(() => {
          navigation.navigate('Auth');
        }, 2500);
      }
    } catch (err: any) {
      setError('فشل الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>🔑 نسيت كلمة المرور؟</Text>
        <Text style={styles.subtitle}>
          أدخل بريدك الإلكتروني وسنرسل لك كوداً لإعادة تعيين كلمة المرور
        </Text>

        {message ? (
          <View style={styles.messageBox}>
            <Text style={styles.messageText}>{message}</Text>
          </View>
        ) : null}

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>❌ {error}</Text>
          </View>
        ) : null}

        <Text style={styles.label}>البريد الإلكتروني</Text>
        <TextInput
          style={styles.input}
          placeholder="example@email.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitBtnText}>إرسال كود إعادة التعيين</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Auth')} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← العودة إلى صفحة تسجيل الدخول</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', justifyContent: 'center', padding: 20 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 30, borderWidth: 1, borderColor: '#e2e8f0', elevation: 2 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1e293b', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 13, color: '#64748b', textAlign: 'center', marginBottom: 25, lineHeight: 20 },
  messageBox: { backgroundColor: '#d1fae5', padding: 12, borderRadius: 8, marginBottom: 15 },
  messageText: { color: '#065f46', fontSize: 13, fontWeight: '500', textAlign: 'center' },
  errorBox: { backgroundColor: '#fee2e2', padding: 12, borderRadius: 8, marginBottom: 15 },
  errorText: { color: '#991b1b', fontSize: 13, fontWeight: '500', textAlign: 'center' },
  label: { fontSize: 14, fontWeight: 'bold', color: '#334155', textAlign: 'right', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 12, textAlign: 'right', fontSize: 15, marginBottom: 20 },
  submitBtn: { backgroundColor: '#2563eb', padding: 14, borderRadius: 8, alignItems: 'center' },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  backBtn: { marginTop: 20, alignItems: 'center' },
  backBtnText: { color: '#64748b', fontSize: 14 }
});
