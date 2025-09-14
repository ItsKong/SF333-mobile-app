import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import GiverHome from "./giverhome";
import AddTask from "./add-task";
import Dashboard from "./dashboard";

type ViewType = "homepage" | "add-task" | "dashboard";

export default function Index() {
  const [currentView, setCurrentView] = useState<ViewType>("homepage");

  const renderView = () => {
    switch (currentView) {
      case "homepage":
        return <GiverHome />;
      case "add-task":
        return <AddTask />;
      case "dashboard":
        return <Dashboard />;
      default:
        return <GiverHome />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Navigation Bar */}
      <View style={styles.navbar}>
        <Pressable
          style={[styles.navBtn, currentView === "homepage" && styles.activeBtn]}
          onPress={() => setCurrentView("homepage")}
        >
          <Text style={styles.navText}>Home</Text>
        </Pressable>
        <Pressable
          style={[styles.navBtn, currentView === "add-task" && styles.activeBtn]}
          onPress={() => setCurrentView("add-task")}
        >
          <Text style={styles.navText}>Add Task</Text>
        </Pressable>
        <Pressable
          style={[styles.navBtn, currentView === "dashboard" && styles.activeBtn]}
          onPress={() => setCurrentView("dashboard")}
        >
          <Text style={styles.navText}>Dashboard</Text>
        </Pressable>
      </View>

      {/* Main Content */}
      <View style={styles.content}>{renderView()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  navBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  activeBtn: {
    backgroundColor: "#dbeafe",
  },
  navText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
  },
  content: { flex: 1 },
});
