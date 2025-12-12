import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

import { BannerAdComponent } from "@/components/BannerAdComponent";
import { CustomModal } from "@/components/CustomModal";
import { Header } from "@/components/Header";
import { useRewardReset } from "@/hooks/useRewardReset";

const CHECKIN_STORAGE_KEY = "daily_checkin_state_v1";

type CheckinState = {
  lastCheckinDate: string | null; // "YYYY-MM-DD"
  streak: number; // 0–7
};

type DayConfig = {
  day: number;
  reward: number;
  claimed: boolean;
  isToday: boolean;
  locked: boolean;
};

function getTodayString() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// Difference in full days between today and lastDateStr
function getDiffDays(lastDateStr: string | null): number | null {
  if (!lastDateStr) return null;
  const today = new Date(getTodayString());
  const last = new Date(lastDateStr);
  const diffMs = today.getTime() - last.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

export default function DailyCheckInScreen() {
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState<CheckinState>({
    lastCheckinDate: null,
    streak: 0,
  });
  const [days, setDays] = useState<DayConfig[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] =
    useState<"success" | "error" | "info">("info");
  const [isProcessing, setIsProcessing] = useState(false);

  const { handleRewardReset } = useRewardReset();

  // Define rewards for each day (you can change these)
  const rewardsPerDay = [5, 10, 15, 20, 30, 40, 50];

  const showModal = useCallback(
    (message: string, type: "success" | "error" | "info" = "info") => {
      setModalMessage(message);
      setModalType(type);
      setModalVisible(true);
    },
    []
  );

  const buildDays = useCallback(
    (s: CheckinState) => {
      const diff = getDiffDays(s.lastCheckinDate);
      let streak = s.streak;
      let alreadyClaimedToday = false;

      if (s.lastCheckinDate === getTodayString()) {
        // Claimed today
        alreadyClaimedToday = true;
      } else if (diff === null) {
        // never checked in
        streak = 0;
      } else if (diff === 1) {
        // last claim was yesterday -> streak continues
        alreadyClaimedToday = false;
      } else if (diff > 1) {
        // missed days -> reset streak
        streak = 0;
        alreadyClaimedToday = false;
      }

      // If streak exceeded 7, reset for new cycle
      if (streak > 7) streak = 0;

      // Determine today's index in 1–7 range
      let todayIndex: number | null = null;

      if (alreadyClaimedToday) {
        // No available claim today, user must come back tomorrow
        todayIndex = null;
      } else {
        if (streak === 0) {
          todayIndex = 1;
        } else if (streak < 7) {
          todayIndex = streak + 1;
        } else {
          todayIndex = null; // completed cycle
        }
      }

      const claimedUpTo = alreadyClaimedToday ? streak : streak;

      const newDays: DayConfig[] = rewardsPerDay.map((reward, index) => {
        const dayNumber = index + 1;
        const claimed = dayNumber <= claimedUpTo;
        const isToday = todayIndex === dayNumber;
        const locked = !claimed && !isToday;
        return {
          day: dayNumber,
          reward,
          claimed,
          isToday: !!isToday,
          locked,
        };
      });

      setDays(newDays);
    },
    [rewardsPerDay]
  );

  // Load initial state
  useEffect(() => {
    const loadState = async () => {
      try {
        const raw = await AsyncStorage.getItem(CHECKIN_STORAGE_KEY);
        if (raw) {
          let parsed = null;
          try {
            parsed = JSON.parse(raw);
          } catch (e) {
            parsed = null;
          }

          // If parsed is null, not an object, or missing fields → reset to initial
          if (
            !parsed ||
            typeof parsed !== "object" ||
            !("lastCheckinDate" in parsed) ||
            !("streak" in parsed)
          ) {
            const initial: CheckinState = {
              lastCheckinDate: null,
              streak: 0,
            };
            await AsyncStorage.setItem(CHECKIN_STORAGE_KEY, JSON.stringify(initial));
            setState(initial);
            buildDays(initial);
          } else {
            setState(parsed);
            buildDays(parsed);
          }
        } else {
          const initial: CheckinState = {
            lastCheckinDate: null,
            streak: 0,
          };
          await AsyncStorage.setItem(CHECKIN_STORAGE_KEY, JSON.stringify(initial));
          setState(initial);
          buildDays(initial);
        }
      } catch (e) {
        console.log("Error loading check-in state", e);
      } finally {
        setLoading(false);
      }
    };

    loadState();
  }, [buildDays]);

  const saveState = async (newState: CheckinState) => {
    setState(newState);
    await AsyncStorage.setItem(CHECKIN_STORAGE_KEY, JSON.stringify(newState));
    buildDays(newState);
  };

  const handleDayPress = async (day: DayConfig) => {
    if (isProcessing) return;
    if (loading) return;

    if (day.claimed) {
      showModal("You already claimed this day.", "info");
      return;
    }

    if (!day.isToday) {
      showModal("This day is locked. Please follow the order.", "info");
      return;
    }

    setIsProcessing(true);

    try {
      // Check ad cooldown
      // const remainingMs = await getRewardedRemainingMs();
      // if (remainingMs > 0) {
      //   const seconds = Math.ceil(remainingMs / 1000);
      //   showModal(`Please wait ${seconds}s before next check-in.`, "info");
      //   setIsProcessing(false);
      //   return;
      // }

      // Show rewarded ad
      const res1 = await handleRewardReset();


      // Here you can also call backend to add points
      // await awardDailyCheckinPoints(day.reward);

      // Update streak + lastCheckinDate
      const today = getTodayString();
      const diff = getDiffDays(state.lastCheckinDate);
      let newStreak = state.streak;

      if (!state.lastCheckinDate || diff === null || diff > 1) {
        newStreak = 1;
      } else if (diff === 1) {
        newStreak = state.streak + 1;
      } else if (diff === 0) {
        // already claimed today, but we guard earlier
        newStreak = state.streak;
      }

      if (newStreak > 7) newStreak = 1; // loop cycle

      await saveState({
        lastCheckinDate: today,
        streak: newStreak,
      });

      showModal(`You received ${day.reward} points!`, "success");
    } catch (e) {
      console.log("Error in daily check-in:", e);
      showModal("Something went wrong. Please try again.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <LinearGradient
        colors={["#ca8080ff", "#E53935"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#fff" />
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // console.log(days)

  return (
    <LinearGradient
     colors={["#ca8080ff", "#E53935"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1, padding: scale(16) }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <Header title="Daily Check-In" />

        <View style={styles.infoContainer}>
          <Text style={styles.title}>7-Day Reward Streak</Text>
          <Text style={styles.subtitle}>
            Check in every day to build your streak and earn more points.
          </Text>
        </View>

        <View style={styles.daysRow}>
          {days.map((day) => {
            const bgColor = day.claimed
              ? "#E53935"        // strong red for claimed
              : day.isToday
              ? "#FFEB3B"        // bright yellow highlight
              : "#EF9A9A";       // soft red for locked
            const borderColor = day.isToday ? "#FFEE58" : "transparent";
            const opacity = day.locked ? 0.5 : 1;

            return (
              <Pressable
                key={day.day}
                onPress={() => handleDayPress(day)}
                disabled={isProcessing || day.locked}
                style={[
                  styles.dayItem,
                  {
                    backgroundColor: bgColor,
                    borderColor,
                    opacity,
                  },
                ]}
              >
                <Text style={styles.dayLabel}>Day {day.day}</Text>
                <Text style={styles.rewardLabel}>+10</Text>
                {day.claimed && <Text style={styles.claimedText}>Claimed</Text>}
                {day.isToday && !day.claimed && (
                  <Text style={styles.todayText}>Today</Text>
                )}
              </Pressable>
            );
          })}
        </View>

        {isProcessing && (
          <Text style={styles.processingText}>Processing...</Text>
        )}

        <View style={{ flex: 1 }} />

        <BannerAdComponent />

        <CustomModal
          visible={modalVisible}
          message={modalMessage}
          type={modalType}
          onClose={() => setModalVisible(false)}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  infoContainer: {
    marginTop: verticalScale(24),
    marginBottom: verticalScale(16),
    paddingHorizontal: scale(8) 
  },
  title: {
    fontSize: moderateScale(20),
    color: "#fff",
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: moderateScale(13),
    color: "#E5E7EB",
  },
  daysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: verticalScale(16),
  },
  dayItem: {
    flex: 1,
    marginHorizontal: 2,
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(6),
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
  },
  dayLabel: {
    fontSize: moderateScale(11),
    color: "#0F172A",
    fontWeight: "600",
  },
  rewardLabel: {
    fontSize: moderateScale(12),
    color: "#0F172A",
    fontWeight: "700",
    marginTop: 4,
  },
  claimedText: {
    marginTop: 4,
    fontSize: moderateScale(6),
    color: "#DCFCE7",
    fontWeight: "600",
  },
  todayText: {
    marginTop: 4,
    fontSize: moderateScale(10),
    color: "#78350F",
    fontWeight: "700",
  },
  processingText: {
    marginTop: verticalScale(10),
    textAlign: "center",
    color: "#E5E7EB",
    fontSize: moderateScale(12),
  },
});