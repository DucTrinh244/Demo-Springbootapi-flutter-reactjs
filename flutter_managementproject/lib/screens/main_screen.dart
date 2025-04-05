import 'package:flutter/material.dart';
import 'package:flutter_managementproject/screens/project/add_project_screen.dart';

class MainScreen extends StatefulWidget {
  const MainScreen({super.key});

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],
      appBar: AppBar(
        title: Text(
          "Projects Management",
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        elevation: 0,
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        actions: [
          IconButton(icon: Icon(Icons.search), onPressed: () {}),
          SizedBox(width: 16),
        ],
      ),
      body: ProjectsScreen(),
    );
  }
}

class ProjectsScreen extends StatefulWidget {
  const ProjectsScreen({super.key});

  @override
  State<ProjectsScreen> createState() => _ProjectsScreenState();
}

class _ProjectsScreenState extends State<ProjectsScreen> {
  bool _isActive = true; // true = Active, false = Completed

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                ProjectStatsCard(
                  title: "Active Projects",
                  value: "26",
                  icon: Icons.check_circle,
                  color: Colors.green,
                ),
                ProjectStatsCard(
                  title: "Tasks done",
                  value: "38%",
                  icon: Icons.assignment_turned_in,
                  color: Colors.red,
                ),
              ],
            ),
            SizedBox(height: 20),
            Row(
              children: [
                GestureDetector(
                  onTap: () {
                    setState(() {
                      _isActive = true;
                    });
                  },
                  child: Text(
                    "Active",
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: _isActive ? Colors.black : Colors.grey,
                    ),
                  ),
                ),
                SizedBox(width: 16),
                GestureDetector(
                  onTap: () {
                    setState(() {
                      _isActive = false;
                    });
                  },
                  child: Text(
                    "Completed",
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: !_isActive ? Colors.black : Colors.grey,
                    ),
                  ),
                ),
              ],
            ),
            SizedBox(height: 10),
            Expanded(
              child: ListView(
                children:
                    _isActive
                        ? [
                          ProjectCard(
                            title: "Shophour Application",
                            progress: 22,
                            members: 4,
                            date: "25 Feb",
                            tasks: 65,
                          ),
                          ProjectCard(
                            title: "Mobimall Website & App",
                            progress: 34,
                            members: 5,
                            date: "25 Feb",
                            tasks: 65,
                          ),
                          ProjectCard(
                            title: "Woochat Web Version",
                            progress: 85,
                            members: 3,
                            date: "25 Feb",
                            tasks: 65,
                          ),
                          ProjectCard(
                            title: "Woochat Web Version",
                            progress: 85,
                            members: 3,
                            date: "25 Feb",
                            tasks: 65,
                          ),
                          ProjectCard(
                            title: "Woochat Web Version",
                            progress: 85,
                            members: 3,
                            date: "25 Feb",
                            tasks: 65,
                          ),
                          ProjectCard(
                            title: "Woochat Web Version",
                            progress: 85,
                            members: 3,
                            date: "25 Feb",
                            tasks: 65,
                          ),
                        ]
                        : [
                          ProjectCard(
                            title: "Ecommerce Website",
                            progress: 100,
                            members: 6,
                            date: "10 Jan",
                            tasks: 80,
                          ),
                          ProjectCard(
                            title: "Portfolio Website",
                            progress: 100,
                            members: 2,
                            date: "15 Jan",
                            tasks: 30,
                          ),
                        ],
              ),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => AddProjectScreen()),
          );
        },
        backgroundColor: Colors.blue,
        child: Icon(Icons.add),
      ),
    );
  }
}

class ProjectStatsCard extends StatelessWidget {
  final String title;
  final String value;
  final IconData icon;
  final Color color;

  const ProjectStatsCard({
    super.key,
    required this.title,
    required this.value,
    required this.icon,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: MediaQuery.of(context).size.width * 0.42,
      padding: EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(color: Colors.black12, blurRadius: 4, spreadRadius: 2),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, color: color, size: 20),
              SizedBox(width: 8),
              Text(
                title,
                style: TextStyle(fontSize: 14, color: Colors.black54),
              ),
            ],
          ),
          SizedBox(height: 8),
          Text(
            value,
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }
}

class ProjectCard extends StatelessWidget {
  final String title;
  final int progress;
  final int members;
  final String date;
  final int tasks;

  const ProjectCard({
    super.key,
    required this.title,
    required this.progress,
    required this.members,
    required this.date,
    required this.tasks,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        // Chuyển sang màn hình chi tiết
        // Navigator.push(
        //   context,
        //   MaterialPageRoute(
        //     builder:
        //         (context) => ProjectDetailScreen(
        //           title: title,
        //           progress: progress,
        //           members: members,
        //           date: date,
        //           tasks: tasks,
        //         ),
        //   ),
        // );
      },
      child: Container(
        margin: EdgeInsets.only(bottom: 16),
        padding: EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          boxShadow: [
            BoxShadow(color: Colors.black12, blurRadius: 4, spreadRadius: 2),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 8),
            Row(
              children: [
                Icon(Icons.people, size: 16, color: Colors.black54),
                SizedBox(width: 4),
                Text(
                  "$members Members",
                  style: TextStyle(color: Colors.black54),
                ),
                Spacer(),
                Text(
                  "$progress%",
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    color: Colors.blue,
                  ),
                ),
              ],
            ),
            SizedBox(height: 8),
            LinearProgressIndicator(
              value: progress / 100.0,
              color: Colors.blue,
            ),
            SizedBox(height: 8),
            Row(
              children: [
                Icon(Icons.calendar_today, size: 16, color: Colors.black54),
                SizedBox(width: 4),
                Text(date, style: TextStyle(color: Colors.black54)),
                Spacer(),
                Icon(Icons.task, size: 16, color: Colors.black54),
                SizedBox(width: 4),
                Text("$tasks Tasks", style: TextStyle(color: Colors.black54)),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
