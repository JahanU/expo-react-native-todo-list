import { useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { YStack, Text, ScrollView, Separator } from 'tamagui'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTasks } from '../hooks/useTasks'
import { TaskInput } from '../components/TaskInput'
import { TaskItem } from '../components/TaskItem'
import { FilterTabs } from '../components/FilterTabs'
import { registerForPushNotificationsAsync } from '../utils/notifications'

export default function HomeScreen() {
    const {
        filteredTasks,
        filter,
        setFilter,
        addTask,
        toggleTask,
        deleteTask,
        completedCount,
        totalCount,
    } = useTasks()

    const insets = useSafeAreaInsets()

    useEffect(() => {
        registerForPushNotificationsAsync()
    }, [])

    return (
        <YStack
            flex={1}
            backgroundColor="$background"
            paddingTop={insets.top + 16}
            paddingBottom={insets.bottom}
            paddingHorizontal="$4"
        >
            <StatusBar style="auto" />

            {/* Header */}
            <Text
                fontSize="$9"
                fontWeight="800"
                color="$color"
                textAlign="center"
                marginBottom="$2"
            >
                📝 My Tasks
            </Text>

            {/* Task Counter */}
            <Text
                fontSize="$3"
                color="$color"
                textAlign="center"
                opacity={0.6}
                marginBottom="$4"
            >
                {totalCount === 0
                    ? 'No tasks yet'
                    : `${completedCount} of ${totalCount} task${totalCount !== 1 ? 's' : ''} completed`}
            </Text>

            {/* Input */}
            <TaskInput onAdd={addTask} />

            <Separator marginVertical="$4" borderColor="$borderColor" />

            {/* Filter Tabs */}
            <FilterTabs filter={filter} onFilterChange={setFilter} />

            {/* Task List */}
            <ScrollView
                flex={1}
                marginTop="$3"
                showsVerticalScrollIndicator={false}
            >
                <YStack gap="$2" paddingBottom="$4">
                    {filteredTasks.length === 0 ? (
                        <YStack
                            alignItems="center"
                            justifyContent="center"
                            paddingVertical="$8"
                        >
                            <Text fontSize="$6" textAlign="center" marginBottom="$2">
                                {filter === 'all' ? '🎉' : filter === 'active' ? '✅' : '📋'}
                            </Text>
                            <Text
                                fontSize="$4"
                                color="$color"
                                opacity={0.5}
                                textAlign="center"
                            >
                                {filter === 'all'
                                    ? 'No tasks yet! Add one above 🎉'
                                    : filter === 'active'
                                        ? 'All tasks completed! 🎊'
                                        : 'No completed tasks yet'}
                            </Text>
                        </YStack>
                    ) : (
                        filteredTasks.map((task) => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                onToggle={() => toggleTask(task.id)}
                                onDelete={() => deleteTask(task.id)}
                            />
                        ))
                    )}
                </YStack>
            </ScrollView>
        </YStack>
    )
}
