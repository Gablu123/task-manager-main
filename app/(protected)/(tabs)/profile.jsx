import { StyleSheet, Pressable, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { logoutUser } from "../../../src/features/auth/authSlice";
import { Ionicons } from "@expo/vector-icons"; 

import ThemeView from "../../../components/ThemeView";
import ThemeText from "../../../components/ThemeText";
import { toggleTheme } from "../../../src/features/theme/themeSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const user = useSelector((state) => state.auth.user);

  const mode = useSelector((state) => state.theme.mode);
  const isDark = mode === "dark";

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.replace("/signin");
  };

  const userInitials = user?.email ? user.email.charAt(0).toUpperCase() : "?";

  return (
    <ThemeView style={styles.container}>
      <View style={styles.avatarSection}>
        <View
          style={[
            styles.avatarCircle,
            {
              backgroundColor: isDark
                ? "rgba(255,255,255,0.08)"
                : "rgba(0,0,0,0.04)",
            },
          ]}
        >
          <ThemeText style={styles.avatarText}>{userInitials}</ThemeText>
        </View>
        <ThemeText style={styles.userEmailText}>
          {user?.email || "No Email Address"}
        </ThemeText>
      </View>

      <ThemeView variant="card" style={styles.card}>
        <ThemeText style={styles.sectionTitle}>Account</ThemeText>

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons
              name="mail-outline"
              size={20}
              color={isDark ? "#aaa" : "#555"}
              style={styles.iconGap}
            />
            <ThemeText style={styles.rowText}>Email Status</ThemeText>
          </View>
          <ThemeText style={styles.rowValue}>Verified</ThemeText>
        </View>
      </ThemeView>

      <ThemeView variant="card" style={styles.card}>
        <ThemeText style={styles.sectionTitle}>Preferences</ThemeText>

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons
              name={isDark ? "moon-outline" : "sunny-outline"}
              size={20}
              color={isDark ? "#aaa" : "#555"}
              style={styles.iconGap}
            />
            <ThemeText style={styles.rowText}>Theme</ThemeText>
          </View>

          <Pressable onPress={() => dispatch(toggleTheme())}>
            <ThemeText
              style={[
                styles.rowValue,
                { color: isDark ? "#4DA3FF" : "#007AFF" },
              ]}
            >
              {isDark ? "Switch to Light" : "Switch to Dark"}
            </ThemeText>
          </Pressable>
        </View>
      </ThemeView>

      <Pressable
        style={({ pressed }) => [
          styles.logoutBtn,
          {
            backgroundColor: isDark
              ? "rgba(255, 69, 58, 0.1)"
              : "rgba(255, 59, 48, 0.08)",
            borderColor: isDark
              ? "rgba(255, 69, 58, 0.2)"
              : "rgba(255, 59, 48, 0.15)",
            opacity: pressed ? 0.7 : 1,
          },
        ]}
        onPress={handleLogout}
      >
        <Ionicons
          name="log-out-outline"
          size={18}
          color={isDark ? "#FF453A" : "#FF3B30"}
        />
        <ThemeText
          style={[styles.logoutText, { color: isDark ? "#FF453A" : "#FF3B30" }]}
        >
          Sign Out of Account
        </ThemeText>
      </Pressable>
    </ThemeView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  avatarSection: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
    gap: 12,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(150, 150, 150, 0.15)",
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "700",
  },
  userEmailText: {
    fontSize: 16,
    fontWeight: "600",
    opacity: 0.8,
  },
  card: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: "rgba(150, 150, 150, 0.08)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(150, 150, 150, 0.15)",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    opacity: 0.4,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 14,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconGap: {
    marginRight: 10,
  },
  rowText: {
    fontSize: 16,
    fontWeight: "500",
  },
  rowValue: {
    fontSize: 15,
    opacity: 0.5,
  },
  logoutBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: "auto",
    marginBottom: 30,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
