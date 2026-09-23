import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function AuthScreen({ navigation }: any) {
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!contact || !password) {
      Alert.alert('تنبيه', 'يرجى إدخال بيانات الدخول وكلمة السر');
      return;
    }
    Alert.alert('تم الدخول', 'أهلاً بك! تم تسجيل دخولك بنجاح.', [
      { text: 'متابعة', onPress: () => navigation.navigate('Home') }
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>تسجيل الدخول</Text>
      
      <TextInput
        style={styles.input}
        placeholder="البريد الإلكتروني أو رقم الهاتف"
        value={contact}
        onChangeText={setContact}
      />
      <TextInput
        style={styles.input}
        placeholder="كلمة السر"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={{ alignSelf: 'flex-start', marginBottom: 20 }} onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.forgotText}>نسيت كلمة السر؟</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={handleLogin}>
        <Text style={styles.btnText}>دخول</Text>
      </TouchableOpacity>

      <View style={styles.registerRow}>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.registerLink}>أنشئ حساباً الآن</Text>
        </TouchableOpacity>
        <Text style={styles.registerText}>ليس لديك حساب؟ </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 24, color: '#0a192f' },
  input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 10, padding: 14, textAlign: 'right', marginBottom: 14 },
  forgotText: { color: '#0066cc', fontSize: 13, fontWeight: '500' },
  btn: { backgroundColor: '#0a192f', padding: 16, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  registerRow: { flexDirection: 'row-reverse', justifyContent: 'center', marginTop: 24 },
  registerText: { color: '#64748b', fontSize: 14 },
  registerLink: { color: '#16a34a', fontWeight: 'bold', fontSize: 14 }
});
