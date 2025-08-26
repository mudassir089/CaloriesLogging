import React, {RefObject} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLORS} from '../utils/colors';
import {
  widthPercentage,
  heightPercentage,
  LOG_OPTIONS,
} from '../utils/constants';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParamList} from '../navigation/types';
import type {BottomSheetModal as BottomSheetModalType} from '@gorhom/bottom-sheet';
import {BottomSheetDefaultBackdropProps} from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';

type Props = {
  navigation: NativeStackNavigationProp<HomeStackParamList, any>;
};

const CategoryBottomSheet = React.forwardRef<BottomSheetModalType, Props>(
  ({navigation}, ref) => {
    const renderBackdrop = React.useCallback(
      (
        props: React.JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps,
      ) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
        />
      ),
      [],
    );
    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={['65%']}
        index={1}
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.sheetBgStyle}>
        <BottomSheetView style={styles.sheetContent}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() =>
              (ref as RefObject<BottomSheetModalType>)?.current?.close()
            }>
            <Icon name="close" size={22} color={COLORS.black} />
          </TouchableOpacity>

          <Text style={styles.header}>Log Your Meal</Text>
          <Text style={styles.subHeader}>
            Choose how you'd like to log your food. We'll analyze it instantly
            and give you calorie and macro breakdowns
          </Text>

          <View style={styles.optionsContainer}>
            {LOG_OPTIONS.map((opt, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.optionBox}
                onPress={() => {
                  (ref as RefObject<BottomSheetModalType>)?.current?.close();
                  navigation.navigate(opt.navigate as never);
                }}
                activeOpacity={0.8}>
                <View style={styles.iconBox}>
                  <Image
                    source={opt.image}
                    style={styles.iconImage}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.optionTextBox}>
                  <Text style={styles.optionTitle}>{opt.title}</Text>
                  <Text style={styles.optionDesc}>{opt.desc}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

export default CategoryBottomSheet;

const styles = StyleSheet.create({
  sheetContent: {
    flex: 1,
    paddingHorizontal: widthPercentage(4),
    paddingTop: heightPercentage(3),
    paddingBottom: heightPercentage(2),
  },
  sheetBgStyle: {
    borderTopLeftRadius: heightPercentage(2),
    borderTopRightRadius: heightPercentage(2),
    backgroundColor: COLORS.white,
  },
  closeBtn: {
    position: 'absolute',
    top: heightPercentage(0.1),
    right: widthPercentage(4),
    backgroundColor: COLORS.closeBtnBg,
    borderRadius: widthPercentage(20),
    width: widthPercentage(10),
    height: widthPercentage(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: heightPercentage(3.2),
    fontWeight: '700',
    color: COLORS.dark,
    textAlign: 'center',
    marginBottom: heightPercentage(1.5),
    marginTop: heightPercentage(1),
  },
  subHeader: {
    fontSize: heightPercentage(1.8),
    color: COLORS.grey,
    textAlign: 'center',
    marginHorizontal: widthPercentage(2),
    marginBottom: heightPercentage(3),
  },
  optionsContainer: {
    gap: heightPercentage(2),
  },
  optionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: widthPercentage(3),
    padding: widthPercentage(4),
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border2,
    shadowColor: COLORS.black,
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  iconBox: {
    width: widthPercentage(12),
    height: widthPercentage(12),
    borderRadius: widthPercentage(3),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: widthPercentage(4),
  },
  iconImage: {
    width: '75%',
    height: '75%',
  },
  optionTextBox: {
    flex: 1,
    gap: heightPercentage(0.3),
  },
  optionTitle: {
    fontSize: heightPercentage(2.1),
    fontWeight: '600',
    marginBottom: heightPercentage(0.5),
  },
  optionDesc: {
    fontSize: heightPercentage(1.5),
    color: COLORS.grey,
  },
});
