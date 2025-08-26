import React, {useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {COLORS} from '../utils/colors';
import type {BottomSheetModal as BottomSheetModalType} from '@gorhom/bottom-sheet';
import {BottomSheetDefaultBackdropProps} from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import {
  heightPercentage,
  widthPercentage,
  macroChips,
} from '../utils/constants';
import {MealLog} from '../context/MealLoagContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';

type Props = {
  selectedMealLog: MealLog | null;
};

const MealItemsBottomSheet = React.forwardRef<BottomSheetModalType, Props>(
  ({selectedMealLog}, ref) => {
    const navigation = useNavigation();
    const renderBackdrop = useCallback(
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
        backdropComponent={renderBackdrop}
        ref={ref}
        snapPoints={['65%']}
        index={1}
        backgroundStyle={styles.sheetBgStyle}>
        <BottomSheetView style={styles.sheetContent}>
          <Text style={styles.header}>{selectedMealLog?.mealType} Items</Text>
          <FlatList
            data={
              selectedMealLog?.items && selectedMealLog.items.length > 0
                ? selectedMealLog.items
                : []
            }
            keyExtractor={(_, idx) => idx.toString()}
            contentContainerStyle={{
              paddingVertical: heightPercentage(3),
            }}
            renderItem={({item}) => (
              <View style={styles.itemCard}>
                {item.image ? (
                  <Image source={{uri: item.image}} style={styles.itemImg} />
                ) : (
                  <View style={styles.itemImgPlaceholder}>
                    <Icon
                      name="food"
                      size={widthPercentage(7)}
                      color={COLORS.grey}
                    />
                  </View>
                )}
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <View style={styles.macroRow}>
                    {macroChips.map(chip => (
                      <View
                        key={chip.key}
                        style={[styles.chip, {backgroundColor: chip.bg}]}>
                        <Icon
                          name={chip.icon}
                          size={widthPercentage(4)}
                          color={chip.color}
                        />
                        <Text style={[styles.chipText, {color: chip.color}]}>
                          {
                            item[
                              chip.key as
                                | 'calories'
                                | 'protein'
                                | 'carbs'
                                | 'fat'
                            ]
                          }
                          {chip.key === 'calories' ? ' Kcal' : 'g'}
                        </Text>
                      </View>
                    ))}
                  </View>
                    <TouchableOpacity
                      style={styles.recipeBtn}
                      onPress={() =>
                        navigation.navigate('RecipeScreen', {
                          product: {
                            name: item.name,
                            image: item.image,
                            calories: item.calories,
                            protein: item.protein,
                            carbs: item.carbs,
                          },
                        })
                      }>
                      <Text style={styles.recipeBtnText}>Generate Recipe</Text>
                    </TouchableOpacity>
                </View>
              </View>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No items logged yet.</Text>
            }
          />
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

const styles = StyleSheet.create({
  sheetContent: {
    height: '100%',
    marginTop: widthPercentage(4),
  },
  header: {
    fontSize: heightPercentage(2.5),
    fontWeight: 'bold',
    color: COLORS.dark,
    textAlign: 'center',
    letterSpacing: 0.5,
    textTransform: 'capitalize',
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: widthPercentage(4),
    padding: widthPercentage(3),
    marginBottom: heightPercentage(2),
    width: '93%',
    alignSelf: 'center',
    shadowColor: COLORS.black,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  itemImg: {
    width: widthPercentage(14),
    height: widthPercentage(14),
    borderRadius: widthPercentage(3),
    marginRight: widthPercentage(4),
    backgroundColor: COLORS.bg,
  },
  itemImgPlaceholder: {
    width: widthPercentage(14),
    height: widthPercentage(14),
    borderRadius: widthPercentage(3),
    marginRight: widthPercentage(4),
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: heightPercentage(2),
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: heightPercentage(1),
    letterSpacing: 0.2,
  },
  macroRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: widthPercentage(2),
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: widthPercentage(2),
    paddingVertical: heightPercentage(0.5),
    paddingHorizontal: widthPercentage(2.5),
    marginRight: widthPercentage(2),
    marginBottom: heightPercentage(0.5),
  },
  chipText: {
    fontSize: heightPercentage(1.6),
    fontWeight: '500',
    marginLeft: widthPercentage(1),
  },
  emptyText: {
    color: COLORS.grey,
    textAlign: 'center',
    marginTop: heightPercentage(10),
    fontSize: heightPercentage(2.5),
  },
  sheetBgStyle: {
    borderTopLeftRadius: heightPercentage(2.5),
    borderTopRightRadius: heightPercentage(2.5),
    backgroundColor: COLORS.white,
  },
  recipeBtn: {
    marginTop: heightPercentage(1),
    backgroundColor: COLORS.primary,
    borderRadius: heightPercentage(0.8),
    paddingVertical: heightPercentage(1),
    paddingHorizontal: widthPercentage(3),
    alignSelf: 'flex-start',
  },
  recipeBtnText: {
    color: COLORS.white,
    fontSize: heightPercentage(1.7),
  },
});

export default MealItemsBottomSheet;
