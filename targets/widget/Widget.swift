import WidgetKit
import SwiftUI

// Match the Task type from TS: { id: string; text: string; completed: boolean; createdAt: number }
struct TaskItem: Codable, Identifiable {
    let id: String
    let text: String
    let completed: Bool
    let createdAt: Double
}

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date(), tasks: [
            TaskItem(id: "1", text: "Buy groceries", completed: false, createdAt: 1),
            TaskItem(id: "2", text: "Walk the dog", completed: false, createdAt: 2),
            TaskItem(id: "3", text: "Finish React Native app", completed: false, createdAt: 3)
        ])
    }

    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> ()) {
        let entry = Provider.getEntry()
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
        let entry = Provider.getEntry()
        let timeline = Timeline(entries: [entry], policy: .never) // Widget updates when app writes new data
        completion(timeline)
    }
    
    // Read from shared App Group UserDefaults
    static func getEntry() -> SimpleEntry {
        let sharedDefaults = UserDefaults(suiteName: "group.com.jahan.exporntodo")
        var tasks: [TaskItem] = []
        
        if let dataString = sharedDefaults?.string(forKey: "widget_tasks"),
           let data = dataString.data(using: .utf8) {
            do {
                tasks = try JSONDecoder().decode([TaskItem].self, from: data)
            } catch {
                print("Failed to decode tasks: \(error)")
            }
        }
        
        return SimpleEntry(date: Date(), tasks: tasks)
    }
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let tasks: [TaskItem]
}

struct WidgetEntryView : View {
    var entry: Provider.Entry

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text("To Do List")
                .font(.headline)
                .foregroundColor(.blue)
            
            if entry.tasks.isEmpty {
                Text("All caught up! 🎉")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                    .frame(maxWidth: .infinity, alignment: .center)
            } else {
                ForEach(entry.tasks.prefix(3)) { task in
                    HStack(alignment: .top) {
                        Image(systemName: "circle")
                            .foregroundColor(.gray)
                            .font(.system(size: 14))
                        Text(task.text)
                            .font(.subheadline)
                            .lineLimit(1)
                    }
                }
                
                if entry.tasks.count > 3 {
                    Text("+\(entry.tasks.count - 3) more")
                        .font(.caption)
                        .foregroundColor(.gray)
                }
            }
            Spacer(minLength: 0)
        }
        .padding()
        // Adding the widget URL so it opens the app on tap
        .widgetURL(URL(string: "expo-rn-todo-list://"))
    }
}

@main
struct AppWidget: Widget {
    let kind: String = "Widget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            if #available(iOS 17.0, *) {
                WidgetEntryView(entry: entry)
                    .containerBackground(.fill.tertiary, for: .widget)
            } else {
                WidgetEntryView(entry: entry)
                    .padding()
                    .background()
            }
        }
        .configurationDisplayName("To-Do List")
        .description("View your top remaining tasks.")
        .supportedFamilies([.systemSmall]) // Only small size
    }
}
