import { useState } from 'react'
import { XStack, Input, Button } from 'tamagui'
import { Plus } from '@tamagui/lucide-icons'

type TaskInputProps = {
    onAdd: (text: string) => void
}

export function TaskInput({ onAdd }: TaskInputProps) {
    const [text, setText] = useState('')

    const handleSubmit = () => {
        if (!text.trim()) return
        onAdd(text)
        setText('')
    }

    return (
        <XStack gap="$3" alignItems="center">
            <Input
                flex={1}
                size="$4"
                placeholder="What needs to be done?"
                placeholderTextColor="$placeholderColor"
                value={text}
                onChangeText={setText}
                onSubmitEditing={handleSubmit}
                returnKeyType="done"
                borderColor="$borderColor"
                backgroundColor="$background"
                color="$color"
                borderRadius="$4"
            />
            <Button
                size="$4"
                theme="active"
                icon={Plus}
                onPress={handleSubmit}
                borderRadius="$4"
                disabled={!text.trim()}
                opacity={text.trim() ? 1 : 0.5}
            >
                Add
            </Button>
        </XStack>
    )
}
