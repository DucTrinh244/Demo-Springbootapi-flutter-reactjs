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
  bool isLoading = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final args =
        ModalRoute.of(context)!.settings.arguments as Map<String, dynamic>;
    project = args['project'];
  }

  // Hàm để tải lại thông tin dự án từ API
  Future<void> _refreshProjectData() async {
    setState(() {
      isLoading = true;
    });

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
          isLoading = false;
        });
      } else {
        Fluttertoast.showToast(
          msg: "Không thể tải dữ liệu dự án: ${response.reasonPhrase}",
          backgroundColor: Colors.red,
        );
        setState(() {
          isLoading = false;
        });
      }
    } catch (e) {
      Fluttertoast.showToast(msg: "Lỗi: $e", backgroundColor: Colors.red);
      setState(() {
        isLoading = false;
      });
    }
  }

  Future<List<TaskModel>> _getTaskByProjectId(String projectId) async {
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
        // Không có task nào trong dự án
      } else {
        Fluttertoast.showToast(
          msg: "Lỗi: ${response.reasonPhrase}",
          backgroundColor: Colors.red,
        );
      }
    } catch (e) {
      Fluttertoast.showToast(msg: "Lỗi: $e", backgroundColor: Colors.red);
    }

    return [];
  }

  String _formatDate(String? dateString) {
    if (dateString == null || dateString.isEmpty) return 'Không có';
    try {
      final date = DateTime.parse(dateString);
      return DateFormat('dd/MM/yyyy').format(date);
    } catch (e) {
      return dateString;
    }
  }

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
    final screenSize = MediaQuery.of(context).size;

    return Scaffold(
      backgroundColor: Colors.grey[100],
      appBar: AppBar(
        title: Text(
          'Chi tiết dự án',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
        backgroundColor: Colors.blue.shade700,
        elevation: 0,
        actions: [
          IconButton(
            icon: Icon(Icons.more_vert),
            onPressed: () {
              showModalBottomSheet(
                context: context,
                shape: RoundedRectangleBorder(
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
              ? Center(child: CircularProgressIndicator())
              : SingleChildScrollView(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Header
                    Container(
                      width: double.infinity,
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [Colors.blue.shade700, Colors.blue.shade400],
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                        ),
                        borderRadius: BorderRadius.only(
                          bottomLeft: Radius.circular(30),
                          bottomRight: Radius.circular(30),
                        ),
                        boxShadow: [
                          BoxShadow(
                            // ignore: deprecated_member_use
                            color: Colors.blue.withOpacity(0.3),
                            blurRadius: 10,
                            offset: Offset(0, 5),
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
                                children: [
                                  Icon(
                                    Icons.calendar_today,
                                    color: Colors.white70,
                                  ),
                                  SizedBox(width: 8),
                                  Text(
                                    "${_formatDate(project.startDate)} - ${_formatDate(project.endDate)}",
                                    style: TextStyle(color: Colors.white),
                                  ),
                                ],
                              ),
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
                                      settings: RouteSettings(
                                        arguments: {'project': project},
                                      ),
                                    ),
                                  ).then((result) {
                                    if (result == true) {}
                                  });
                                },
                                icon: Icon(Icons.add, color: Colors.white),
                                label: Text(
                                  "Thêm Task",
                                  style: TextStyle(color: Colors.white),
                                ),
                                style: TextButton.styleFrom(
                                  backgroundColor: Colors.white24,
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(20),
                                  ),
                                  padding: EdgeInsets.symmetric(
                                    horizontal: 16,
                                    vertical: 8,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 24),

                    // Project Progress
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 20),
                      child: _buildProgressCard(0.65), // Example progress value
                    ),

                    const SizedBox(height: 24),

                    // Description
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 20),
                      child: _buildInfoCard(
                        title: 'Mô tả dự án',
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
                    // Tasks
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 20),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Danh sách Task',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                              color: Colors.blue.shade700,
                            ),
                          ),
                          TextButton(
                            onPressed: () {
                              // TODO: View all tasks
                            },
                            child: Text('Xem tất cả'),
                          ),
                        ],
                      ),
                    ),

                    FutureBuilder<List<TaskModel>>(
                      future: _getTaskByProjectId(project.projectId),
                      builder: (context, snapshot) {
                        if (snapshot.connectionState ==
                            ConnectionState.waiting) {
                          return Center(
                            child: Padding(
                              padding: const EdgeInsets.all(30.0),
                              child: CircularProgressIndicator(),
                            ),
                          );
                        }

                        if (snapshot.hasError || snapshot.data == null) {
                          return Center(
                            child: Padding(
                              padding: const EdgeInsets.all(30.0),
                              child: Column(
                                children: [
                                  Icon(
                                    Icons.error_outline,
                                    size: 48,
                                    color: Colors.grey,
                                  ),
                                  SizedBox(height: 16),
                                  Text(
                                    'Không thể tải task',
                                    style: TextStyle(color: Colors.grey),
                                  ),
                                ],
                              ),
                            ),
                          );
                        }

                        final tasks = snapshot.data!;
                        if (tasks.isEmpty) {
                          return Center(
                            child: Padding(
                              padding: const EdgeInsets.all(30.0),
                              child: Column(
                                children: [
                                  Icon(
                                    Icons.task_alt,
                                    size: 48,
                                    color: Colors.grey,
                                  ),
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

                        return Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 20),
                          child: ListView.builder(
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            itemCount: tasks.length,
                            itemBuilder: (context, index) {
                              final task = tasks[index];
                              final subtaskCount = task.subtasks?.length ?? 0;

                              return Card(
                                margin: const EdgeInsets.only(bottom: 12),
                                elevation: 2,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(15),
                                ),
                                child: InkWell(
                                  onTap: () {
                                    // TODO: Navigate to task detail
                                    Fluttertoast.showToast(
                                      msg: "Xem chi tiết task",
                                    );
                                  },
                                  borderRadius: BorderRadius.circular(15),
                                  child: Padding(
                                    padding: const EdgeInsets.all(16.0),
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        Row(
                                          mainAxisAlignment:
                                              MainAxisAlignment.spaceBetween,
                                          children: [
                                            Expanded(
                                              child: Text(
                                                task.taskName ?? 'No Task Name',
                                                style: TextStyle(
                                                  fontWeight: FontWeight.bold,
                                                  fontSize: 18,
                                                ),
                                              ),
                                            ),
                                            Container(
                                              padding: EdgeInsets.symmetric(
                                                horizontal: 12,
                                                vertical: 6,
                                              ),
                                              decoration: BoxDecoration(
                                                color: _getStatusColor(
                                                  task.status ?? '',
                                                ),
                                                borderRadius:
                                                    BorderRadius.circular(20),
                                              ),
                                              child: Text(
                                                task.status ?? 'N/A',
                                                style: TextStyle(
                                                  color: Colors.white,
                                                  fontSize: 12,
                                                  fontWeight: FontWeight.bold,
                                                ),
                                              ),
                                            ),
                                          ],
                                        ),
                                        SizedBox(height: 12),
                                        Row(
                                          children: [
                                            Icon(
                                              Icons.person_outline,
                                              size: 18,
                                              color: Colors.grey,
                                            ),
                                            SizedBox(width: 8),
                                            Text(
                                              task.assigneeEmail ??
                                                  'Chưa phân công',
                                              style: TextStyle(
                                                color: Colors.grey[600],
                                              ),
                                            ),
                                          ],
                                        ),
                                        SizedBox(height: 8),
                                        Row(
                                          children: [
                                            Icon(
                                              Icons.date_range,
                                              size: 18,
                                              color: Colors.grey,
                                            ),
                                            SizedBox(width: 8),
                                            Text(
                                              "${_formatDate(task.startDate)} - ${_formatDate(task.endDate)}",
                                              style: TextStyle(
                                                color: Colors.grey[600],
                                              ),
                                            ),
                                          ],
                                        ),
                                        if (subtaskCount > 0) ...[
                                          SizedBox(height: 8),
                                          Row(
                                            children: [
                                              Icon(
                                                Icons.playlist_add_check,
                                                size: 18,
                                                color: Colors.grey,
                                              ),
                                              SizedBox(width: 8),
                                              Text(
                                                "$subtaskCount subtask",
                                                style: TextStyle(
                                                  color: Colors.grey[600],
                                                ),
                                              ),
                                            ],
                                          ),
                                        ],
                                        SizedBox(height: 10),
                                        LinearProgressIndicator(
                                          value: 0.7, // Example progress value
                                          backgroundColor: Colors.grey[200],
                                          valueColor: AlwaysStoppedAnimation<
                                            Color
                                          >(_getStatusColor(task.status ?? '')),
                                          borderRadius: BorderRadius.circular(
                                            5,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                              );
                            },
                          ),
                        );
                      },
                    ),
                    const SizedBox(height: 30),
                  ],
                ),
              ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // TODO: Add new task
          // Fluttertoast.showToast(msg: "Thêm task mới");
        },
        backgroundColor: Colors.blue.shade700,
        child: Icon(Icons.add),
      ),
    );
  }

  Widget _buildProjectActions(BuildContext context, ProjectModel project) {
    return Container(
      padding: EdgeInsets.all(20),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          ListTile(
            leading: CircleAvatar(
              backgroundColor: Colors.blue.shade50,
              child: Icon(Icons.edit, color: Colors.blue),
            ),
            title: Text('Chỉnh sửa dự án'),
            onTap: () {
              Navigator.pop(context);
            },
          ),
          ListTile(
            leading: CircleAvatar(
              backgroundColor: Colors.red.shade50,
              child: Icon(Icons.delete, color: Colors.red),
            ),
            title: Text('Xóa dự án'),
            onTap: () {
              Navigator.pop(context);
              _showDeleteConfirmation(context);
            },
          ),
          ListTile(
            leading: CircleAvatar(
              backgroundColor: Colors.green.shade50,
              child: Icon(Icons.share, color: Colors.green),
            ),
            title: Text('Chia sẻ dự án'),
            onTap: () {
              Navigator.pop(context);
              // TODO: Share project
            },
          ),
        ],
      ),
    );
  }

  void _showDeleteConfirmation(BuildContext context) {
    showDialog(
      context: context,
      builder:
          (context) => AlertDialog(
            title: Text('Xóa dự án?'),
            content: Text(
              'Bạn có chắc chắn muốn xóa dự án này? Hành động này không thể hoàn tác.',
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(context),
                child: Text('Hủy'),
              ),
              TextButton(
                onPressed: () {
                  Navigator.pop(context);
                  // TODO: Delete project
                  Fluttertoast.showToast(msg: "Đã xóa dự án");
                },
                child: Text('Xóa', style: TextStyle(color: Colors.red)),
              ),
            ],
          ),
    );
  }

  Widget _buildStatusChip(String status) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: _getStatusColor(status).withOpacity(0.8),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        status,
        style: TextStyle(
          color: Colors.white,
          fontWeight: FontWeight.bold,
          fontSize: 14,
        ),
      ),
    );
  }

  Widget _buildPriorityChip(String priority) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.redAccent.withOpacity(0.8),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(Icons.flag, color: Colors.white, size: 14),
          SizedBox(width: 4),
          Text(
            priority,
            style: TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
              fontSize: 14,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProgressCard(double progressValue) {
    final percentage = (progressValue * 100).toInt();

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
                Text(
                  'Tiến độ dự án',
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
            SizedBox(height: 15),
            ClipRRect(
              borderRadius: BorderRadius.circular(10),
              child: LinearProgressIndicator(
                value: progressValue,
                backgroundColor: Colors.grey[200],
                valueColor: AlwaysStoppedAnimation<Color>(Colors.blue.shade700),
                minHeight: 10,
              ),
            ),
            SizedBox(height: 15),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _buildStatItem('Tổng số task', '12'), // Example value
                _buildStatItem('Hoàn thành', '8'), // Example value
                _buildStatItem('Quá hạn', '2'), // Example value
              ],
            ),
          ],
        ),
      ),
    );
  }

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
                SizedBox(width: 8),
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
            SizedBox(height: 12),
            Text(
              content,
              style: TextStyle(fontSize: 16, color: Colors.grey[800]),
            ),
          ],
        ),
      ),
    );
  }

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
                SizedBox(width: 8),
                Text(
                  'Nhóm dự án',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.blue.shade700,
                  ),
                ),
              ],
            ),
            SizedBox(height: 20),

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
                      msg: "Đã thêm thành viên thành công",
                      backgroundColor: Colors.green,
                    );
                  }
                });
              },
              icon: Icon(Icons.person_add_alt),
              label: Text("Thêm thành viên"),
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
