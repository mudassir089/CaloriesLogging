import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ViewStyle,
} from 'react-native';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../utils/colors';
import { widthPercentage, heightPercentage } from '../utils/constants';
import { useMealLog } from '../context/MealLoagContext';
import { analyzeMealWithOpenAI } from '../utils/analyzeMeal';
import { HomeStackProps } from '../navigation/types';

const CameraScreen: React.FC<HomeStackProps<'CameraScreen'>> = ({
  navigation,
}) => {
  const camera = useRef<Camera>(null);
  const device = useCameraDevice('back');

  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'food' | 'barcode'>('food');
  const [barcode, setBarcode] = useState<string | null>(null);
  const { addLog, currentMealType } = useMealLog();
  const [scanningState, setScanningState] = useState<'camera' | 'loading'>('camera');
  const scanningLock = useRef(false);

  const takePhoto = async () => {
    if (!camera.current || !currentMealType) return;
    setLoading(true);
    try {
      const photo = await camera.current.takePhoto({
        flash: 'off',
      });
      const macros = await analyzeMealWithOpenAI('', photo.path);
      if ('error' in macros) {
        Alert.alert('Error', macros.error);
        return;
      }
      addLog({
        id: Date.now().toString(),
        date: new Date().toISOString(),
        input: macros.name || '[Photo]',
        mealType: currentMealType,
        image: photo.path,
        ...macros,
      });
      navigation.navigate('HomeScreen');
    } catch (e) {
      Alert.alert('Error', 'Failed to analyze meal.');
    } finally {
      setLoading(false);
    }
  };

  const codeScanner = useCodeScanner({
    codeTypes: ['ean-13', 'ean-8', 'upc-a', 'upc-e', 'code-128', 'code-39', 'qr'],
    onCodeScanned: (codes) => {
      if (loading || scanningLock.current) return;
      if (codes.length > 0) {
        const code = codes[0].value;
        if (code && code !== barcode) {
          scanningLock.current = true;
          setBarcode(code);
          setScanningState('loading');
          handleBarcodeScanned(code,);
        }
      }
    },
  });

  const handleBarcodeScanned = async (code: string) => {
    console.log("scanningState", scanningState)
    if (!camera.current || !currentMealType || scanningState === "loading") return;
    try {
      const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${code}.json`);
      const data = await res.json();
      if (data.status === 1) {
        const product = data.product;
        const productName = product.product_name || '[Barcode]';
        const productImage = product.image_front_url;

        const macros = await analyzeMealWithOpenAI(productName);

        if ('error' in macros) {
          Alert.alert('Error', macros.error, [
            {
              text: 'OK',
              onPress: () => {
                setScanningState('camera');
                setBarcode(null);
                scanningLock.current = false; 
              },
            },
          ]);
          return;
        } else {
          addLog({
            id: Date.now().toString(),
            date: new Date().toISOString(),
            input: productName,
            mealType: currentMealType,
            image: productImage,
            ...macros,
          });
          navigation.navigate('HomeScreen');
          scanningLock.current = false;
        }


      } else {
        Alert.alert('Error', 'Product not found.', [
          {
            text: 'OK',
            onPress: () => {
              setScanningState('camera');
              setBarcode(null);
              scanningLock.current = false;
            },
          },
        ]);
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to fetch product info.', [
        {
          text: 'OK',
          onPress: () => {
            setScanningState('camera');
            setBarcode(null);
            scanningLock.current = false;
          },
        },
      ]);
    }
  };
  if (!device) {
    return (
      <View style={styles.noDeviceFoundContainer}>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => navigation.goBack()}>
          <Icon name="close" color={COLORS.white} size={20} />
        </TouchableOpacity>
        <Text style={styles.noDeviceText}>No Camera Found</Text>
      </View>
    );
  }

  return (
    <View style={styles.bg}>
      <View style={styles.tipBox}>
        <Text style={styles.tipTitle}>ⓘ Tip</Text>
        <Text style={styles.tipText}>
          Snap a photo of your food, barcode, or menu — AI will analyze it and
          log your nutrients
        </Text>
      </View>

      <View style={styles.cameraContainer}>
      { scanningState === 'camera' && (
          <Camera
            ref={(scanningState === "camera"  && !loading) ? camera : null}
            style={styles.camera}
            device={device}
            isActive={(scanningState === "camera" && !loading) ? true : false}
            photo={true}
            codeScanner={mode === 'barcode' ? codeScanner : undefined}
          />
        )}
        {scanningState === 'loading' && (
          <View style={[styles.loaderOverlay, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={{ color: COLORS.white, marginTop: 16 }}>Analyzing barcode...</Text>
          </View>
        )}
        <View style={styles.overlayCornerTL} />
        <View style={styles.overlayCornerTR} />
        <View style={styles.overlayCornerBL} />
        <View style={styles.overlayCornerBR} />
      </View>

      <Text style={styles.holdText}>Hold Camera Still</Text>

      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleBtn, mode === 'food' && styles.toggleBtnActive]}
          onPress={() => setMode('food')}>
          <Text
            style={[
              styles.toggleText,
              mode === 'food' && styles.toggleTextActive,
            ]}>
            Scan Food
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleBtn,
            mode === 'barcode' && styles.toggleBtnActive,
          ]}
          onPress={() => setMode('barcode')}>
          <Text
            style={[
              styles.toggleText,
              mode === 'barcode' && styles.toggleTextActive,
            ]}>
            Bar Code
          </Text>
        </TouchableOpacity>
      </View>
      {mode === 'food' &&
        <TouchableOpacity
          style={styles.shutterBtn}
          onPress={takePhoto}
          disabled={loading}
          activeOpacity={0.7}>
          {loading ? (
            <ActivityIndicator color={COLORS.primary} />
          ) : (
            <View style={styles.shutterInner} />
          )}
        </TouchableOpacity>
      }
      <TouchableOpacity
        style={styles.closeBtn}
        onPress={() => navigation.goBack()}>
        <Icon name="close" color={COLORS.white} size={20} />
      </TouchableOpacity>

      {loading && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}

    </View>
  );
};

export default CameraScreen;

const overlayCorner: ViewStyle = {
  position: 'absolute',
  top: heightPercentage(60),
  width: widthPercentage(12),
  height: widthPercentage(10),
  marginHorizontal: 20,
  borderColor: COLORS.primary,
  borderWidth: 3,
  zIndex: 2,
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: COLORS.bg,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  tipBox: {
    position: 'absolute',
    top: heightPercentage(15),
    left: widthPercentage(4),
    right: widthPercentage(4),
    backgroundColor: COLORS.camereBtn,
    borderRadius: 16,
    padding: widthPercentage(4),
    zIndex: 10,
  },
  tipTitle: {
    fontWeight: 'bold',
    color: COLORS.white,
    fontSize: heightPercentage(1.7),
    marginBottom: 2,
  },
  tipText: {
    color: COLORS.white,
    fontSize: heightPercentage(1.7),
  },
  cameraContainer: {
    width: widthPercentage(100),
    height: heightPercentage(100),
    borderRadius: widthPercentage(6),
    overflow: 'hidden',
    alignSelf: 'center',
    position: 'relative',
    backgroundColor: COLORS.camereBtn,
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  overlayCornerTL: {
    ...overlayCorner,
    top: heightPercentage(35),
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 16,
  },
  overlayCornerTR: {
    ...overlayCorner,
    top: heightPercentage(35),
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 16,
  },
  overlayCornerBL: {
    ...overlayCorner,
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 16,
  },
  overlayCornerBR: {
    ...overlayCorner,
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 16,
  },
  holdText: {
    color: COLORS.white,
    fontSize: heightPercentage(2.1),
    fontWeight: '600',
    marginTop: heightPercentage(3),
    marginBottom: heightPercentage(2),
    textAlign: 'center',
  },
  toggleRow: {
    position: 'absolute',
    bottom: heightPercentage(2),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: heightPercentage(3),
    marginTop: heightPercentage(1),
  },
  toggleBtn: {
    paddingVertical: heightPercentage(1.2),
    paddingHorizontal: widthPercentage(7),
    borderRadius: 12,
    backgroundColor: COLORS.camereBtn,
    marginHorizontal: widthPercentage(1),
  },
  toggleBtnActive: {
    backgroundColor: COLORS.white,
  },
  toggleText: {
    color: COLORS.grey,
    fontSize: heightPercentage(1.8),
    fontWeight: '500',
  },
  toggleTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  shutterBtn: {
    position: 'absolute',
    bottom: heightPercentage(8),
    width: widthPercentage(18),
    height: widthPercentage(18),
    borderRadius: widthPercentage(9),
    borderWidth: 4,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: heightPercentage(1),
    marginBottom: heightPercentage(4),
  },
  shutterInner: {
    width: widthPercentage(12),
    height: widthPercentage(12),
    borderRadius: widthPercentage(6),
    borderColor: COLORS.primary,
  },
  closeBtn: {
    position: 'absolute',
    top: heightPercentage(6),
    right: widthPercentage(6),
    width: widthPercentage(10),
    height: widthPercentage(10),
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    backgroundColor: COLORS.camereBtn,
    borderRadius: widthPercentage(5),
  },
  noDeviceFoundContainer: {
    flex: 1,
    backgroundColor: COLORS.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDeviceText: {
    color: COLORS.white,
    fontSize: heightPercentage(3),
  },
  loaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.overly,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
});
