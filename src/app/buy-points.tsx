
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Header } from "@/components/Header";
import { useIAPHook } from "@/hooks/useIAP";
import { useTheme } from "@/theme/ThemeProvider";
import { scale, verticalScale } from "@/utils/scale";

export default function BuyPointsScreen() {
  const { colors } = useTheme();
  const { products, buy } = useIAPHook();

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <Header title="Buy Points" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: verticalScale(40) },
        ]}
      >
        <View
          style={[
            styles.card,
            { backgroundColor: colors.cardBackground, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.headerText, { color: colors.text }]}>
            Choose a Package
          </Text>
        </View>

        {products.map((product) => (
          <View
            key={product.id}
            style={[
              styles.productCard,
              { backgroundColor: colors.cardBackground, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.productTitle, { color: colors.text }]}>
              {product.title}
            </Text>

            <Text style={[styles.productDescription, { color: colors.textSecondary }]}>
              {product.description}
            </Text>

            <Text
              style={[
                styles.productPrice,
                { color: colors.primary },
              ]}
            >
              {product.displayPrice}
            </Text>

            <TouchableOpacity
              onPress={() => buy(product.id)}
              style={[styles.buyButton, { backgroundColor: colors.primary }]}
            >
              <Text style={[styles.buyButtonText, { color: colors.background }]}>
                Buy Now
              </Text>
            </TouchableOpacity>
          </View>
        ))}

        {products.length === 0 && (
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No products available...
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    padding: scale(16),
  },

  contentContainer: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(12),
    gap: verticalScale(12),
  },

  card: {
    borderRadius: scale(16),
    padding: scale(16),
    borderWidth: StyleSheet.hairlineWidth,
  },

  headerText: {
    fontSize: scale(15),
    fontWeight: "700",
  },

  productCard: {
    borderRadius: scale(16),
    padding: scale(16),
    borderWidth: StyleSheet.hairlineWidth,
  },

  productTitle: {
    fontSize: scale(16),
    fontWeight: "700",
  },

  productDescription: {
    fontSize: scale(13),
    marginVertical: verticalScale(6),
    lineHeight: 20,
  },

  productPrice: {
    fontSize: scale(18),
    fontWeight: "800",
    marginBottom: verticalScale(12),
  },

  buyButton: {
    paddingVertical: verticalScale(10),
    borderRadius: scale(10),
  },

  buyButtonText: {
    fontSize: scale(14),
    fontWeight: "700",
    textAlign: "center",
  },

  emptyText: {
    textAlign: "center",
    marginTop: verticalScale(50),
  },
});