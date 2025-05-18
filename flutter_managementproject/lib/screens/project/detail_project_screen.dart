import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_managementproject/Services/globals.dart';
import 'package:flutter_managementproject/screens/models/ProjectModel.dart';
import 'package:flutter_managementproject/screens/models/TaskModel.dart';
import 'package:flutter_managementproject/screens/project/add_member_screen.dart';
import 'package:flutter_managementproject/screens/task/add_task_screen.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:http/http.dart' as http;
import 'package:intl/intl.dart';

class DetailProjectScreen extends StatefulWidget {
  const DetailProjectScreen({super.key});

  @override
  State<DetailProjectScreen> createState() => _DetailProjectScreenState();
}

class _DetailProjectScreenState extends State<DetailProjectScreen> {
  late ProjectModel project;
  bool isLoading = true; // Start with loading state
  double progressPercentage = 0;
  int totalTasks = 0;
  int completedTasks = 0;
  int overdueTasks = 0;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final args =
        ModalRoute.of(context)!.settings.arguments as Map<String, dynamic>;
    project = args['project'];

    // Load project progress when dependencies are available
    _loadProjectData();
  }

  // Load all project data
  Future<void> _loadProjectData() async {
    setState(() {
      isLoading = true;
    });

    try {
      // Run both API calls in parallel
      await Future.wait([_refreshProjectData(), _getProjectProgress()]);
    } catch (e) {
      Fluttertoast.showToast(
        msg: "Lỗi tải dữ liệu: $e",
        backgroundColor: Colors.red,
      );
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  // Refresh project details from API
  Future<void> _refreshProjectData() async {
    try {
      String url = '$baseUrl/api/projects/${project.projectId}';
      final response = await http.get(
        Uri.parse(url),
        headers: await getAuthHeaders(),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          project = ProjectModel.fromJson(data);
        });
      } else {
        Fluttertoast.showToast(
          msg: "Không thể tải dữ liệu dự án: ${response.reasonPhrase}",
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      Fluttertoast.showToast(msg: "Lỗi: $e", backgroundColor: Colors.red);
      rethrow; // Rethrow to be caught by _loadProjectData
    }
  }

  // Get project progress statistics
  Future<void> _getProjectProgress() async {
    try {
      String url = '$baseUrl/api/projects/summary/${project.projectId}';
      final response = await http.get(
        Uri.parse(url),
        headers: await getAuthHeaders(),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          progressPercentage = data['progressPercentage'] ?? 0.0;
          totalTasks = data['totalTasks'] ?? 0;
          completedTasks = data['completedTasks'] ?? 0;
          overdueTasks = data['overdueTasks'] ?? 0;
        });
      } else {
        Fluttertoast.showToast(
          msg: "Không thể tải tiến trình: ${response.reasonPhrase}",
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      Fluttertoast.showToast(msg: "Lỗi: $e", backgroundColor: Colors.red);
      rethrow; // Rethrow to be caught by _loadProjectData
    }
  }

  // Get tasks associated with this project
  Future<List<TaskModel>> _getTasksByProjectId(String projectId) async {
    try {
      String url = '$baseUrl/api/tasks/projectId/$projectId';
      final response = await http.get(
        Uri.parse(url),
        headers: await getAuthHeaders(),
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((e) => TaskModel.fromJson(e)).toList();
      } else if (response.statusCode == 404) {
        // No tasks in project - return empty list
        return [];
      } else {
        Fluttertoast.showToast(
          msg: "Lỗi tải danh sách task: ${response.reasonPhrase}",
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      Fluttertoast.showToast(msg: "Lỗi: $e", backgroundColor: Colors.red);
    }
    return []; // Return empty list if there's an error
  }

  // Delete a project
  Future<bool> _deleteProject(String projectId) async {
    setState(() {
      isLoading = true;
    });

    try {
      String url = '$baseUrl/api/projects/$projectId';
      final response = await http.delete(
        Uri.parse(url),
        headers: await getAuthHeaders(),
      );

      if (response.statusCode == 200 || response.statusCode == 204) {
        Fluttertoast.showToast(
          msg: "Dự án đã được xóa thành công",
          backgroundColor: Colors.green,
        );
        return true;
      } else {
        Fluttertoast.showToast(
          msg: "Không thể xóa dự án: ${response.reasonPhrase}",
          backgroundColor: Colors.red,
        );
        return false;
      }
    } catch (e) {
      Fluttertoast.showToast(msg: "Lỗi: $e", backgroundColor: Colors.red);
      return false;
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  // Format date string to dd/MM/yyyy
  String _formatDate(String? dateString) {
    if (dateString == null || dateString.isEmpty) return 'Không có';
    try {
      final date = DateTime.parse(dateString);
      return DateFormat('dd/MM/yyyy').format(date);
    } catch (e) {
      return dateString;
    }
  }

  // Get color based on status
  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'completed':
        return Colors.green;
      case 'in progress':
        return Colors.orange;
      case 'pending':
        return Colors.red;
      default:
        return Colors.blue;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],
      appBar: AppBar(
        title: const Text(
          'Project Detail ',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
        backgroundColor: Colors.blue.shade700,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.more_vert),
            onPressed: () {
              showModalBottomSheet(
                context: context,
                shape: const RoundedRectangleBorder(
                  borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
                ),
                builder: (context) => _buildProjectActions(context, project),
              );
            },
          ),
        ],
      ),
      body:
          isLoading
              ? const Center(child: CircularProgressIndicator())
              : RefreshIndicator(
                onRefresh: _loadProjectData,
                child: SingleChildScrollView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Project Header
                      _buildProjectHeader(context),

                      const SizedBox(height: 24),

                      // Project Progress
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 20),
                        child: _buildProgressCard(),
                      ),

                      const SizedBox(height: 24),

                      // Description
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 20),
                        child: _buildInfoCard(
                          title: 'Description',
                          content: project.description,
                          icon: Icons.description,
                        ),
                      ),

                      const SizedBox(height: 20),

                      // Team Section
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 20),
                        child: _buildTeamSection(context, project),
                      ),

                      const SizedBox(height: 24),

                      // Tasks Section
                      _buildTasksSection(),

                      const SizedBox(height: 30),
                    ],
                  ),
                ),
              ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder:
                  (context) => CreateTaskScreen(
                    projectId: project.projectId,
                    projectName: project.projectName,
                  ),
              settings: RouteSettings(arguments: {'project': project}),
            ),
          ).then((result) {
            if (result == true) {
              _loadProjectData(); // Refresh data after adding a task
            }
          });
        },
        backgroundColor: Colors.blue.shade700,
        child: const Icon(Icons.add),
      ),
    );
  }

  // Header with project name, status and dates
  Widget _buildProjectHeader(BuildContext context) {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [Colors.blue.shade700, Colors.blue.shade400],
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
        ),
        borderRadius: const BorderRadius.only(
          bottomLeft: Radius.circular(30),
          bottomRight: Radius.circular(30),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.blue.withOpacity(0.3),
            blurRadius: 10,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            project.projectName,
            style: const TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              _buildStatusChip(project.status),
              const SizedBox(width: 10),
              _buildPriorityChip('Cao'),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: const [
                  Icon(Icons.calendar_today, color: Colors.white70),
                  SizedBox(width: 8),
                  Text(
                    "Start Date - End Date",
                    style: TextStyle(color: Colors.white),
                  ),
                ],
              ),
              Text(
                "${_formatDate(project.startDate)} - ${_formatDate(project.endDate)}",
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              TextButton.icon(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder:
                          (context) => CreateTaskScreen(
                            projectId: project.projectId,
                            projectName: project.projectName,
                          ),
                      settings: RouteSettings(arguments: {'project': project}),
                    ),
                  ).then((result) {
                    if (result == true) {
                      _loadProjectData(); // Refresh data after adding a task
                    }
                  });
                },
                icon: const Icon(Icons.add, color: Colors.white),
                label: const Text(
                  "Add task",
                  style: TextStyle(color: Colors.white),
                ),
                style: TextButton.styleFrom(
                  backgroundColor: Colors.white24,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(20),
                  ),
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 8,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // Task list section
  Widget _buildTasksSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Tasks',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Colors.blue.shade700,
                ),
              ),
              TextButton(
                onPressed: () {
                  // Navigate to a dedicated task list screen
                  Navigator.pushNamed(
                    context,
                    '/tasks',
                    arguments: {'projectId': project.projectId},
                  ).then((_) => _loadProjectData());
                },
                child: const Text('All'),
              ),
            ],
          ),
        ),

        FutureBuilder<List<TaskModel>>(
          future: _getTasksByProjectId(project.projectId),
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Center(
                child: Padding(
                  padding: EdgeInsets.all(30.0),
                  child: CircularProgressIndicator(),
                ),
              );
            }

            if (snapshot.hasError) {
              return Center(
                child: Padding(
                  padding: const EdgeInsets.all(30.0),
                  child: Column(
                    children: const [
                      Icon(Icons.error_outline, size: 48, color: Colors.grey),
                      SizedBox(height: 16),
                      Text(
                        'Đã xảy ra lỗi khi tải dữ liệu task',
                        style: TextStyle(color: Colors.grey),
                      ),
                    ],
                  ),
                ),
              );
            }

            final tasks = snapshot.data ?? [];
            if (tasks.isEmpty) {
              return Center(
                child: Padding(
                  padding: const EdgeInsets.all(30.0),
                  child: Column(
                    children: const [
                      Icon(Icons.task_alt, size: 48, color: Colors.grey),
                      SizedBox(height: 16),
                      Text(
                        'Chưa có task nào trong dự án',
                        style: TextStyle(color: Colors.grey),
                      ),
                    ],
                  ),
                ),
              );
            }

            // Limit the number of tasks shown to 3 for preview
            final displayTasks = tasks.length > 3 ? tasks.sublist(0, 3) : tasks;

            return Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: displayTasks.length,
                itemBuilder:
                    (context, index) => _buildTaskCard(displayTasks[index]),
              ),
            );
          },
        ),
      ],
    );
  }

  // Individual task card
  Widget _buildTaskCard(TaskModel task) {
    final subtaskCount = task.subtasks?.length ?? 0;

    // Calculate progress based on subtasks or use a default value
    double taskProgress = 0.0;
    if (subtaskCount > 0 && task.subtasks != null) {
      final completedSubtasks =
          task.subtasks!
              .where((st) => st.status?.toLowerCase() == "completed")
              .length;

      taskProgress = completedSubtasks / subtaskCount;
    } else if (task.status?.toLowerCase() == 'completed') {
      taskProgress = 1.0;
    } else if (task.status?.toLowerCase() == 'in progress') {
      taskProgress = 0.5;
    }

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
      child: InkWell(
        onTap: () {
          // Navigate to task detail screen
          Navigator.pushNamed(
            context,
            '/task-detail',
            arguments: task,
          ).then((_) => _loadProjectData());
        },
        borderRadius: BorderRadius.circular(15),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Text(
                      task.taskName ?? 'No Task Name',
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 18,
                      ),
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      color: _getStatusColor(task.status ?? ''),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      task.status ?? 'N/A',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  const Icon(
                    Icons.person_outline,
                    size: 18,
                    color: Colors.grey,
                  ),
                  const SizedBox(width: 8),
                  Text(
                    task.assigneeEmail ?? 'Chưa phân công',
                    style: TextStyle(color: Colors.grey[600]),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  const Icon(Icons.date_range, size: 18, color: Colors.grey),
                  const SizedBox(width: 8),
                  Text(
                    "${_formatDate(task.startDate)} - ${_formatDate(task.endDate)}",
                    style: TextStyle(color: Colors.grey[600]),
                  ),
                ],
              ),
              if (subtaskCount > 0) ...[
                const SizedBox(height: 8),
                Row(
                  children: [
                    const Icon(
                      Icons.playlist_add_check,
                      size: 18,
                      color: Colors.grey,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      "$subtaskCount subtask",
                      style: TextStyle(color: Colors.grey[600]),
                    ),
                  ],
                ),
              ],
              const SizedBox(height: 10),
              ClipRRect(
                borderRadius: BorderRadius.circular(5),
                child: LinearProgressIndicator(
                  value: taskProgress,
                  backgroundColor: Colors.grey[200],
                  valueColor: AlwaysStoppedAnimation<Color>(
                    _getStatusColor(task.status ?? ''),
                  ),
                  minHeight: 6,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // Project actions bottom sheet
  Widget _buildProjectActions(BuildContext context, ProjectModel project) {
    return Container(
      padding: const EdgeInsets.all(20),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          ListTile(
            leading: CircleAvatar(
              backgroundColor: Colors.blue.shade50,
              child: const Icon(Icons.edit, color: Colors.blue),
            ),
            title: const Text('Chỉnh sửa dự án'),
            onTap: () {
              Navigator.pop(context);
              Navigator.pushNamed(
                context,
                '/editProject',
                arguments: {'project': project},
              ).then((result) {
                if (result == true) {
                  _loadProjectData();
                }
              });
            },
          ),
          ListTile(
            leading: CircleAvatar(
              backgroundColor: Colors.red.shade50,
              child: const Icon(Icons.delete, color: Colors.red),
            ),
            title: const Text('Xóa dự án'),
            onTap: () {
              Navigator.pop(context);
              _showDeleteConfirmation(context);
            },
          ),
          ListTile(
            leading: CircleAvatar(
              backgroundColor: Colors.green.shade50,
              child: const Icon(Icons.share, color: Colors.green),
            ),
            title: const Text('Chia sẻ dự án'),
            onTap: () {
              Navigator.pop(context);
              // Share project functionality
              _shareProject(project);
            },
          ),
        ],
      ),
    );
  }

  // Share project functionality
  void _shareProject(ProjectModel project) {
    // Implement sharing functionality here
    Fluttertoast.showToast(
      msg: "Tính năng chia sẻ dự án đang được phát triển",
      backgroundColor: Colors.blue,
    );
  }

  // Delete confirmation dialog
  void _showDeleteConfirmation(BuildContext context) {
    showDialog(
      context: context,
      builder:
          (context) => AlertDialog(
            title: const Text('Xóa dự án?'),
            content: const Text(
              'Bạn có chắc chắn muốn xóa dự án này? Hành động này không thể hoàn tác.',
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(context),
                child: const Text('Hủy'),
              ),
              TextButton(
                onPressed: () {
                  Navigator.pop(context);
                  _deleteProject(project.projectId).then((success) {
                    if (success) {
                      Navigator.of(
                        context,
                      ).pop(true); // Return to projects list
                    }
                  });
                },
                child: const Text('Xóa', style: TextStyle(color: Colors.red)),
              ),
            ],
          ),
    );
  }

  // Status chip
  Widget _buildStatusChip(String status) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: _getStatusColor(status).withOpacity(0.8),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        status,
        style: const TextStyle(
          color: Colors.white,
          fontWeight: FontWeight.bold,
          fontSize: 14,
        ),
      ),
    );
  }

  // Priority chip
  Widget _buildPriorityChip(String priority) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.redAccent.withOpacity(0.8),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.flag, color: Colors.white, size: 14),
          const SizedBox(width: 4),
          Text(
            priority,
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
              fontSize: 14,
            ),
          ),
        ],
      ),
    );
  }

  // Progress card
  Widget _buildProgressCard() {
    final percentage = (progressPercentage * 100).toInt();

    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Progress',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                Text(
                  '$percentage%',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.blue.shade700,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 15),
            ClipRRect(
              borderRadius: BorderRadius.circular(10),
              child: LinearProgressIndicator(
                value: progressPercentage,
                backgroundColor: Colors.grey[200],
                valueColor: AlwaysStoppedAnimation<Color>(Colors.blue.shade700),
                minHeight: 10,
              ),
            ),
            const SizedBox(height: 15),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _buildStatItem('Tasks Total', totalTasks.toString()),
                _buildStatItem('Completed', completedTasks.toString()),
                _buildStatItem('Over Due', overdueTasks.toString()),
              ],
            ),
          ],
        ),
      ),
    );
  }

  // Statistics item
  Widget _buildStatItem(String label, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          value,
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: Colors.blue.shade700,
          ),
        ),
        Text(label, style: TextStyle(fontSize: 12, color: Colors.grey[600])),
      ],
    );
  }

  // Info card widget
  Widget _buildInfoCard({
    required String title,
    required String content,
    required IconData icon,
  }) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon, color: Colors.blue.shade700),
                const SizedBox(width: 8),
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.blue.shade700,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              content,
              style: TextStyle(fontSize: 16, color: Colors.grey[800]),
            ),
          ],
        ),
      ),
    );
  }

  // Team members section
  Widget _buildTeamSection(BuildContext context, ProjectModel project) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(Icons.people, color: Colors.blue.shade700),
                const SizedBox(width: 8),
                Text(
                  'Groups',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.blue.shade700,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),

            // Owner
            Row(
              children: [
                CircleAvatar(
                  backgroundColor: Colors.blue.shade700,
                  radius: 24,
                  child: Text(
                    project.projectOwnerId.substring(0, 1).toUpperCase(),
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 18,
                    ),
                  ),
                ),
                SizedBox(width: 12),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      project.projectOwnerId,
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                    Text(
                      'Chủ dự án',
                      style: TextStyle(color: Colors.grey[600], fontSize: 14),
                    ),
                  ],
                ),
              ],
            ),

            if (project.members.isNotEmpty) ...[
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 16),
                child: Divider(),
              ),

              Text(
                'Thành viên (${project.members.length})',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  color: Colors.grey[700],
                ),
              ),
              SizedBox(height: 12),

              // Members
              ...project.members.map(
                (member) => Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: Row(
                    children: [
                      CircleAvatar(
                        backgroundColor: Colors.grey.shade300,
                        radius: 18,
                        child: Text(
                          member.substring(0, 1).toUpperCase(),
                          style: TextStyle(
                            color: Colors.black87,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      SizedBox(width: 12),
                      Text(member, style: TextStyle(fontSize: 16)),
                    ],
                  ),
                ),
              ),
            ],

            SizedBox(height: 12),
            OutlinedButton.icon(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => AddMemberToProjectScreen(),
                    settings: RouteSettings(arguments: {'project': project}),
                  ),
                ).then((result) {
                  if (result == true) {
                    // Tải lại dữ liệu khi thêm thành công thành viên
                    _refreshProjectData();
                    Fluttertoast.showToast(
                      msg: "Add Member successfully",
                      backgroundColor: Colors.green,
                    );
                  }
                });
              },
              icon: Icon(Icons.person_add_alt),
              label: Text("Add member"),
              style: OutlinedButton.styleFrom(
                padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
