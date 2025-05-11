import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_managementproject/Services/globals.dart';
import 'package:flutter_managementproject/screens/models/ProjectModel.dart';
import 'package:flutter_managementproject/widgets/customer_drawer.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:http/http.dart' as http;

class MainProjectScreen extends StatelessWidget {
  const MainProjectScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        backgroundColor: Colors.grey[100],
        appBar: AppBar(
          title: const Text(
            "Projects",
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 22),
          ),
          actions: [
            CircleAvatar(
              radius: 18,
              backgroundColor: Colors.indigo.shade100,
              child: const Icon(Icons.person, color: Colors.indigo),
            ),
            const SizedBox(width: 16),
          ],
          elevation: 0,
          backgroundColor: Colors.white,
          foregroundColor: const Color(0xFF2D3748),

          bottom: TabBar(
            labelColor: Colors.indigo,
            unselectedLabelColor: Colors.grey,
            indicatorColor: Colors.indigo,
            indicatorWeight: 3,
            labelStyle: const TextStyle(
              fontWeight: FontWeight.bold,
              letterSpacing: 0.5,
            ),
            tabs: const [
              Tab(text: 'MY PROJECTS'),
              Tab(text: 'CREATED PROJECTS'),
            ],
          ),
        ),
        drawer: const CustomDrawer(),
        body: const TabBarView(
          children: [
            ProjectListView(projectType: 'member'),
            ProjectListView(projectType: 'creator'),
          ],
        ),
        floatingActionButton: FloatingActionButton.extended(
          backgroundColor: Colors.deepPurple,
          onPressed: () {
            Navigator.pushNamed(context, '/add-project');
          },
          icon: const Icon(Icons.add, color: Colors.white),
          label: const Text(
            'NEW PROJECT',
            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
          ),
        ),
      ),
    );
  }
}

class ProjectListView extends StatelessWidget {
  final String projectType;

  const ProjectListView({super.key, required this.projectType});

  Future<List<ProjectModel>> _getProjects(BuildContext context) async {
    try {
      final endpoint =
          projectType == 'creator'
              ? '/api/projects/created-projects'
              : '/api/projects/my-project';

      final response = await http.get(
        Uri.parse('$baseUrl$endpoint'),
        headers: await getAuthHeaders(),
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((e) => ProjectModel.fromJson(e)).toList();
      } else {
        Fluttertoast.showToast(
          msg: "Error $baseUrl$endpoint: ${response.reasonPhrase}",
          toastLength: Toast.LENGTH_SHORT,
          gravity: ToastGravity.BOTTOM,
          backgroundColor: Colors.red,
          textColor: Colors.white,
        );
      }
    } catch (e) {
      Fluttertoast.showToast(
        msg: "Error: $e",
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.BOTTOM,
        backgroundColor: Colors.red,
        textColor: Colors.white,
      );
    }

    return [];
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<ProjectModel>>(
      future: _getProjects(context),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(
            child: CircularProgressIndicator(
              valueColor: AlwaysStoppedAnimation<Color>(Colors.deepPurple),
            ),
          );
        }

        if (snapshot.hasError) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.error_outline, color: Colors.red, size: 60),
                const SizedBox(height: 16),
                Text(
                  'An error occurred!',
                  style: TextStyle(
                    fontSize: 18,
                    color: Colors.grey[800],
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Please try again later',
                  style: TextStyle(fontSize: 16, color: Colors.grey[600]),
                ),
              ],
            ),
          );
        }

        final projects = snapshot.data ?? [];

        if (projects.isEmpty) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  projectType == 'creator'
                      ? Icons.create_new_folder
                      : Icons.folder_open,
                  color: Colors.grey[400],
                  size: 80,
                ),
                const SizedBox(height: 16),
                Text(
                  projectType == 'creator'
                      ? 'No created projects yet'
                      : 'No projects assigned to you',
                  style: TextStyle(
                    fontSize: 18,
                    color: Colors.grey[800],
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  projectType == 'creator'
                      ? 'Create a new project to get started'
                      : 'Projects you are assigned to will appear here',
                  style: TextStyle(fontSize: 16, color: Colors.grey[600]),
                ),
              ],
            ),
          );
        }

        return ListView.builder(
          padding: const EdgeInsets.all(16.0),
          itemCount: projects.length,
          itemBuilder: (context, index) {
            final project = projects[index];
            return Column(
              children: [
                ProjectCard(project: project),
                const SizedBox(height: 16),
              ],
            );
          },
        );
      },
    );
  }
}

class ProjectCard extends StatefulWidget {
  final ProjectModel project;

  const ProjectCard({super.key, required this.project});

  @override
  // ignore: library_private_types_in_public_api
  _ProjectCardState createState() => _ProjectCardState();
}

class _ProjectCardState extends State<ProjectCard> {
  String? currentEmail;
  Color getStatusColor() {
    switch (widget.project.status) {
      case 'Completed' || 'completed':
        return Colors.green;
      case 'In Progress' || 'in progress':
        return Colors.orange;

      default:
        return Colors.red;
    }
  }

  IconData getStatusIcon() {
    switch (widget.project.status) {
      case 'Completed' || 'completed':
        return Icons.check_circle;
      case 'In Progress' || 'in progress':
        return Icons.timelapse;
      default:
        return Icons.pending;
    }
  }

  double getProgressValue() {
    switch (widget.project.status) {
      case 'Completed' || 'completed':
        return 1.0;
      case 'In Progress' || 'in progress':
        return 0.5;
      default:
        return 0.2;
    }
  }

  @override
  void initState() {
    super.initState();
    getEmail().then((email) {
      setState(() {
        currentEmail = email;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    final bool isOwner = currentEmail == widget.project.projectOwnerId;
    final statusColor = getStatusColor();
    final statusIcon = getStatusIcon();
    final progressValue = getProgressValue();

    return GestureDetector(
      onTap: () {
        Navigator.pushNamed(
          context,
          isOwner ? '/detail-project' : '/detail-project-over',
          arguments: {'project': widget.project},
        );
      },
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.2),
              spreadRadius: 1,
              blurRadius: 6,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Project header with color strip based on status
            Container(
              height: 10,
              decoration: BoxDecoration(
                color: statusColor,
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(16),
                  topRight: Radius.circular(16),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: Colors.deepPurple.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Icon(
                          Icons.auto_awesome,
                          size: 24,
                          color: Colors.deepPurple,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          widget.project.projectName,
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: Colors.deepPurple,
                          ),
                        ),
                      ),
                      if (isOwner)
                        PopupMenuButton<String>(
                          icon: const Icon(Icons.more_vert, color: Colors.grey),
                          onSelected: (value) {
                            if (value == 'edit') {
                              // Handle edit
                            } else if (value == 'delete') {
                              showDialog(
                                context: context,
                                builder: (BuildContext context) {
                                  return AlertDialog(
                                    title: const Text('Confirm Delete'),
                                    content: const Text(
                                      'Are you sure you want to delete this project?',
                                    ),
                                    actions: [
                                      TextButton(
                                        onPressed: () {
                                          Navigator.of(context).pop();
                                        },
                                        child: const Text('Cancel'),
                                      ),
                                      TextButton(
                                        onPressed: () {
                                          Navigator.of(context).pop();
                                          // Handle delete action
                                        },
                                        child: const Text(
                                          'Delete',
                                          style: TextStyle(color: Colors.red),
                                        ),
                                      ),
                                    ],
                                  );
                                },
                              );
                            }
                          },
                          itemBuilder:
                              (BuildContext context) => [
                                const PopupMenuItem<String>(
                                  value: 'edit',
                                  child: Row(
                                    children: [
                                      Icon(
                                        Icons.edit,
                                        color: Colors.blue,
                                        size: 18,
                                      ),
                                      SizedBox(width: 8),
                                      Text('Edit Project'),
                                    ],
                                  ),
                                ),
                                const PopupMenuItem<String>(
                                  value: 'delete',
                                  child: Row(
                                    children: [
                                      Icon(
                                        Icons.delete,
                                        color: Colors.red,
                                        size: 18,
                                      ),
                                      SizedBox(width: 8),
                                      Text('Delete Project'),
                                    ],
                                  ),
                                ),
                              ],
                        ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Container(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    child: Row(
                      children: [
                        Expanded(
                          child: Row(
                            children: [
                              const Icon(
                                Icons.calendar_today,
                                size: 16,
                                color: Colors.grey,
                              ),
                              const SizedBox(width: 6),
                              Flexible(
                                child: Text(
                                  '${widget.project.startDate} - ${widget.project.endDate}',
                                  style: const TextStyle(color: Colors.grey),
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                            ],
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 10,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: statusColor.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Row(
                            children: [
                              Icon(statusIcon, size: 14, color: statusColor),
                              const SizedBox(width: 4),
                              Text(
                                widget.project.status,
                                style: TextStyle(
                                  color: statusColor,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 12,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      const Icon(Icons.person, size: 16, color: Colors.grey),
                      const SizedBox(width: 6),
                      Text(
                        'Owner: ${widget.project.projectOwnerId}',
                        style: const TextStyle(color: Colors.grey),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'Progress',
                            style: TextStyle(
                              fontWeight: FontWeight.w500,
                              color: Colors.grey,
                            ),
                          ),
                          Text(
                            '${(progressValue * 100).toInt()}%',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              color: statusColor,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      ClipRRect(
                        borderRadius: BorderRadius.circular(10),
                        child: LinearProgressIndicator(
                          value: progressValue,
                          minHeight: 8,
                          backgroundColor: Colors.grey[200],
                          valueColor: AlwaysStoppedAnimation<Color>(
                            statusColor,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
