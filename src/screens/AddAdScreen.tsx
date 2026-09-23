import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';

export default function AddAdScreen({ navigation }: any) {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [color, setColor] = useState('');
  const [price, setPrice] = useState('');
  const [mileage, setMileage] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePublish = async () => {
    if (!make || !model || !price || !phone) {
      Alert.alert('تنبيه', 'يرجى تعبئة الماركة، الموديل، السعر، ورقم الهاتف');
      return;
    }

    setLoading(true);
    const { error } = await supabase.from('ads').insert([
      {
        title: `${make} ${model} ${year}`,
        make,
        model,
        year,
        color,
        price: parseFloat(price),
        mileage,
        phone,
        description,
        images: ['https://via.placeholder.com/400'],
      },
    ]);

    setLoading(false);

    if (error) {
      Alert.alert('خطأ', error.message);
    } else {
      Alert.alert('نجاح', 'تم نشر إعلانك بنجاح!', [
        { text: 'حسناً', onPress: () => navigation.navigate('Home') }
      ]);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>نشر إعلان سيارة جديد</Text>
      
      <TextInput style={styles.input} placeholder="الماركة (مثال: تويوتا)" value={make} onChangeText={setMake} />
      <TextInput style={styles.input} placeholder="الموديل (مثال: كامري)" value={model} onChangeText={setModel} />
      <TextInput style={styles.input} placeholder="سنة الصنع (مثال: 2024)" value={year} onChangeText={setYear} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="اللون" value={color} onChangeText={setColor} />
      <TextInput style={styles.input} placeholder="السعر (د.ك)" value={price} onChangeText={setPrice} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="الكيلومترات (مثال: 50000)" value={mileage} onChangeText={setMileage} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="رقم للتواصل (واتساب / اتصال)" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <TextInput style={[styles.input, { height: 90 }]} placeholder="تفاصيل إضافية عن السيارة..." value={description} onChangeText={setDescription} multiline />

      <TouchableOpacity style={styles.submitBtn} onPress={handlePublish} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>نشر الإعلان الآن</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#0a192f', textAlign: 'right', marginBottom: 20 },
  input: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 10, padding: 12, textAlign: 'right', marginBottom: 12, fontSize: 14 },
  submitBtn: { backgroundColor: '#16a34a', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 10, marginBottom: 40 },
  submitBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
