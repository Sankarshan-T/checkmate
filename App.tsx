import { StatusBar, StyleSheet, Text, View } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Text style={styles.title}>checkmate</Text>
      <Text style={styles.subtitle}>get things done the better way...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F5',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 700,
    color: '#2E7D32',
    marginTop: 40,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B756B',
    marginTop: 8,
  },
})