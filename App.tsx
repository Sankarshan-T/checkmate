
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import CalendarModal from './src/components/CalendarModal';
import TaskCard from './src/components/TaskCard';
import AddTaskModal from './src/components/AddTaskModal';

import {
  colors,
  spacing,
  radius,
} from './src/styles/globals';

import {
  loadTaskStorage,
  saveTaskStorage,
  getLocalDateKey,
  type Task,
  type GlobalTask,
  type DailyTask,
  type DailyTaskAssignment,
  type TaskStorageData,
  removeGlobalTaskPermanently,
} from './src/storage/taskStorage';
import { ChartNoAxesColumn } from 'lucide-react-native';

export default function App() {
  const { width } = useWindowDimensions();
  const isPhone = width < 500;

  const now = new Date();
  const hour = now.getHours();

  let greeting = '';

  if (hour >= 5 && hour < 12) {
    greeting = 'good morning! :D';
  } else if (hour >= 12 && hour < 18) {
    greeting = 'good afternoon!';
  } else if (hour >= 18 && hour < 22) {
    greeting = 'good evening :)';
  } else {
    greeting = 'good night zzz....';
  }

  const date = now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const [storageData, setStorageData] =
    useState<TaskStorageData>({
      globalTasks: [],
      dailyTasks: [],
      assignments: [],
    });

  const [tasksLoaded, setTasksLoaded] = useState(false);
  const [storageError, setStorageError] = useState(false);

  const [selectedDate, setSelectedDate] = useState(
    () => getLocalDateKey(new Date()),
  );

  const [addTaskVisible, setAddTaskVisible] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function initializeTasks() {
      try {
        const savedData = await loadTaskStorage();

        if (isActive) {
          setStorageData(savedData);
          setStorageError(false);
        }
      } catch (error) {
        console.error('Could not load saved tasks:', error);

        if (isActive) {
          setStorageError(true);
        }
      } finally {
        if (isActive) {
          setTasksLoaded(true);
        }
      }
    }

    initializeTasks();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!tasksLoaded || storageError) {
      return;
    }

    saveTaskStorage(storageData).catch(error => {
      console.error('Could not save tasks:', error);
      setStorageError(true);
    });
  }, [storageData, tasksLoaded, storageError]);

  const createId = () =>
    `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const addDailyTask = (title: string) => {
    const cleanTitle = title.trim();

    if (!cleanTitle) {
      return;
    }

    const newTask: DailyTask = {
      id: createId(),
      title: cleanTitle,
      date: selectedDate,
      completed: false,
    };

    setStorageData(current => ({
      ...current,
      dailyTasks: [...current.dailyTasks, newTask],
    }));

    setAddTaskVisible(false);
  };

  const addGlobalTask = (title: string) => {
    const cleanTitle = title.trim();

    if (!cleanTitle) {
      return;
    }

    const newTask: GlobalTask = {
      id: createId(),
      title: cleanTitle,
      completionHistory: [],
    };

    setStorageData(current => ({
      ...current,
      globalTasks: [...current.globalTasks, newTask],
    }));
  };

  const assignGlobalTask = (taskId: string) => {
    setStorageData(current => {
      const alreadyAssigned = current.assignments.some(
        assignment =>
          assignment.taskId === taskId &&
          assignment.date === selectedDate,
      );

      if (alreadyAssigned) {
        return current;
      }

      const newAssignment: DailyTaskAssignment = {
        taskId,
        date: selectedDate,
        completed: false,
      };

      return {
        ...current,
        assignments: [...current.assignments, newAssignment],
      };
    });
  };

  const visibleTasks: Task[] = [
    ...storageData.assignments
      .filter(assignment => assignment.date === selectedDate)
      .flatMap(assignment => {
        const libraryTask = storageData.globalTasks.find(
          task => task.id === assignment.taskId,
        );

        if (!libraryTask) {
          return [];
        }

        return [{
          id: libraryTask.id,
          title: libraryTask.title,
          completed: assignment.completed,
          completionHistory: libraryTask.completionHistory,
        }];
      }),

    ...storageData.dailyTasks
      .filter(task => task.date === selectedDate)
      .map(task => ({
        id: task.id,
        title: task.title,
        completed: task.completed,
        completionHistory: [],
      })),
  ];


  const toggleTask = (id: string) => {
    setStorageData(current => {
      const dailyTask = current.dailyTasks.find(
        task => task.id === id && task.date === selectedDate,
      );

      if (dailyTask) {
        return {
          ...current,
          dailyTasks: current.dailyTasks.map(task =>
            task.id === id && task.date === selectedDate
              ? { ...task, completed: !task.completed }
              : task,
          ),
        };
      }

      const assignment = current.assignments.find(
        item =>
          item.taskId === id &&
          item.date === selectedDate,
      );

      if (!assignment) {
        return current;
      }

      const nextCompleted = !assignment.completed;

      return {
        ...current,

        assignments: current.assignments.map(item =>
          item.taskId === id && item.date === selectedDate
            ? { ...item, completed: nextCompleted }
            : item,
        ),

        globalTasks: current.globalTasks.map(task => {
          if (task.id !== id) {
            return task;
          }

          const history = task.completionHistory.filter(
            completedDate => completedDate !== selectedDate,
          );

          return {
            ...task,
            completionHistory: nextCompleted
              ? [...history, selectedDate]
              : history,
          };
        }),
      };
    });
  };

  const deleteTask = (id: string) => {
    const isGlobalTask = storageData.globalTasks.some(
      task => task.id === id,
    );

    if (isGlobalTask) {
      setStorageData(current => ({
        ...current,
        assignments: current.assignments.filter(
          assignment =>
            !(
              assignment.taskId === id &&
              assignment.date === selectedDate
            ),
        ),
      }));

      return;
    }

    setStorageData(current => ({
      ...current,
      dailyTasks: current.dailyTasks.filter(
        task =>
          !(task.id === id && task.date === selectedDate),
      ),
    }));
  };

  const fadeAnim = React.useRef(
    new Animated.Value(0),
  ).current;

  const slideAnim = React.useRef(
    new Animated.Value(20),
  ).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);


  const handleRemoveGlobalTask = async (taskId: string) => {
    try {
      await saveTaskStorage(storageData);

      await removeGlobalTaskPermanently(taskId);

      const updatedData = await loadTaskStorage();
      setStorageData(updatedData);
    } catch (error) {
      Alert.alert(
        'Could not remove task',
        'Something went wrong while removing this task. Please try again.',
      );
    }
  };


  const assignedTaskIds = storageData.assignments
    .filter(assignment => assignment.date === selectedDate)
    .map(assignment => assignment.taskId);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.decorativeCircleOne} />
      <View style={styles.decorativeCircleTwo} />

      <View style={[styles.header, isPhone && styles.headerCompact]}>
        <Text style={[styles.logo, isPhone && styles.logoCompact]}>checkmate</Text>


        <Pressable
          style={({ pressed }) => [
            styles.reportsButton,
            pressed && styles.reportsButtonPressed,
          ]}
          onPress={() => {
            // todo: reports stuff
          }}
          accessibilityRole="button"
        >
          <ChartNoAxesColumn
            size={20}
            color={colors.primary}
            strokeWidth={3}
          />
          <Text style={styles.reportsText}>
            Reports
          </Text>
        </Pressable>
      </View>

      <Animated.View
        style={[
          styles.greeting,
          isPhone && styles.greetingCompact,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View
          style={[
            styles.greetingTextContainer,
            isPhone && styles.greetingTextContainerCompact,
          ]}
        >
          <Text
            style={[
              styles.title,
              isPhone && styles.titleCompact,
            ]}
          >
            {greeting}
          </Text>

          <Text
            style={[
              styles.subtitle,
              isPhone && styles.subtitleCompact,
            ]}
          >
            lets get things done :D
          </Text>
        </View>

        <Text
          style={[
            styles.date,
            isPhone && styles.dateCompact,
          ]}
        >
          {date} :D
        </Text>
      </Animated.View>

      {storageError && (
        <Text style={styles.storageWarning}>
          Couldn't access saved tasks. Your changes may not be saved.
          Please restart the app or check device storage.
        </Text>
      )}

      <View style={styles.taskCardContainer}>
        {tasksLoaded ? (
          <TaskCard
            tasks={visibleTasks}
            selectedDate={selectedDate}
            onOpenCalendar={() => setCalendarVisible(true)}
            onRequestAddTask={() => setAddTaskVisible(true)}
            onToggleTask={toggleTask}
            onDeleteTask={deleteTask}
            globalTasks={storageData.globalTasks}
            assignedTaskIds={assignedTaskIds}
            onAddGlobalTask={addGlobalTask}
            onAssignGlobalTask={assignGlobalTask}
            onRemoveGlobalTask={handleRemoveGlobalTask}
          />
        ) : (
          <Text style={styles.loadingText}>
            Loading your tasks...
          </Text>
        )}
      </View>

      <AddTaskModal
        visible={addTaskVisible}
        onClose={() => setAddTaskVisible(false)}
        onAddTask={addDailyTask}
      />

      <CalendarModal
        visible={calendarVisible}
        selectedDate={selectedDate}
        onClose={() => setCalendarVisible(false)}
        onSelectDate={setSelectedDate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    marginTop: spacing.xxl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.xl,
    elevation: 4,
    shadowColor: colors.subtle,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },

  headerCompact: {
    marginTop: spacing.lg,
  },

  logo: {
    fontSize: 30,
    fontWeight: '700',
    color: colors.primary,
  },

  logoCompact: {
    fontSize: 26,
  },

  decorativeCircleOne: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.primaryLight,
    right: -100,
    top: 100,
    opacity: 0.45,
  },

  decorativeCircleTwo: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.primarySoft,
    left: -70,
    bottom: 180,
    opacity: 0.5,
  },

  taskCardContainer: {
    flex: 1,
    minHeight: 0,
    marginTop: spacing.lg,
    paddingBottom: spacing.sm,
    alignItems: 'center',
  },

  loadingText: {
    marginTop: spacing.xl,
    color: colors.muted,
    fontSize: 16,
  },

  storageWarning: {
    marginTop: spacing.md,
    color: '#B3261E',
    fontSize: 13,
  },

  reportsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#D3E7D3',
  },

  reportsButtonPressed: {
    backgroundColor: '#D2E8D2',
    transform: [{ scale: 0.97 }],
  },

  reportsText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },

  greeting: {
    marginTop: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 800,
    gap: spacing.md,
  },

  greetingCompact: {
    flexDirection: 'column',
    alignItems: 'stretch',
    marginTop: spacing.md,
    gap: spacing.md,
  },

  greetingTextContainer: {
    flex: 1,
    minWidth: 0,
  },

  greetingTextContainerCompact: {
    flex: 0,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },

  titleCompact: {
    fontSize: 23,
    lineHeight: 29,
  },

  subtitle: {
    fontSize: 17,
    color: colors.subtle,
  },

  subtitleCompact: {
    fontSize: 15,
  },

  date: {
    fontSize: 16,
    color: colors.muted,
    marginBottom: 4,
    textAlign: 'right',
    flexShrink: 1,
  },

  dateCompact: {
    alignSelf: 'flex-start',
    fontSize: 13,
    textAlign: 'left',
    marginBottom: 0,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.round,
    overflow: 'hidden',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
});
