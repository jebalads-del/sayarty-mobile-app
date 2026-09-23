import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, Image, ActivityIndicator, Switch
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../lib/supabase';

const currencies = [
  { code: 'KWD', symbol: 'د.ك', name: 'دينار كويتي' },
  { code: 'SAR', symbol: 'ر.س', name: 'ريال سعودي' },
  { code: 'AED', symbol: 'د.إ', name: 'درهم إماراتي' },
  { code: 'QAR', symbol: 'ر.ق', name: 'ريال قطري' },
  { code: 'BHD', symbol: 'د.ب', name: 'دينار بحريني' },
  { code: 'OMR', symbol: 'ر.ع', name: 'ريال عماني' },
];

const BRANDS = [
  'تويوتا', 'هوندا', 'مرسيدس', 'بي إم دبليو', 'أودي',
  'فولكس واجن', 'فورد', 'شيفروليه', 'نيسان', 'هيونداي',
  'كيا', 'مازدا', 'لكزس', 'جيب', 'رينو', 'بيجو',
  'سيات', 'ميتسوبيشي', 'سوبارو', 'فولفو', 'جاغوار',
  'لاند روفر', 'بورش', 'فيات', 'ألفا روميو', 'أخرى'
];

const MODELS: Record<string, string[]> = {
  'تويوتا': ['كامري', 'كورولا', 'لاندكروزر', 'برادو', 'أفالون', 'راف فور', 'يارس', 'هيلوكس', 'هايلوكس', 'فورتشنر', 'أخرى'],
  'هوندا': ['أكورد', 'سيفيك', 'سي آر في', 'بايلوت', 'أوديسي', 'سيتي', 'HR-V', 'أخرى'],
  'مرسيدس': ['الفئة C', 'الفئة E', 'الفئة S', 'GLC', 'GLE', 'G-Class', 'CLA', 'A-Class', 'AMG GT', 'أخرى'],
  'بي إم دبليو': ['الفئة الثالثة', 'الفئة الخامسة', 'الفئة السابعة', 'X5', 'X6', 'X3', 'X7', 'X1', 'Z4', 'أخرى'],
  'أودي': ['A4', 'A6', 'A8', 'Q5', 'Q7', 'Q8', 'A5', 'A3', 'Q3', 'RS6', 'أخرى'],
  'فولكس واجن': ['جولف', 'باسات', 'تويج', 'طوارق', 'أطلس', 'بيتل', 'أخرى'],
  'فورد': ['تورس', 'موستانج', 'إكسبلورر', 'إكسبيدشن', 'إف 150', 'إيدج', 'فوكس', 'فيوجن', 'أخرى'],
  'شيفروليه': ['تاهو', 'سيلفرادو', 'كامارو', 'ماليبو', 'كابرس', 'ترافرس', 'كورفيت', 'أخرى'],
  'نيسان': ['باترول', 'ألتيما', 'ماكسيما', 'صني', 'إكس تريل', 'باثفايندر', 'نافارا', 'سفاري', 'أخرى'],
  'هيونداي': ['إلنترا', 'سوناتا', 'أكسنت', 'سانتا في', 'توسان', 'أزيرا', 'كريتا', 'باليسايد', 'أخرى'],
  'كيا': ['أوبتيما', 'سيراتو', 'سبورتج', 'سورينتو', 'ريو', 'K5', 'كادينزا', 'ستنجر', 'أخرى'],
  'مازدا': ['مازدا 3', 'مازدا 6', 'CX-5', 'CX-9', 'MX-5', 'أخرى'],
  'لكزس': ['LS', 'LX', 'RX', 'ES', 'IS', 'GX', 'NX', 'UX', 'LC', 'أخرى'],
  'جيب': ['جراند شيروكي', 'روبيكون', 'رولنجر', 'شيروكي', 'كومباس', 'رينيجيد', 'أخرى'],
  'رينو': ['لوجان', 'سانديرو', 'ميجان', 'كابتشر', 'داستر', 'كوليو', 'أخرى'],
  'بيجو': ['208', '301', '308', '408', '508', '2008', '3008', '5008', 'بارتنر', 'أخرى'],
  'سيات': ['إيبيزا', 'ليون', 'طليعة', 'أرونا', 'أتيكا', 'أخرى'],
  'ميتسوبيشي': ['لانسر', 'باجيرو', 'آوتلاندر', 'ASX', 'إكليبس', 'أخرى'],
  'سوبارو': ['إمبريزا', 'أوت باك', 'فورستر', 'ليغاسي', 'XV', 'WRX', 'أخرى'],
  'فولفو': ['S60', 'S90', 'XC40', 'XC60', 'XC90', 'V60', 'أخرى'],
  'جاغوار': ['XE', 'XF', 'XJ', 'F-PACE', 'E-PACE', 'I-PACE', 'أخرى'],
  'لاند روفر': ['رينج روفر', 'سبورت', 'فيلار', 'ديسكفري', 'ديفندر', 'أخرى'],
  'بورش': ['كايين', 'ماكان', 'باناميرا', 'تاي كان', '911', 'بوكستر', 'أخرى'],
  'فيات': ['500', 'باندا', 'تيبو', 'دوبلو', 'أخرى'],
  'ألفا روميو': ['جوليا', 'ستيلفيو', 'جوليتا', 'أخرى'],
  'أخرى': ['أخرى']
};

const COLORS = ['أسود', 'أبيض', 'أحمر', 'أزرق', 'رمادي', 'فضي', 'ذهبي', 'بني', 'أخضر', 'أصفر', 'برتقالي', 'بيج', 'نحاسي'];

export default function AddCarScreen({ navigation }: any) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear().toString(),
    price: '',
    kilometers: '',
    color: '',
    description: '',
    currency: 'KWD',
  });

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUserId(session.user.id);
    } else {
      setUserId('2bee03ee-4e4e-464a-8bd9-56f15a056432');
    }
  };

  const pickImages = async () => {
    if (images.length >= 4) {
      Alert.alert('تنبيه', 'يمكنك اختيار حتى 4 صور فقط');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
      selectionLimit: 4 - images.length,
    });

    if (!result.canceled) {
      const newUris = result.assets.map(a => a.uri);
      setImages([...images, ...newUris].slice(0, 4));
    }
  };

  const removeImage = (index: number) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
  };

  const handleSubmit = async () => {
    setError('');
    if (!formData.brand || !formData.model || !formData.price) {
      setError('الماركة والموديل والسعر حقول مطلوبة');
      return;
    }

    if (!agreeToTerms) {
      setError('يجب الموافقة على الشروط والأحكام قبل النشر');
      return;
    }

    setLoading(true);

    try {
      // 1. رفع الصور أولاً إن وجدت
      const uploadedUrls: string[] = [];
      for (let i = 0; i < images.length; i++) {
        const uri = images[i];
        const ext = uri.split('.').pop() || 'jpg';
        const fileName = `${Date.now()}-${i}.${ext}`;
        const filePath = `cars/${fileName}`;

        const response = await fetch(uri);
        const blob = await response.blob();

        const { error: uploadErr } = await supabase.storage
          .from('car-images')
          .upload(filePath, blob, { contentType: `image/${ext}` });

        if (!uploadErr) {
          const { data: urlData } = supabase.storage.from('car-images').getPublicUrl(filePath);
          if (urlData?.publicUrl) uploadedUrls.push(urlData.publicUrl);
        }
      }

      // 2. إضافة بيانات السيارة لـ Supabase
      const { error: dbError } = await supabase.from('cars').insert([
        {
          brand: formData.brand,
          model: formData.model,
          year: parseInt(formData.year) || new Date().getFullYear(),
          price: parseFloat(formData.price),
          kilometers: formData.kilometers ? parseFloat(formData.kilometers) : null,
          color: formData.color || null,
          description: formData.description || null,
          images: uploadedUrls,
          user_id: userId,
          currency: formData.currency,
          status: 'pending',
          terms_accepted: true,
          terms_accepted_at: new Date().toISOString(),
          terms_version: 'v1.0'
        }
      ]);

      setLoading(false);

      if (dbError) {
        setError(dbError.message || 'فشل نشر الإعلان');
      } else {
        Alert.alert('نجاح', '✅ تم نشر الإعلان بنجاح وهو قيد المراجعة', [
          { text: 'موافق', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (err) {
      setLoading(false);
      setError('حدث خطأ غير متوقع أثناء نشر الإعلان');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* الشريط العلوي */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📢 إضافة إعلان سيارة جديد</Text>
        <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>❌ {error}</Text>
        </View>
      ) : null}

      <View style={styles.formCard}>
        {/* الماركة */}
        <Text style={styles.label}>الماركة *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pickerScroll}>
          {BRANDS.map(b => (
            <TouchableOpacity
              key={b}
              style={[styles.chip, formData.brand === b && styles.activeChip]}
              onPress={() => setFormData({ ...formData, brand: b, model: '' })}
            >
              <Text style={[styles.chipText, formData.brand === b && styles.activeChipText]}>{b}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* الموديل */}
        {formData.brand ? (
          <>
            <Text style={styles.label}>الموديل *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pickerScroll}>
              {(MODELS[formData.brand] || ['أخرى']).map(m => (
                <TouchableOpacity
                  key={m}
                  style={[styles.chip, formData.model === m && styles.activeChip]}
                  onPress={() => setFormData({ ...formData, model: m })}
                >
                  <Text style={[styles.chipText, formData.model === m && styles.activeChipText]}>{m}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        ) : null}

        {/* السعر والعملة */}
        <View style={styles.row}>
          <View style={{ flex: 2, marginRight: 8 }}>
            <Text style={styles.label}>السعر *</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              keyboardType="numeric"
              value={formData.price}
              onChangeText={t => setFormData({ ...formData, price: t })}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>العملة</Text>
            <ScrollView horizontal style={styles.pickerScroll}>
              {currencies.map(c => (
                <TouchableOpacity
                  key={c.code}
                  style={[styles.smallChip, formData.currency === c.code && styles.activeChip]}
                  onPress={() => setFormData({ ...formData, currency: c.code })}
                >
                  <Text style={[styles.chipText, formData.currency === c.code && styles.activeChipText]}>{c.symbol}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* سنة الصنع واللون */}
        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.label}>سنة الصنع</Text>
            <TextInput
              style={styles.input}
              placeholder="2024"
              keyboardType="numeric"
              value={formData.year}
              onChangeText={t => setFormData({ ...formData, year: t })}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>اللون</Text>
            <TextInput
              style={styles.input}
              placeholder="أبيض"
              value={formData.color}
              onChangeText={t => setFormData({ ...formData, color: t })}
            />
          </View>
        </View>

        {/* الكيلومترات */}
        <Text style={styles.label}>المسافة المقطوعة (كم)</Text>
        <TextInput
          style={styles.input}
          placeholder="مثال: 50000"
          keyboardType="numeric"
          value={formData.kilometers}
          onChangeText={t => setFormData({ ...formData, kilometers: t })}
        />

        {/* الوصف */}
        <Text style={styles.label}>الوصف</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="تفاصيل حالة السيارة، الفحص، إلخ..."
          multiline
          numberOfLines={3}
          value={formData.description}
          onChangeText={t => setFormData({ ...formData, description: t })}
        />

        {/* رفع الصور */}
        <Text style={styles.label}>صور السيارة (حتى 4 صور)</Text>
        <TouchableOpacity style={styles.imageUploadBox} onPress={pickImages}>
          <Text style={{ fontSize: 24 }}>📸</Text>
          <Text style={styles.uploadText}>اضغط هنا لاختيار الصور</Text>
        </TouchableOpacity>

        <View style={styles.previewRow}>
          {images.map((img, i) => (
            <View key={i} style={styles.previewBox}>
              <Image source={{ uri: img }} style={styles.previewImage} />
              <TouchableOpacity style={styles.removeImgBtn} onPress={() => removeImage(i)}>
                <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* الشروط والأحكام */}
        <View style={styles.termsBox}>
          <Text style={styles.termsTitle}>📜 الشروط والأحكام</Text>
          <Text style={styles.termsText}>
            🚫 يُمنع نقل الإعلانات أو وضع معلومات غير دقيقة.{"\n"}
            ✅ تتعهد بأن الصور والمعلومات مملوكة لك وتحت مسؤوليتك الكاملة.
          </Text>
          <View style={styles.switchRow}>
            <Switch value={agreeToTerms} onValueChange={setAgreeToTerms} trackColor={{ true: '#16a34a' }} />
            <Text style={styles.switchText}>أوافق على الشروط والأحكام وأتحمل كامل المسؤولية.</Text>
          </View>
        </View>

        {/* زر النشر */}
        <TouchableOpacity
          style={[styles.submitBtn, (!agreeToTerms || loading) && styles.disabledBtn]}
          onPress={handleSubmit}
          disabled={!agreeToTerms || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitBtnText}>🚙 نشر الإعلان</Text>
          )}
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#f8fafc', flexGrow: 1 },
  header: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b' },
  closeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#e2e8f0', justifyContent: 'center', alignItems: 'center' },
  closeBtnText: { fontSize: 16, color: '#64748b', fontWeight: 'bold' },
  errorBox: { backgroundColor: '#fee2e2', padding: 12, borderRadius: 8, marginBottom: 16 },
  errorText: { color: '#dc2626', textAlign: 'center', fontSize: 13, fontWeight: 'bold' },
  formCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  label: { fontSize: 13, fontWeight: 'bold', color: '#334155', textAlign: 'right', marginBottom: 6, marginTop: 8 },
  input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 10, textAlign: 'right', fontSize: 14, backgroundColor: '#f8fafc' },
  textArea: { height: 80, textAlignVertical: 'top' },
  row: { flexDirection: 'row-reverse', marginBottom: 8 },
  pickerScroll: { flexDirection: 'row-reverse', marginBottom: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f1f5f9', marginLeft: 6 },
  smallChip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: '#f1f5f9', marginLeft: 4 },
  activeChip: { backgroundColor: '#2563eb' },
  chipText: { fontSize: 12, color: '#475569' },
  activeChipText: { color: '#fff', fontWeight: 'bold' },
  imageUploadBox: { borderWidth: 2, borderColor: '#cbd5e1', borderStyle: 'dashed', padding: 16, borderRadius: 12, alignItems: 'center', backgroundColor: '#f8fafc', marginVertical: 8 },
  uploadText: { fontSize: 12, color: '#2563eb', fontWeight: 'bold', marginTop: 4 },
  previewRow: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  previewBox: { width: 60, height: 60, borderRadius: 8, overflow: 'hidden', position: 'relative', borderWidth: 1, borderColor: '#cbd5e1' },
  previewImage: { width: '100%', height: '100%' },
  removeImgBtn: { position: 'absolute', top: 2, right: 2, backgroundColor: 'rgba(220,38,38,0.85)', borderRadius: 10, width: 18, height: 18, justifyContent: 'center', alignItems: 'center' },
  termsBox: { backgroundColor: '#fef2f2', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#fecaca', marginVertical: 12 },
  termsTitle: { fontSize: 13, fontWeight: 'bold', color: '#dc2626', textAlign: 'right', marginBottom: 4 },
  termsText: { fontSize: 11, color: '#7f1d1d', textAlign: 'right', lineHeight: 18 },
  switchRow: { flexDirection: 'row-reverse', alignItems: 'center', marginTop: 8 },
  switchText: { fontSize: 11, color: '#166534', fontWeight: 'bold', flex: 1, textAlign: 'right', marginRight: 8 },
  submitBtn: { backgroundColor: '#2563eb', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  disabledBtn: { backgroundColor: '#94a3b8' },
  submitBtnText: { color: '#fff', fontSize: 15, fontWeight: 'bold' }
});
