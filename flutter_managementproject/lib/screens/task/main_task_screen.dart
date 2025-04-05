import 'package:flutter/material.dart';
import 'package:flutter_managementproject/widgets/customer_drawer.dart';

class MainTaskScreen extends StatelessWidget {
  const MainTaskScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        iconTheme: IconThemeData(color: Colors.black),
        title: Row(
          children: [
            Icon(Icons.search, color: Colors.black),
            SizedBox(width: 10),
            Expanded(
              child: Text('Search', style: TextStyle(color: Colors.black)),
            ),
            CircleAvatar(
              radius: 20,
              backgroundImage: NetworkImage(
                'https://www.w3schools.com/w3images/avatar2.png',
              ),
            ),
            IconButton(
              icon: Icon(Icons.notifications, color: Colors.black),
              onPressed: () {},
            ),
          ],
        ),
      ),
      drawer: CustomDrawer(),
      body: SingleChildScrollView(
        // Thêm SingleChildScrollView để cuộn nội dung
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                ElevatedButton(
                  onPressed: () {
                    Navigator.pushNamed(context, '/add-task');
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.deepPurple,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(30),
                    ),
                    padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                  ),
                  child: Text(
                    '+ Create Task',
                    style: TextStyle(color: Colors.white, fontSize: 16),
                  ),
                ),
              ],
            ),
            SizedBox(height: 20),
            Text(
              'Task Progress',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 12),
            TaskProgressWidget(
              taskName: 'UI/UX Design',
              completed: 2,
              total: 7,
              color: Colors.purple,
            ),
            TaskProgressWidget(
              taskName: 'Website Design',
              completed: 1,
              total: 3,
              color: Colors.blue,
            ),
            TaskProgressWidget(
              taskName: 'Quality Assurance',
              completed: 2,
              total: 7,
              color: Colors.green,
            ),
            TaskProgressWidget(
              taskName: 'Development',
              completed: 1,
              total: 5,
              color: Colors.orange,
            ),
            SizedBox(height: 24),
            Text(
              'Recent Activity',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 16),
            ActivityCard(activity: 'Rechard Add New Task'),
            SizedBox(height: 16),
            Text(
              'In Progress',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 16),
            TaskCard(
              taskName: 'Quality Assurance',
              status: 'MEDIUM',
              dueDate: '28 Mar',
              comments: 5,
              attachments: 5,
              groupName: 'Box of Crayons',
              priorityColor: Colors.green,
              iconColor: Colors.yellow,
            ),
            TaskCard(
              taskName: 'Website Design',
              status: 'LOW',
              dueDate: '12 Feb',
              comments: 3,
              attachments: 4,
              groupName: 'Practice to Perfect',
              priorityColor: Colors.blue,
              iconColor: Colors.orange,
            ),
            SizedBox(height: 24),
            Text(
              'Task Progress',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 16),
          ],
        ),
      ),
    );
  }
}

class TaskProgressWidget extends StatelessWidget {
  final String taskName;
  final int completed;
  final int total;
  final Color color;

  const TaskProgressWidget({
    super.key,
    required this.taskName,
    required this.completed,
    required this.total,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 12.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            taskName,
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
          ),
          SizedBox(height: 4),
          LinearProgressIndicator(
            value: completed / total,
            backgroundColor: Colors.grey[300],
            valueColor: AlwaysStoppedAnimation<Color>(color),
          ),
          SizedBox(height: 4),
          Text('$completed/$total', style: TextStyle(color: Colors.grey)),
        ],
      ),
    );
  }
}

class ActivityCard extends StatelessWidget {
  final String activity;

  const ActivityCard({super.key, required this.activity});

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 3,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      child: ListTile(
        leading: Icon(Icons.circle, color: Colors.pink, size: 20),
        title: Text(activity),
      ),
    );
  }
}

class TaskCard extends StatelessWidget {
  final String taskName;
  final String status;
  final String dueDate;
  final int comments;
  final int attachments;
  final String groupName;
  final Color priorityColor;
  final Color iconColor;

  const TaskCard({
    super.key,
    required this.taskName,
    required this.status,
    required this.dueDate,
    required this.comments,
    required this.attachments,
    required this.groupName,
    required this.priorityColor,
    required this.iconColor,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      child: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Text(
                  taskName,
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                Spacer(),
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: priorityColor,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(status, style: TextStyle(color: Colors.white)),
                ),
              ],
            ),
            SizedBox(height: 8),
            Text(
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In id nec scelerisque massa.',
            ),
            SizedBox(height: 8),
            Row(
              children: [
                Icon(Icons.calendar_today, size: 16, color: Colors.grey),
                SizedBox(width: 4),
                Text(dueDate, style: TextStyle(color: Colors.grey)),
                Spacer(),
                Row(
                  children: [
                    Icon(Icons.comment, size: 16, color: Colors.grey),
                    SizedBox(width: 4),
                    Text('$comments', style: TextStyle(color: Colors.grey)),
                  ],
                ),
                SizedBox(width: 16),
                Row(
                  children: [
                    Icon(Icons.attach_file, size: 16, color: Colors.grey),
                    SizedBox(width: 4),
                    Text('$attachments', style: TextStyle(color: Colors.grey)),
                  ],
                ),
              ],
            ),
            SizedBox(height: 8),
            Row(
              children: [
                Text('Assigned to: ', style: TextStyle(color: Colors.grey)),
                CircleAvatar(
                  radius: 15,
                  backgroundColor: iconColor,
                  child: Icon(Icons.person, color: Colors.white, size: 16),
                ),
                SizedBox(width: 8),
                Text(groupName),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
