import { Pressable, StatusBar, StyleSheet, Text, View } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.logo}>checkmate</Text>
        <Pressable style={styles.menuButton}>
          <Text style={styles.menuText}>=</Text>
        </Pressable>
      </View>

      <View style={styles.greeting}>
        <Text style={styles.subtitle}>lets get things done :D</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F5',
    padding: 20,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '40',
  },

  logo: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2E7D32',
  },

  menuButton: {
    padding: 8,
  },

  menuText: {
    fontSize: 24,
    color: '#1B1B1B',
  },

  greeting: {
    marginTop: 40,
  },

  subtitle: {
    fontSize: 18,
    color: '#6B756B',
  },
})