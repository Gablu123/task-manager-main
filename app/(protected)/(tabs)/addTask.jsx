import { TextInput, Pressable, StyleSheet, View } from "react-native";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTask } from "../../../src/features/tasks/taskSlice";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; 

import ThemeText from "../../../components/ThemeText";
import ThemeView from "../../../components/ThemeView";

export default function AddTask() {
  const [title, setTitle] = useState("");
  const [isFocused, setIsFocused] = useState(false); 
  const dispatch = useDispatch();
  const router = useRouter();

  const mode = useSelector((state) => state.theme.mode);
  const isDark = mode === "dark";
  const isValid = title.trim().length > 0; 

  const handleAdd = () => {
    if (!isValid) return;

    dispatch(
      addTask({
        id: Date.now().toString(),
        title: title.trim(),
        completed: false,
        syncStatus: "pending",
      })
    );

    setTitle("")
    router.back();
  };

  return (
    <ThemeView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color={isDark ? "#fff" : "#000"} 
          />
        </Pressable>
        <ThemeText style={styles.headerTitle}>New Task</ThemeText>
      </View>

      <View style={styles.formGroup}>
        <ThemeText style={styles.label}>What are you planning?</ThemeText>
        
        <TextInput
          placeholder="e.g., Buy groceries, Finish design layout..."
          placeholderTextColor={isDark ? "#666" : "#aaa"}
          style={[
            styles.input,
            {
              borderColor: isFocused 
                ? (isDark ? "#0A84FF" : "#007AFF") 
                : (isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"),
              backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)",
              color: isDark ? "#fff" : "#000",
            },
          ]}
          value={title}
          onChangeText={setTitle}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          maxLength={80} 
          autoFocus={true} 
        />

        <View style={styles.metaRow}>
          <ThemeText style={styles.characterCount}>
            {title.length}/80 characters
          </ThemeText>
        </View>
      </View>

      <Pressable
        disabled={!isValid}
        style={[
          styles.button,
          { 
            backgroundColor: isDark ? "#0A84FF" : "#007AFF",
            opacity: isValid ? 1 : 0.4 
          },
        ]}
        onPress={handleAdd}
      >
        <Ionicons name="sparkles" size={18} color="#fff" style={styles.btnIcon} />
        <ThemeText style={styles.buttonText}>Create Task</ThemeText>
      </Pressable>
    </ThemeView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  backButton: {
    padding: 4,
    marginRight: 12,
    marginLeft: -4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    opacity: 0.6,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1.5,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    fontSize: 16,
    fontWeight: "500",
  },
  metaRow: {
    alignItems: "flex-end",
    marginTop: 6,
  },
  characterCount: {
    fontSize: 12,
    opacity: 0.4,
  },
  button: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
  },
  btnIcon: {
    marginRight: 6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});