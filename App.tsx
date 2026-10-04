import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

export default function App() {
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {/* ضبط لون شريط الساعة ليتناسق مع الهيدر */}
        <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
        
        {/* إضافة حماية لمنع قص الهيدر من الأعلى */}
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
          <WebView
            source={{ uri: 'https://sayarty.store' }}
            style={styles.webview}
            scalesPageToFit={true}
            showsVerticalScrollIndicator={false}
            javaScriptEnabled={true}
            domStorageEnabled={true}
          />
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // لون خلفية الهيدر لمنع ظهور حواف بيضاء
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  webview: {
    flex: 1,
  },
});
