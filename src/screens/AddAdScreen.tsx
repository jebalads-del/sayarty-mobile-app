import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../lib/supabase';

export default function AddAdScreen({ navigation }: any) {
  const [images, setImages] = useState<string[]>([]);
  const [make, setMake] = useState('تويوتا');
  const [model, setModel] = useState('كامري');
  const [year, setYear] = useState('2024');
  const [color, setColor] = useState('أبيض');
  const [mileage, setMileage] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  const pickImages = async () => {
    if (images.length >= 6) {
      Alert.alert('تنبيه', 'الحد الأقصى هو 6 صور فقط');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 6 - images.length,
      quality: 0.8,
    });

    if (!result.canceled) {
      const selected = result.assets.map((a) => a.uri);
      setImages([...images, ...selected].slice(0, 6));
    }
  };

  const handleSubmit = async () => {
    if (!price || !mileage) return Alert.alert('تنبيه', 'يرجى ملء جميع الحقول المطلوب');
    try {
      const { error } = await supabase.from('cars').insert([{
        make, model, year, color, mileage, price: parseFloat(price), description, images
      }]);
      if (error) throw error;
      Alert.alert('نجاح', 'تم نشر الإعلان بنجاح');
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('خطأ', err.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>نشر إعلان سيارة جديد</Text>
      <Text style={styles.label}>صور السيارة (حتى 6 صور):</Text>
      <View style={styles.imageGrid}>
        {images.map((uri, idx) => (<Image key={idx} source={{ uri }} style={styles.thumb} />))}
        {images.length < 6 && (
          <TouchableOpacity style={styles.addImgBtn} onPress={pickImages}>
            <Text style={styles.addImgText}>+ إضافة صورة</Text>
          </TouchableOpacity>
        )}
      </View>
      <TextInput style={styles.input} value={make} onChangeText={setMake} placeholder="الماركة" />
      <TextInput style={styles.input} value={model} onChangeText={setModel} placeholder="الموديل" />
      <TextInput style={styles.input} value={year} onChangeText={setYear} keyboardType="numeric" placeholder="السنة" />
      <TextInput style={styles.input} value={color} onChangeText={setColor} placeholder="اللون" />
      <TextInput style={styles.input} value={mileage} onChangeText={setMileage} keyboardType="numeric" placeholder="الكيلومترات (كم)" />
      <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" placeholder="السعر" />
      <TextInput style={[styles.input, { height: 80 }]} multiline value={description} onChangeText={setDescription} placeholder="تفاصيل إضافية عن السيارة..." />
      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitText}>نشر الإعلان الآن</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'right', marginBottom: 15 },
  label: { textAlign: 'right', fontWeight: 'bold', marginTop: 10, marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 8, textAlign: 'right', marginBottom: 10 },
  imageGrid: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 10, marginBottom: 10 },
  thumb: { width: 80, height: 80, borderRadius: 8 },
  addImgBtn: { width: 80, height: 80, borderRadius: 8, borderWidth: 1, borderColor: '#0066cc', justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed' },
  addImgText: { color: '#0066cc', fontSize: 11, textAlign: 'center' },
  submitBtn: { backgroundColor: '#2e7d32', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 10, marginBottom: 40 },
  submitText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
