import * as Notifications from "expo-notifications";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Configuração global das notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function Index() {
  const daysOfWeek = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ];

  const today = daysOfWeek[new Date().getDay()];

  const [agenda, setAgenda] = useState([
    { id: "1", time: "08:00", task: "Acordar", day: "Segunda-feira", done: false },
    { id: "2", time: "09:00", task: "Reunião", day: "Terça-feira", done: false },
  ]);

  const [newTask, setNewTask] = useState("");
  const [newTimeHour, setNewTimeHour] = useState("08");
  const [newTimeMinute, setNewTimeMinute] = useState("00");

  // Agora usamos apenas selectedDay para filtro e para adicionar
  const [selectedDay, setSelectedDay] = useState(today);

  useEffect(() => {
    Notifications.requestPermissionsAsync();
  }, []);

  async function scheduleNotification(task: string, time: string, day: string) {
    const now = new Date();
    const [hour, minute] = time.split(":").map(Number);
    const dayIndex = daysOfWeek.indexOf(day);

    let triggerDate = new Date();
    triggerDate.setHours(hour);
    triggerDate.setMinutes(minute);
    triggerDate.setSeconds(0);

    const todayIndex = now.getDay();
    let daysToAdd = (dayIndex - todayIndex + 7) % 7;
    if (daysToAdd === 0 && triggerDate < now) daysToAdd = 7;
    triggerDate.setDate(now.getDate() + daysToAdd);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "📅 Lembrete de tarefa",
        body: `Hora de: ${task} (${day} às ${time})`,
      },
      trigger: { date: triggerDate },
    });
  }

  const addTask = async () => {
    if (!newTask || !newTimeHour || !newTimeMinute || !selectedDay) {
      Alert.alert("Erro", "Preencha horário, tarefa e dia!");
      return;
    }

    const formattedTime = `${newTimeHour.padStart(2, "0")}:${newTimeMinute.padStart(2, "0")}`;

    setAgenda((prev) => [
      ...prev,
      { id: Date.now().toString(), time: formattedTime, task: newTask, day: selectedDay, done: false },
    ]);

    await scheduleNotification(newTask, formattedTime, selectedDay);

    setNewTask("");
    setNewTimeHour("08");
    setNewTimeMinute("00");
    // mantém o selectedDay, não reseta
  };

  const removeTask = (id: string) => {
    setAgenda((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleDone = (id: string) => {
    setAgenda((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const filteredTasks = agenda
    .filter((item) => item.day === selectedDay)
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tarefas de {selectedDay}</Text>

      <View style={styles.form}>
        <View style={styles.timeContainer}>
          <View style={styles.timeInputWrapper}>
            <Text style={styles.timeLabel}>Hora</Text>
            <TextInput
              style={styles.timeInput}
              value={newTimeHour}
              onChangeText={setNewTimeHour}
              keyboardType="numeric"
              maxLength={2}
            />
          </View>
          <View style={styles.timeInputWrapper}>
            <Text style={styles.timeLabel}>Minutos</Text>
            <TextInput
              style={styles.timeInput}
              value={newTimeMinute}
              onChangeText={setNewTimeMinute}
              keyboardType="numeric"
              maxLength={2}
            />
          </View>
        </View>

        <Text style={[styles.timeLabel, { marginTop: 10 }]}>Dia da semana:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }}>
          {daysOfWeek.map((day) => (
            <TouchableOpacity
              key={day}
              onPress={() => setSelectedDay(day)} // ✅ seleciona o dia para adicionar e filtrar
              style={[styles.dayButton, selectedDay === day && styles.dayButtonSelected]}
            >
              <Text
                style={[
                  styles.dayButtonText,
                  selectedDay === day && styles.dayButtonTextSelected,
                ]}
              >
                {day.substring(0, 3)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TextInput
          placeholder="Nova tarefa"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={newTask}
          onChangeText={setNewTask}
        />

        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addButtonText}>Adicionar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.item]}>
            <TouchableOpacity
              style={[styles.checkbox, item.done && styles.checkedCheckbox]}
              onPress={() => toggleDone(item.id)}
            >
              {item.done && <Text style={styles.checked}>✔️</Text>}
            </TouchableOpacity>

            <Text style={[styles.time, item.done && styles.doneText]}>{item.time}</Text>
            <Text style={[styles.task, item.done && styles.doneText]}>{item.task}</Text>

            <TouchableOpacity onPress={() => removeTask(item.id)}>
              <Text style={styles.remove}>✖️</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {filteredTasks.length === 0 && (
        <Text style={styles.noTaskText}>Nenhuma tarefa para este dia 🎉</Text>
      )}
    </View>
  );
}

// --- estilos mantidos iguais ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", paddingTop: 50, paddingHorizontal: 20 },
  title: { fontSize: 26, fontWeight: "bold", color: "#1E90FF", marginBottom: 20, textAlign: "center" },
  form: { marginBottom: 20 },
  timeContainer: { flexDirection: "row", justifyContent: "center", marginBottom: 10 },
  timeInputWrapper: { alignItems: "center", width: "40%" },
  timeLabel: { fontSize: 16, fontWeight: "bold", color: "#1E90FF", marginBottom: 5 },
  timeInput: { width: 50, textAlign: "center", backgroundColor: "#222", color: "#fff", padding: 10, borderRadius: 8, fontWeight: "bold", marginHorizontal: 5 },
  input: { backgroundColor: "#222", color: "#fff", padding: 10, marginBottom: 10, borderRadius: 8 },
  addButton: { backgroundColor: "#1E90FF", padding: 12, borderRadius: 8, alignItems: "center" },
  addButtonText: { color: "#fff", fontWeight: "bold" },
  item: { flexDirection: "row", padding: 15, backgroundColor: "#111", borderRadius: 8, marginBottom: 10, alignItems: "center", borderColor: "#1E90FF", borderWidth: 1 },
  checkbox: { width: 24, height: 24, borderWidth: 2, borderRadius: 12, marginRight: 15, justifyContent: "center", alignItems: "center", borderColor: "#1E90FF" },
  checkedCheckbox: { backgroundColor: "#1E90FF" },
  checked: { fontSize: 16, color: "#fff" },
  time: { width: 70, fontWeight: "bold", color: "#fff" },
  task: { flex: 1, color: "#fff" },
  remove: { marginLeft: 10, fontSize: 18, color: "#1E90FF" },
  doneText: { textDecorationLine: "line-through", color: "#666" },
  dayButton: { paddingVertical: 6, paddingHorizontal: 10, backgroundColor: "#222", borderRadius: 20, marginHorizontal: 5, borderWidth: 1, borderColor: "#1E90FF" },
  dayButtonSelected: { backgroundColor: "#1E90FF", borderColor: "#1E90FF" },
  dayButtonText: { fontWeight: "bold", color: "#1E90FF" },
  dayButtonTextSelected: { color: "#fff" },
  noTaskText: { color: "#888", textAlign: "center", marginTop: 20 },
});
