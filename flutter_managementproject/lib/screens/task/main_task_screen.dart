import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_managementproject/Services/globals.dart';
import 'package:flutter_managementproject/screens/models/TaskModel.dart';
import 'package:flutter_managementproject/widgets/customer_drawer.dart';
import 'package:http/http.dart' as http;

class MainTaskScreen extends StatefulWidget {
  const MainTaskScreen({super.key});

  @override
  State<MainTaskScreen> createState() => _MainTaskScreenState();
}

class _MainTaskScreenState extends State<MainTaskScreen> {
  List<TaskModel> _allTasks = [];
  bool _isLoading = true;
  String _errorMessage = '';

  @override
  void initState() {
    super.initState();
    _fetchMyTasks();
  }

  // Method to fetch tasks assigned to current user
  Future<void> _fetchMyTasks() async {
    setState(() {
      _isLoading = true;
      _errorMessage = '';
    });

    try {
      // Change this to your actual API URL
      final response = await http.get(
        Uri.parse('$baseUrl/api/tasks/my-task'),
        headers: await getAuthHeaders(),
      );

      if (response.statusCode == 200) {
        final List<dynamic> tasksJson = jsonDecode(response.body);
        setState(() {
          _allTasks =
              tasksJson.map((json) => TaskModel.fromJson(json)).toList();
          _isLoading = false;
        });
      } else if (response.statusCode == 404) {
        setState(() {
          _allTasks = [];
          _isLoading = false;
          _errorMessage = 'No tasks found.';
        });
      } else {
        setState(() {
          _isLoading = false;
          _errorMessage =
              'Failed to load tasks. Error code: ${response.statusCode}';
        });
      }
    } catch (e) {
      setState(() {
        _isLoading = false;
        _errorMessage = 'Error connecting to the server: $e';
      });
    }
  }

  // Get tasks filtered by status
  List<TaskModel> _getFilteredTasks(String status) {
    if (status == 'All') {
      return _allTasks;
    }
    return _allTasks.where((task) => task.status == status).toList();
  }

  // Get color based on task priority
  Color _getPriorityColor(String? priority) {
    switch (priority?.toUpperCase()) {
      case 'HIGH':
        return Colors.red;
      case 'MEDIUM':
        return Colors.amber;
      case 'LOW':
        return Colors.green;
      default:
        return Colors.blue;
    }
  }

  // Format date string
  String _formatDate(String? dateString) {
    if (dateString == null || dateString.isEmpty) {
      return 'No date';
    }

    try {
      final date = DateTime.parse(dateString);
      return '${date.day} ${_getMonthName(date.month)}';
    } catch (e) {
      return dateString;
    }
  }

  // Get month name from month number
  String _getMonthName(int month) {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return months[month - 1];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          "Tasks Assigned to Me",
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 22),
        ),

        elevation: 0,
        backgroundColor: Colors.white,
        foregroundColor: const Color(0xFF2D3748),
      ),
      drawer: CustomDrawer(),
      body:
          _isLoading
              ? Center(child: CircularProgressIndicator())
              : _errorMessage.isNotEmpty
              ? Center(
                child: Text(_errorMessage, style: TextStyle(color: Colors.red)),
              )
              : _buildMyTasksTab(),
    );
  }

  Widget _buildMyTasksTab() {
    return RefreshIndicator(
      onRefresh: _fetchMyTasks,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(height: 8),

          // Status categories
          Expanded(
            child: DefaultTabController(
              length: 4,
              child: Column(
                children: [
                  TabBar(
                    isScrollable: true,
                    labelColor: Colors.deepPurple,
                    unselectedLabelColor: Colors.grey,
                    indicatorColor: Colors.deepPurple,
                    tabs: [
                      Tab(text: 'All'),
                      Tab(text: 'In Progress'),
                      Tab(text: 'Completed'),
                      Tab(text: 'Pending'),
                    ],
                  ),
                  SizedBox(height: 16),
                  Expanded(
                    child: TabBarView(
                      children: [
                        // All Tasks
                        _buildTasksListFromData(_allTasks),

                        // In Progress Tasks
                        _buildTasksListFromData(
                          _getFilteredTasks('in progress'),
                        ),

                        // Completed Tasks
                        _buildTasksListFromData(_getFilteredTasks('completed')),

                        // Pending Tasks
                        _buildTasksListFromData(_getFilteredTasks('Pending')),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTasksListFromData(List<TaskModel> tasks) {
    if (tasks.isEmpty) {
      return Center(child: Text('No tasks found in this category'));
    }

    return ListView.separated(
      padding: EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
      itemCount: tasks.length,
      separatorBuilder: (context, index) => SizedBox(height: 16),
      itemBuilder: (context, index) {
        final task = tasks[index];
        return TaskCard(
          task: task,
          priorityColor: _getPriorityColor(task.priority),
          iconColor: Colors.deepPurple,
          formattedDueDate: _formatDate(task.endDate),
          subtasksCount: task.subtasks?.length ?? 0,
        );
      },
    );
  }
}

class TaskCard extends StatelessWidget {
  final TaskModel task;
  final Color priorityColor;
  final Color iconColor;
  final String formattedDueDate;
  final int subtasksCount;

  const TaskCard({
    super.key,
    required this.task,
    required this.priorityColor,
    required this.iconColor,
    required this.formattedDueDate,
    required this.subtasksCount,
  });

  @override
  Widget build(BuildContext context) {
    // Calculate completed subtasks count
    final completedSubtasks =
        task.subtasks
            ?.where((subtask) => subtask.status == "completed")
            .length ??
        0;

    return InkWell(
      onTap: () async {
        final result = await Navigator.pushNamed(
          context,
          '/task-detail',
          arguments: task,
        );

        if (result == true) {
          // Fluttertoast.showToast(
          //   msg: 'reload',
          //   toastLength: Toast.LENGTH_SHORT,
          //   gravity: ToastGravity.BOTTOM,
          //   backgroundColor: Colors.green,
          //   textColor: Colors.white,
          // );
        }
        // ignore: use_build_context_synchronously
        if (context.findAncestorStateOfType<_MainTaskScreenState>() != null) {
          // ignore: use_build_context_synchronously
          context
              .findAncestorStateOfType<_MainTaskScreenState>()!
              ._fetchMyTasks();
        }
      },

      child: Card(
        elevation: 4,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        child: Padding(
          padding: EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(
                    child: Text(
                      task.taskName ?? 'Untitled Task',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  SizedBox(width: 8),
                  Container(
                    padding: EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: priorityColor,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      task.priority?.toUpperCase() ?? 'NORMAL',
                      style: TextStyle(color: Colors.white),
                    ),
                  ),
                ],
              ),
              SizedBox(height: 8),
              Text(task.description ?? 'No description'),
              SizedBox(height: 8),
              Row(
                children: [
                  Icon(Icons.calendar_today, size: 16, color: Colors.grey),
                  SizedBox(width: 4),
                  Text(formattedDueDate, style: TextStyle(color: Colors.grey)),
                  Spacer(),
                  if (subtasksCount > 0) ...[
                    Icon(Icons.checklist, size: 16, color: Colors.grey),
                    SizedBox(width: 4),
                    Text(
                      '$completedSubtasks/$subtasksCount',
                      style: TextStyle(color: Colors.grey),
                    ),
                    SizedBox(width: 16),
                  ],
                  Icon(Icons.label, size: 16, color: Colors.grey),
                  SizedBox(width: 4),
                  Text(
                    task.status ?? 'No status',
                    style: TextStyle(color: Colors.grey),
                  ),
                ],
              ),
              if (task.subtasks != null && task.subtasks!.isNotEmpty) ...[
                SizedBox(height: 12),
                LinearProgressIndicator(
                  value:
                      subtasksCount > 0 ? completedSubtasks / subtasksCount : 0,
                  backgroundColor: Colors.grey[300],
                  valueColor: AlwaysStoppedAnimation<Color>(Colors.deepPurple),
                ),
              ],
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
                  Text(task.assigneeEmail ?? 'Unassigned'),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
