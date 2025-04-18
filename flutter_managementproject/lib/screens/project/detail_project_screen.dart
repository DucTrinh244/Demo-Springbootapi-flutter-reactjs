import 'package:flutter/material.dart';
import 'package:flutter_managementproject/screens/models/ProjectModel.dart';

class DetailProjectScreen extends StatelessWidget {
  const DetailProjectScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final args =
        ModalRoute.of(context)!.settings.arguments as Map<String, dynamic>;
    final ProjectModel project = args['project'];

    return Scaffold(
      appBar: AppBar(
        title: Text('Chi tiết dự án'),
        centerTitle: true,
        backgroundColor: Colors.blueAccent,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Tiêu đề dự án
            Text(
              project.projectName,
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Colors.blueAccent,
              ),
            ),
            SizedBox(height: 8),
            Text(
              project.description ?? 'Không có mô tả dự án',
              style: TextStyle(fontSize: 16, color: Colors.grey[700]),
            ),
            SizedBox(height: 16),

            // Trạng thái và độ ưu tiên
            Row(
              children: [
                Chip(
                  label: Text(
                    project.status,
                    style: TextStyle(color: Colors.white),
                  ),
                  backgroundColor:
                      project.status == 'Completed'
                          ? Colors.green
                          : project.status == 'In Progress'
                          ? Colors.orange
                          : Colors.red,
                ),
                SizedBox(width: 8),
                Chip(
                  label: Text(
                    'High Priority',
                    style: TextStyle(color: Colors.white),
                  ),
                  backgroundColor: Colors.redAccent,
                ),
              ],
            ),
            SizedBox(height: 16),

            // Thành viên
            Text(
              'Người tạo',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Colors.blueAccent,
              ),
            ),
            SizedBox(height: 8),
            ListTile(
              leading: CircleAvatar(
                backgroundColor: Colors.blueAccent,
                child: Text(
                  project.projectOwnerId
                      .toString()
                      .substring(0, 1)
                      .toUpperCase(),
                  style: TextStyle(color: Colors.white),
                ),
              ),
              title: Text('ID: ${project.projectOwnerId}'),
              subtitle: Text('Chủ dự án'),
            ),
            SizedBox(height: 16),

            // Thời gian
            Text(
              'Thời gian',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Colors.blueAccent,
              ),
            ),
            SizedBox(height: 8),
            ListTile(
              leading: Icon(Icons.calendar_today, color: Colors.blueAccent),
              title: Text('Bắt đầu: ${project.startDate}'),
            ),
            ListTile(
              leading: Icon(Icons.calendar_today, color: Colors.blueAccent),
              title: Text('Kết thúc: ${project.endDate}'),
            ),
            SizedBox(height: 16),

            // Nút thao tác
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                ElevatedButton.icon(
                  onPressed: () {
                    // Hàm chỉnh sửa
                  },
                  icon: Icon(Icons.edit),
                  label: Text('Chỉnh sửa'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.blueAccent,
                  ),
                ),
                ElevatedButton.icon(
                  onPressed: () {
                    // Hàm xóa
                  },
                  icon: Icon(Icons.delete),
                  label: Text('Xóa'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.redAccent,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
