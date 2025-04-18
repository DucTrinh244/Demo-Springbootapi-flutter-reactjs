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
        appBar: AppBar(
          backgroundColor: Colors.white,
          elevation: 2,
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
          bottom: TabBar(
            labelColor: Colors.deepPurple,
            unselectedLabelColor: Colors.black54,
            indicatorColor: Colors.deepPurple,
            tabs: [Tab(text: 'Dự án của tôi'), Tab(text: 'Tôi tạo')],
          ),
        ),
        drawer: CustomDrawer(),
        body: TabBarView(
          children: [
            ProjectListView(projectType: 'member'),
            ProjectListView(projectType: 'creator'),
          ],
        ),
        floatingActionButton: FloatingActionButton(
          backgroundColor: Colors.deepPurple,
          onPressed: () {
            Navigator.pushNamed(context, '/add-project');
          },
          child: Icon(Icons.add, color: Colors.white),
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
          // msg: "Lỗi ${response.statusCode}: ${response.reasonPhrase}",
          msg: "Lỗi $baseUrl$endpoint: ${response.reasonPhrase}",
          toastLength: Toast.LENGTH_SHORT,
          gravity: ToastGravity.BOTTOM,
          backgroundColor: Colors.red,
          textColor: Colors.white,
        );
      }
    } catch (e) {
      Fluttertoast.showToast(
        msg: "Lỗi: $e",
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
          return Center(child: CircularProgressIndicator());
        }

        if (snapshot.hasError) {
          return Center(child: Text('Đã xảy ra lỗi!'));
        }

        final projects = snapshot.data ?? [];

        if (projects.isEmpty) {
          return Center(child: Text('Không có dự án nào.'));
        }

        return ListView.builder(
          padding: EdgeInsets.all(16.0),
          itemCount: projects.length,
          itemBuilder: (context, index) {
            final project = projects[index];
            return Column(
              children: [ProjectCard(project: project), SizedBox(height: 16)],
            );
          },
        );
      },
    );
  }
}

class ProjectCard extends StatelessWidget {
  final ProjectModel project;

  const ProjectCard({super.key, required this.project});

  @override
  Widget build(BuildContext context) {
    double progress =
        project.status == 'Completed'
            ? 1.0
            : project.status == 'In Progress'
            ? 0.5
            : 0.2;

    return GestureDetector(
      onTap: () {
        Navigator.pushNamed(
          context,
          '/detail-project',
          arguments: {'project': project},
        );
      },
      child: Card(
        elevation: 6,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        child: Padding(
          padding: EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Các dòng dưới đây giữ nguyên
              Row(
                children: [
                  Icon(Icons.art_track, size: 40, color: Colors.deepPurple),
                  SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      project.projectName,
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Colors.deepPurple,
                      ),
                    ),
                  ),
                  IconButton(
                    icon: Icon(Icons.edit, color: Colors.deepPurple),
                    onPressed: () {
                      // Chỉnh sửa
                    },
                  ),
                  IconButton(
                    icon: Icon(Icons.delete, color: Colors.deepPurple),
                    onPressed: () {
                      // Xóa
                    },
                  ),
                ],
              ),
              SizedBox(height: 12),
              Row(
                children: [
                  Icon(Icons.calendar_today, size: 16, color: Colors.grey),
                  SizedBox(width: 4),
                  Text(
                    '${project.startDate} - ${project.endDate}',
                    style: TextStyle(color: Colors.grey),
                  ),
                ],
              ),
              SizedBox(height: 12),
              Row(
                children: [
                  Icon(Icons.person, size: 16, color: Colors.grey),
                  SizedBox(width: 4),
                  Text(
                    'Người tạo: ${project.projectOwnerId}',
                    style: TextStyle(color: Colors.grey),
                  ),
                ],
              ),
              SizedBox(height: 12),
              Row(
                children: [
                  Icon(Icons.check_circle, size: 16, color: Colors.grey),
                  SizedBox(width: 4),
                  Text(
                    'Trạng thái: ${project.status}',
                    style: TextStyle(
                      color:
                          project.status == 'Completed'
                              ? Colors.green
                              : project.status == 'In Progress'
                              ? Colors.orange
                              : Colors.red,
                    ),
                  ),
                ],
              ),
              SizedBox(height: 16),
              LinearProgressIndicator(
                value: progress,
                minHeight: 6,
                backgroundColor: Colors.grey[300],
                valueColor: AlwaysStoppedAnimation<Color>(
                  project.status == 'Completed'
                      ? Colors.green
                      : project.status == 'In Progress'
                      ? Colors.orange
                      : Colors.red,
                ),
              ),
              SizedBox(height: 12),
            ],
          ),
        ),
      ),
    );
  }
}
