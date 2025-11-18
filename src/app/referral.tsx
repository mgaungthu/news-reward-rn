import { Header } from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/theme/ThemeProvider";
import { scale, verticalScale } from "@/utils/scale";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ReferralScreen() {
  const { colors } = useTheme();
  const {user} = useAuth();

  const referralLink = `https://lotaya.mandalayads.io/register?ref=${user?.referral_code}`;

  const handleCopy = async () => {
    await Clipboard.setStringAsync(referralLink);
    alert("Referral link copied!");
  };

  const referralSections = [
    {
      title: "How Referral Works",
      paragraphs: [
        "Invite your friends to join Lotaya Dinga using your unique referral link.",
        "When someone signs up using your link, both you and your friend may receive special rewards or points.",
      ],
    },
    {
      title: "Referral Benefits",
      bullets: [
        "Earn additional reading points",
        "Unlock exclusive learning content",
        "Boost your VIP accessibility",
        "Grow your learning network",
      ],
    },
    {
      title: "Rules",
      bullets: [
        "Referral link must be used during registration",
        "Self-referral or duplicate accounts are not allowed",
        "Fraudulent usage may result in suspension",
      ],
    },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <Header title="Referral Program" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: verticalScale(40) }]}
      >
        {/* Referral Link Card */}
        <View
          style={[
            styles.card,
            { backgroundColor: colors.cardBackground, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.referralTitle, { color: colors.text }]}>
            Your Referral Link
          </Text>

          <TouchableOpacity
            onPress={handleCopy}
            style={[
              styles.linkContainer,
              { borderColor: colors.primary },
            ]}
          >
            <Text style={[styles.referralLink, { color: colors.text }]}>
              {referralLink}
            </Text>
            <Ionicons name="copy-outline" size={20} color={colors.primary} />
          </TouchableOpacity>

          <Text style={[styles.smallNote, { color: colors.textSecondary }]}>
            Tap to copy your referral link.
          </Text>
        </View>

        {/* Sections */}
        {referralSections.map((section, index) => (
          <View
            key={index}
            style={[
              styles.section,
              { backgroundColor: colors.cardBackground, borderColor: colors.border },
            ]}
          >
            {section.title && (
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {section.title}
              </Text>
            )}

            {section.paragraphs &&
              section.paragraphs.map((p, idx) => (
                <Text
                  key={idx}
                  style={[styles.paragraph, { color: colors.textSecondary }]}
                >
                  {p}
                </Text>
              ))}

            {section.bullets && (
              <View style={styles.bulletContainer}>
                {section.bullets.map((bullet, idx) => (
                  <View key={idx} style={styles.bulletRow}>
                    <View
                      style={[
                        styles.bulletDot,
                        { backgroundColor: colors.primary },
                      ]}
                    />
                    <Text
                      style={[styles.bulletText, { color: colors.textSecondary }]}
                    >
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
    padding: scale(16),
  },
  contentContainer: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(12),
    gap: verticalScale(12),
  },

  /* Card */
  card: {
    borderRadius: scale(16),
    padding: scale(16),
    borderWidth: StyleSheet.hairlineWidth,
  },

  referralTitle: {
    fontSize: scale(15),
    fontWeight: "700",
    marginBottom: verticalScale(10),
  },

  linkContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: StyleSheet.hairlineWidth,
    padding: scale(12),
    borderRadius: scale(10),
  },

  referralLink: {
    flex: 1,
    fontSize: scale(13),
    marginRight: scale(10),
  },

  smallNote: {
    marginTop: verticalScale(6),
    fontSize: scale(11),
  },

  /* Sections */
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