import { StyleSheet } from "react-native";
export const taskStyle = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  header: {
    marginTop: 10,
    fontSize: 32,
    fontWeight: "bold",
    color: "#1e293b",
    // flex: 1,
  },
  card: {
    backgroundColor: "#DBE8F5",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 30,
  },
  dateBox: {
    backgroundColor: "#F9F9F9",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
  },
  dateText: {
    color: "#737171ff",
    fontWeight: "600",
  },
  inputGroup: { marginBottom: 15 },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
    color: "#334155",
  },
  input: {
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  addBtnWrapper: { marginTop: 10 },
  addBtn: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  addBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  taskTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 10,
  },
  taskGrid: { paddingBottom: 80 },
  taskCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    margin: 6,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  taskName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
  },
  taskFrequency: {
    fontSize: 12,
    color: "#64748b",
    textTransform: "capitalize",
  },
  timeBox: {
    backgroundColor: "#f1f5f9",
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: "center",
  },
  taskTime: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1e293b",
  },
  addTask: {
    position: 'absolute',
    bottom: 40,
    right: 30,
  },
  addTaskBtn: {
    backgroundColor: '#5E6CA8',
    
    // Centering the icon inside the circle
    justifyContent: 'center', 
    alignItems: 'center',
  }
});
