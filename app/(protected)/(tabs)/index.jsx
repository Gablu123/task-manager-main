import { FlatList, Pressable, StyleSheet, View, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteTask,
  toggleTask,
  loadTasks,
} from "../../../src/features/tasks/taskSlice";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import ThemeView from "../../../components/ThemeView";
import ThemeText from "../../../components/ThemeText";
import { syncTasks } from "../../../src/utils/syncTasks";
import {
  markTaskSynced,
  removeTaskLocally,
} from "../../../src/features/tasks/taskSlice";
import NetInfo from "@react-native-community/netinfo";

import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function registerForPushNotificationsAsync(baseContent) {
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      handleRegistrationError(
        baseContent.errorStatesAndApi.permissionNotGranted,
      );
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError(baseContent.errorStatesAndApi.projectIDNotFound);
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      // console.log("From Dashboard Screen ",pushTokenString);
      return pushTokenString;
    } catch (e) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError(baseContent.errorStatesAndApi.projectIDNotFound);
  }
}

export default function Home() {
  const [isOnline, setIsOnline] = useState(true);
  const allTasks = useSelector((state) => state.tasks.tasks);

  const tasks = allTasks.filter((t) => t.syncStatus !== "deleted");

  const dispatch = useDispatch();
  const router = useRouter();
  const mode = useSelector((state) => state.theme.mode);
  const isDark = mode === "dark";

  // Request notification permissions on mount
  useEffect(() => {
    async function requestPermissions() {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") {
        await Notifications.requestPermissionsAsync();
      }
    }
    requestPermissions();
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(!!state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isOnline && allTasks.length > 0) {
      syncTasks(allTasks, dispatch, markTaskSynced, removeTaskLocally);
    }
  }, [isOnline, allTasks]);

  useEffect(() => {
    dispatch(loadTasks());
  }, []);

  // Function to trigger an immediate local notification
  const triggerLocalNotification = async () => {
    const remainingTasksCount = tasks.filter((t) => !t.completed).length;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Task Manager Reminder 📝",
        body:
          remainingTasksCount > 0
            ? `You still have ${remainingTasksCount} tasks remaining for today!`
            : "You're completely all caught up! Nice work.",
        sound: true,
      },
      trigger: null, // null triggers the notification immediately
    });
  };

  return (
    <ThemeView style={styles.container}>
      <View style={styles.header}>
        <ThemeText style={styles.greeting}>My Tasks</ThemeText>
        <ThemeText style={styles.subtitle}>
          {tasks.filter((t) => !t.completed).length} remaining today
        </ThemeText>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="checkmark-done-circle-outline"
              size={64}
              color={isDark ? "#444" : "#ccc"}
            />
            <ThemeText style={styles.emptyText}>All caught up!</ThemeText>
          </View>
        }
        renderItem={({ item }) => (
          <ThemeView
            variant="card"
            style={[styles.taskCard, item.completed && { opacity: 0.5 }]}
          >
            <Pressable
              style={styles.taskPressable}
              onPress={() => dispatch(toggleTask(item.id))}
            >
              <Ionicons
                name={item.completed ? "checkbox" : "square-outline"}
                size={22}
                color={
                  item.completed
                    ? isDark
                      ? "#4DA3FF"
                      : "#007AFF"
                    : isDark
                      ? "#aaa"
                      : "#666"
                }
                style={styles.checkbox}
              />
              <ThemeText
                style={[styles.taskText, item.completed && styles.completed]}
                numberOfLines={2}
              >
                {item.title}
              </ThemeText>
            </Pressable>

            <View style={styles.actions}>
              <Pressable
                style={styles.actionButton}
                onPress={() =>
                  router.push({
                    pathname: "/editTask",
                    params: { id: item.id, title: item.title },
                  })
                }
              >
                <Ionicons
                  name="pencil-sharp"
                  size={18}
                  color={isDark ? "#4DA3FF" : "#007AFF"}
                />
              </Pressable>

              <Pressable
                style={styles.actionButton}
                onPress={() => dispatch(deleteTask(item.id))}
              >
                <Ionicons
                  name="trash-outline"
                  size={18}
                  color={isDark ? "#FF6B6B" : "#FF3B30"}
                />
              </Pressable>
            </View>
          </ThemeView>
        )}
      />

      <Pressable
        style={[
          styles.fab,
          { backgroundColor: isDark ? "#0A84FF" : "#007AFF" },
        ]}
        onPress={() => router.push("/addTask")}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </Pressable>

      {/* Push Notification Trigger Button */}
      <ThemeView variant="card" style={styles.notificationCard}>
        <View style={styles.notificationHeader}>
          <Ionicons
            name="cloud-done-outline"
            size={16}
            color={isDark ? "#4DA3FF" : "#007AFF"}
          />
          <ThemeText style={styles.notificationInfoText}>
            Push Notifications active via Firebase FCM
          </ThemeText>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.notificationButton,
            { backgroundColor: isDark ? "#0A84FF" : "#007AFF" },
            pressed && { opacity: 0.8 },
          ]}
          onPress={triggerLocalNotification}
        >
          <Ionicons name="notifications-outline" size={18} color="#fff" />
          <ThemeText style={styles.notificationButtonText}>
            Test Device Notification
          </ThemeText>
        </Pressable>
      </ThemeView>
    </ThemeView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 4,
  },
  listContent: {
    paddingBottom: 120, // Increased to provide padding above notification button
  },
  taskCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: "rgba(150, 150, 150, 0.08)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(150, 150, 150, 0.15)",
  },
  taskPressable: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    marginRight: 12,
  },
  taskText: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
  },
  completed: {
    textDecorationLine: "line-through",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
  },
  notificationButton: {
    position: "absolute",
    bottom: 34,
    left: 20,
    right: 90, // Leaf room for the FAB on the right side
    height: 48,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  notificationButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
    top: 15,
    right: 15,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 4.54,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 80,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.5,
    fontWeight: "500",
  },

  notificationCard: {
    marginHorizontal: 4,
    marginTop: 10,
    marginBottom: 30,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "rgba(150, 150, 150, 0.06)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(150, 150, 150, 0.12)",
    gap: 12,
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  notificationInfoText: {
    fontSize: 12,
    opacity: 0.5,
    fontWeight: "500",
  },
  notificationButton: {
    height: 44,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  notificationButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
