import {
  Pressable,
  StyleSheet,
  TextInput,
  Alert,
  View,
  useColorScheme,
  ActivityIndicator
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../../src/features/auth/authSlice";
import { Ionicons } from "@expo/vector-icons"; 

import ThemeText from "../../components/ThemeText";
import ThemeView from "../../components/ThemeView";

const Signup = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.theme.mode);
  const isDark = mode === "dark";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [activeInput, setActiveInput] = useState(null); 
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);

  const handleSignup = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    setLoading(true);
    const res = await dispatch(signupUser({ email, password }));
    setLoading(false);

    if (res.meta.requestStatus === "fulfilled") {
      Alert.alert("Success", "Account created successfully");
      router.replace("/(auth)/signin");
    } else {
      Alert.alert("Error", res.payload || "Signup failed");
    }
  };

  const getInputStyles = (inputName) => [
    styles.inputContainer,
    {
      borderColor: activeInput === inputName 
        ? (isDark ? "#0A84FF" : "#007AFF") 
        : (isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"),
      backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)",
    }
  ];

  return (
    <ThemeView style={styles.container}>
      <View style={styles.navHeader}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={isDark ? "#fff" : "#000"} />
        </Pressable>
      </View>

      <View style={styles.content}>
        <View style={styles.welcomeSection}>
          <ThemeText style={styles.title}>Get Started</ThemeText>
          <ThemeText style={styles.subtitle}>Create an account to start managing tasks</ThemeText>
        </View>

        <View style={styles.form}>
          <ThemeText style={styles.inputLabel}>Email Address</ThemeText>
          <View style={getInputStyles("email")}>
            <Ionicons name="mail-outline" size={20} color={isDark ? "#666" : "#aaa"} style={styles.inputIcon} />
            <TextInput
              placeholder="name@domain.com"
              placeholderTextColor={isDark ? "#666" : "#aaa"}
              style={[styles.input, { color: isDark ? "#fff" : "#000" }]}
              value={email}
              onChangeText={setEmail}
              onFocus={() => setActiveInput("email")}
              onBlur={() => setActiveInput(null)}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <ThemeText style={styles.inputLabel}>Choose Password</ThemeText>
          <View style={getInputStyles("password")}>
            <Ionicons name="lock-closed-outline" size={20} color={isDark ? "#666" : "#aaa"} style={styles.inputIcon} />
            <TextInput
              placeholder="Minimum 6 characters"
              placeholderTextColor={isDark ? "#666" : "#aaa"}
              style={[styles.input, { color: isDark ? "#fff" : "#000" }]}
              value={password}
              onChangeText={setPassword}
              onFocus={() => setActiveInput("password")}
              onBlur={() => setActiveInput(null)}
              secureTextEntry={isPasswordHidden}
              autoCapitalize="none"
            />
            <Pressable 
              onPress={() => setIsPasswordHidden(!isPasswordHidden)}
              style={styles.eyeButton}
            >
              <Ionicons 
                name={isPasswordHidden ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color={isDark ? "#666" : "#888"} 
              />
            </Pressable>
          </View>
        </View>

        <View style={styles.actionSection}>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              { 
                backgroundColor: isDark ? "#0A84FF" : "#007AFF",
                opacity: loading || pressed ? 0.85 : 1 
              },
            ]}
            disabled={loading}
            onPress={handleSignup}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <ThemeText style={styles.buttonText}>Register Account</ThemeText>
            )}
          </Pressable>

          <Pressable 
            style={({ pressed }) => [styles.linkButton, { opacity: pressed ? 0.6 : 1 }]}
            onPress={() => router.push("/signin")}
          >
            <ThemeText style={[styles.linkText, { color: isDark ? "#4DA3FF" : "#007AFF" }]}>
              Already have an account? <ThemeText style={styles.boldLink}>Sign In</ThemeText>
            </ThemeText>
          </Pressable>
        </View>
      </View>
    </ThemeView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  navHeader: {
    marginTop: 20,
    height: 48,
    justifyContent: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    marginLeft: -8,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
  },
  welcomeSection: {
    marginTop: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -1,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.5,
    fontWeight: "500",
  },
  form: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: 40,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    opacity: 0.6,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    fontWeight: "500",
  },
  eyeButton: {
    padding: 4,
    marginLeft: 8,
  },
  actionSection: {
    gap: 12,
    marginBottom: 40,
  },
  button: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
    height: 54,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#fff",
  },
  linkButton: {
    paddingVertical: 12,
    alignItems: "center",
  },
  linkText: {
    fontSize: 15,
    fontWeight: "500",
  },
  boldLink: {
    fontWeight: "700",
  },
});