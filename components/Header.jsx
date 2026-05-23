import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import ThemeView from "./ThemeView";
import ThemeText from "./ThemeText";

const Header = () => {
  const user = useSelector((state) => state.auth.user);
  const mode = useSelector((state) => state.theme.mode);
  const isDark = mode === "dark";

  const userInitials = user?.email ? user.email.charAt(0).toUpperCase() : "G";

  return (
    <ThemeView
      variant="card"
      style={[
        styles.container,
        {
          borderBottomColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)",
          backgroundColor: isDark ? "#121212" : "#FFFFFF"
        },
      ]}
    >
      <View style={styles.textGroup}>
        <ThemeText style={styles.title}>Task Manager</ThemeText>
        <ThemeText style={styles.email} numberOfLines={1}>
          {user?.email || "Signed in as Guest"}
        </ThemeText>
      </View>

      <View 
        style={[
          styles.miniAvatar, 
          { backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)" }
        ]}
      >
        <ThemeText style={styles.miniAvatarText}>{userInitials}</ThemeText>
      </View>
    </ThemeView>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row", 
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 55, 
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  textGroup: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  email: {
    fontSize: 13,
    opacity: 0.5,
    marginTop: 2,
    fontWeight: "500",
  },
  miniAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(150, 150, 150, 0.15)",
  },
  miniAvatarText: {
    fontSize: 14,
    fontWeight: "600",
  },
});