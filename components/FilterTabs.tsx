import { XStack, Button } from 'tamagui'
import type { Filter } from '../hooks/useTasks'

type FilterTabsProps = {
    filter: Filter
    onFilterChange: (filter: Filter) => void
}

const tabs: { label: string; value: Filter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Completed', value: 'completed' },
]

export function FilterTabs({ filter, onFilterChange }: FilterTabsProps) {
    return (
        <XStack gap="$2" justifyContent="center">
            {tabs.map((tab) => {
                const isActive = filter === tab.value
                return (
                    <Button
                        key={tab.value}
                        size="$3"
                        theme={isActive ? 'active' : undefined}
                        backgroundColor={isActive ? '$color6' : '$background'}
                        color={isActive ? '$color' : '$color'}
                        borderWidth={1}
                        borderColor={isActive ? '$color6' : '$borderColor'}
                        borderRadius="$10"
                        onPress={() => onFilterChange(tab.value)}
                        pressStyle={{ opacity: 0.8 }}
                        fontWeight={isActive ? '700' : '400'}
                    >
                        {tab.label}
                    </Button>
                )
            })}
        </XStack>
    )
}
