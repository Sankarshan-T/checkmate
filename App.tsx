import {
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View
} from "react-native";

import {
  colors,
  spacing,
  radius,
} from './src/styles/globals';

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
        <Text style={styles.date}>Tuesday, October 6th :)</Text>

        <Text style={styles.title}>good day!!</Text>


        <Text style={styles.subtitle}>lets get things done :D</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xxl,
  },

  logo: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
  },

  date: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 8,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1B1B1B',
    marginBottom: 4,
  },

  menuButton: {
    padding: spacing.sm,
  },

  menuText: {
    fontSize: 24,
    color: '#1B1B1B',
  },

  greeting: {
    marginTop: spacing.xxl,
  },

  subtitle: {
    fontSize: 18,
    color: '#6B756B',
  },
})