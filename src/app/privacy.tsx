import { Header } from "@/components/Header";
import { useTheme } from "@/theme/ThemeProvider";
import { scale, verticalScale } from "@/utils/scale";
import React from "react";
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const infoRows = [
  { label: "Effective Date", value: "January 1, 2025" },
  { label: "App Name", value: "Lotaya Dinga" },
  { label: "Company", value: "Mandalay Ads, LLC" },
  { label: "Address", value: "9450 SW GEMINI DR PMB 7580, Beaverton, OR, USA 97008" },
  { label: "Phone", value: "+1 503 505 9659" },
  { label: "Email", value: "info@mandalayads.io", isLink: true },
  { label: "Website", value: "https://www.mandalayads.io", isLink: true },
];

type SectionContent = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

const sections: SectionContent[] = [
  {
    title: "1. Information We Collect",
    paragraphs: [
      "When you create an account in the Lotaya Dinga App, we collect the following information:",
    ],
    bullets: ["Full Name", "Email Address", "Password"],
  },
  {
    title: "",
    paragraphs: [
      "Your password is securely encrypted and is not visible to us.",
      "We do not collect sensitive data such as national ID, phone number, payment card details, or address.",
    ],
  },
  {
    title: "2. How We Use Your Information",
    paragraphs: ["Your information is used for:"],
    bullets: [
      "Creating and managing your account",
      "Providing access to app features",
      "Account security and authentication",
      "Improving the user experience",
    ],
  },
  {
    title: "",
    paragraphs: [
      "We do not sell, rent, or trade your personal information to any third parties.",
    ],
  },
  {
    title: "3. Points Usage",
    paragraphs: [
      "Users can collect points inside the app by interacting with content such as reading monetization news.",
      "Points can be used only within the Lotaya Dinga App to unlock VIP learning content such as Google AdX Monetization Classes.",
      "Points cannot be withdrawn, transferred, exchanged for money, or converted into any external value.",
      "Points cannot be purchased or added externally.",
    ],
  },
  {
    title: "4. Data Security",
    paragraphs: [
      "We use industry-standard encryption and server protection to safeguard your data.",
      "However, no internet system is 100% secure; users are responsible for using strong passwords and protecting login access.",
    ],
  },
  {
    title: "5. Third Party Services",
    paragraphs: [
      "The app may contain links to external websites for educational purposes. We are not responsible for the content or privacy practices of those sites.",
    ],
  },
  {
    title: "6. Changes to This Policy",
    paragraphs: [
      "We may update this Privacy Policy occasionally. The latest version will always be posted inside the app and on our website.",
    ],
  },
  {
    title: "7. Contact Us",
    paragraphs: [
      "If you have any questions about this Privacy Policy:",
      "Email: info@mandalayads.io",
    ],
  },
];

export default function PrivacyPolicyScreen() {
  const { colors } = useTheme();

  const handleLinkPress = (value: string) => {
    if (value.startsWith("http")) {
      Linking.openURL(value).catch(() => null);
    } else if (value.includes("@")) {
      Linking.openURL(`mailto:${value}`).catch(() => null);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <Header title="Privacy Policy" />
      <ScrollView
        contentContainerStyle={[styles.contentContainer, { paddingBottom: verticalScale(40) }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          {infoRows.map((row) => (
            <View key={row.label} style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{row.label}</Text>
              <Text
                style={[
                  styles.infoValue,
                  { color: row.isLink ? colors.primary : colors.text },
                ]}
                onPress={() => row.isLink && handleLinkPress(row.value)}
              >
                {row.value}
              </Text>
            </View>
          ))}
        </View>

        {sections.map((section, index) => (
          <View
            key={`${section.title}-${index}`}
            style={[
              styles.section,
              { backgroundColor: colors.cardBackground, borderColor: colors.border },
            ]}
          >
            {section.title ? (
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {section.title}
              </Text>
            ) : null}
            {section.paragraphs.map((paragraph, idx) => (
              <Text
                key={idx}
                style={[styles.paragraph, { color: colors.textSecondary }]}
              >
                {paragraph}
              </Text>
            ))}
            {section.bullets && (
              <View style={styles.bulletContainer}>
                {section.bullets.map((bullet) => (
                  <View key={bullet} style={styles.bulletRow}>
                    <View style={[styles.bulletDot, { backgroundColor: colors.primary }]} />
                    <Text style={[styles.bulletText, { color: colors.textSecondary }]}>
                      {bullet}
                    </Text>
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
  card: {
    borderRadius: scale(16),
    padding: scale(16),
    borderWidth: StyleSheet.hairlineWidth,
  },
  infoRow: {
    marginBottom: verticalScale(8),
  },
  infoLabel: {
    fontSize: scale(11),
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  infoValue: {
    fontSize: scale(14),
    fontWeight: "600",
    marginTop: verticalScale(4),
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
