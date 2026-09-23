import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { supabase } from '../lib/supabase';

export default function AuthScreen({ navigation }: any) {
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'INPUT' | 'OTP' | 'FORGOT'>('INPUT');

  const handleSendOTP = async () => {
    if (!phoneOrEmail) return Alert.alert('تنبيه', 'يرجى إدخال البريد الإلكتروني أو رقم الهاتف');
    try {
      const { error } = await supabase.auth.signInWithOtp({ email: phoneOrEmail });
      if (error) throw error;
      setStep('OTP');
      Alert.alert('تم الإرسال', 'تم إرسال رمز التحقق OTP إلى بريدك/هاتفك');
    } catch (err: any) {
      Alert.alert('خطأ', err.message);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) return Alert.alert('خطأ', 'رمز الـ OTP يتكون من 6 أرقام');
    try {
      const { error } = await supabase.auth.verifyOtp({ email: phoneOrEmail, token: otp, type: 'email' });
      if (error) throw error;
      Alert.alert('نجاح', 'تم تسجيل الدخول بنجاح');
      navigation.navigate('Home');
    } catch (err: any) {
      Alert.alert('خطأ', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>
        {step === 'INPUT' ? 'تسجيل الدخول / حساب جديد' : step === 'OTP' ? 'أدخل رمز التحقق OTP' : 'استعادة كلمة المرور'}
      </Text>

      {step === 'INPUT' ? (
        <>
          <TextInput 
            style={styles.input} 
            placeholder="البريد الإلكتروني أو رقم الهاتف" 
            value={phoneOrEmail} 
            onChangeText={setPhoneOrEmail} 
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TouchableOpacity style={styles.btn} onPress={handleSendOTP}>
            <Text style={styles.btnText}>متابعة بـ OTP / دخول</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput 
            style={styles.input} 
            placeholder="- - - - - -" 
            keyboardType="number-pad" 
            maxLength={6} 
            value={otp} 
            onChangeText={setOtp} 
          />
          <TouchableOpacity style={styles.btn} onPress={handleVerifyOTP}>
            <Text style={styles.btnText}>تأكيد الرمز والدخول</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setStep('INPUT')} style={{ marginTop: 15 }}>
            <Text style={{ color: '#0066cc', textAlign: 'center' }}>إعادة إرسال الرمز / تغيير البيانات</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, textAlign: 'center', fontSize: 16, marginBottom: 15 },
  btn: { backgroundColor: '#0066cc', padding: 14, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' }
});
