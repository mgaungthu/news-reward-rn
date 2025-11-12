import { Header } from "@/components/Header";
import { useTheme } from "@/theme/ThemeProvider";
import { scale, verticalScale } from "@/utils/scale";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const sections = [
  {
    title: "Effective Date",
    content: ["January 1, 2025"],
  },
  {
    title: "1. Acceptance of Terms",
    content: [
      "By creating an account or using the Lotaya Dinga App, you agree to comply with these Terms of Use. If you do not agree, please stop using the app.",
    ],
  },
  {
    title: "2. Account Responsibility",
    content: [
      "You are responsible for maintaining the confidentiality of your account and password.",
      "Any activity under your account is considered your responsibility.",
    ],
  },
  {
    title: "3. Points System",
    bullets: [
      "Points are earned by interacting with the app content.",
      "Points can only be used to unlock in-app VIP educational content.",
      "Points have no monetary value and cannot be withdrawn, traded, or sold.",
      "Points cannot be topped up or purchased externally.",
    ],
  },
  {
    title: "4. Prohibited Activities",
    bullets: [
      "Attempt to hack, modify, or manipulate the points system",
      "Sell or share your account",
      "Upload harmful, illegal, or abusive content",
      "Misuse the app in any way that harms the company or users",
    ],
    content: ["Violation may result in account suspension without refund."],
  },
  {
    title: "5. Content Ownership",
    content: [
      "All content in the app (including lessons, articles, videos, and graphics) is owned by Mandalay Ads, LLC.",
      "You may not copy, resell, or distribute content without permission.",
    ],
  },
  {
    title: "6. Termination",
    content: [
      "We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent activities.",
    ],
  },
  {
    title: "7. Disclaimer",
    content: [
      "The app provides educational content. Results from implementing the knowledge may vary.",
      "We do not guarantee earnings, business success, or monetization approval.",
    ],
  },
  {
    title: "8. Governing Law",
    content: ["These Terms are governed by the laws of the United States."],
  },
  {
    title: "9. Contact",
    content: ["For support or legal inquiries:", "Email: info@mandalayads.io"],
  },
];

export default function TermsOfUseScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}> 
      <Header title="Terms of Use" />
      <ScrollView
        contentContainerStyle={[styles.contentContainer, { paddingBottom: verticalScale(40) }]}
        showsVerticalScrollIndicator={false}
      >
        {sections.map((section) => (
          <View
            key={section.title}
            style={[styles.section, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
          >
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{section.title}</Text>
            {section.content?.map((paragraph, idx) => (
              <Text key={`${section.title}-p-${idx}`} style={[styles.paragraph, { color: colors.textSecondary }]}>
                {paragraph}
              </Text>
            ))}
            {section.bullets && (
              <View style={styles.bulletContainer}>
                {section.bullets.map((bullet) => (
                  <View key={bullet} style={styles.bulletRow}>
                    <View style={[styles.bulletDot, { backgroundColor: colors.primary }]} />
                    <Text style={[styles.bulletText, { color: colors.textSecondary }]}>{bullet}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    padding:scale(16)
  },
  contentContainer: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(12),
    gap: verticalScale(12),
  },
  section: {
    borderRadius: scale(16),
    padding: scale(16),
    borderWidth: StyleSheet.hairlineWidth,
  },
  sectionTitle: {
    fontSize: scale(15),
    fontWeight: "700",
    marginBottom: verticalScale(8),
  },
  paragraph: {
    fontSize: scale(13),
    lineHeight: 20,
    marginBottom: verticalScale(6),
  },
  bulletContainer: {
    marginTop: verticalScale(6),
    gap: verticalScale(4),
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: scale(8),
  },
  bulletDot: {
    width: scale(6),
    height: scale(6),
    borderRadius: scale(3),
    marginTop: verticalScale(6),
  },
  bulletText: {
    flex: 1,
    fontSize: scale(13),
    lineHeight: 20,
  },
});

