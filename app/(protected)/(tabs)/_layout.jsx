import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../components/Header.jsx";
import { useSelector } from "react-redux";

export default function TabLayout() {
  
  const mode = useSelector((state) => state.theme.mode);
  const isDark = mode === "dark";

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["left", "right"]}>
      <Header />

      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false,
          lazy: true,
          tabBarStyle: {
            height: 110,
            paddingTop: 6,

            backgroundColor: isDark ? "#1c1c1e" : "#fff",

            borderTopWidth: 1,
            borderTopColor: isDark ? "#2c2c2e" : "#e5e5e5",
          },

          tabBarLabelStyle: {
            fontSize: 12,
            marginTop: -2,
          },

          tabBarActiveTintColor: isDark ? "#4DA3FF" : "#007AFF",
          tabBarInactiveTintColor: isDark ? "#888" : "gray",

          tabBarIcon: ({ color, size, focused }) => {
            let iconName;

            if (route.name === "index") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "addTask") {
              iconName = focused
                ? "add-circle"
                : "add-circle-outline";
            } else if (route.name === "editTask") {
              iconName = focused ? "create" : "create-outline";
            } else if (route.name === "profile") {
              iconName = focused ? "person" : "person-outline";
            }

            return <Ionicons name={iconName} size={22} color={color} />;
          },
        })}
      >
        <Tabs.Screen name="index" options={{ title: "Home" }} />

        <Tabs.Screen name="addTask" options={{ title: "Add Task" }} />

        <Tabs.Screen name="editTask" options={{ title: "Edit Task" }} />

        <Tabs.Screen name="profile" options={{ title: "Profile" }} />
      </Tabs>
    </SafeAreaView>
  );
}