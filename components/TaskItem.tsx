import { XStack, Text, Button, Checkbox } from 'tamagui'
import { Check, Trash2 } from '@tamagui/lucide-icons'
import type { Task } from '../hooks/useTasks'

type TaskItemProps = {
    task: Task
    onToggle: () => void
    onDelete: () => void
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
    return (
        <XStack
            alignItems="center"
            gap="$3"
            paddingVertical="$3"
            paddingHorizontal="$3"
            backgroundColor="$background"
            borderRadius="$4"
            borderWidth={1}
            borderColor="$borderColor"
            animation="quick"
            opacity={task.completed ? 0.6 : 1}
            pressStyle={{ scale: 0.98 }}
        >
            <Checkbox
                size="$4"
                checked={task.completed}
                onCheckedChange={onToggle}
                borderColor="$borderColor"
            >
                <Checkbox.Indicator>
                    <Check size={16} />
                </Checkbox.Indicator>
            </Checkbox>

            <Text
                flex={1}
                fontSize="$4"
                color="$color"
                textDecorationLine={task.completed ? 'line-through' : 'none'}
                opacity={task.completed ? 0.6 : 1}
                animation="quick"
            >
                {task.text}
            </Text>

            <Button
                size="$3"
                chromeless
                icon={<Trash2 size={18} color="$red10" />}
                onPress={onDelete}
                pressStyle={{ opacity: 0.6 }}
            />
        </XStack>
    )
}
