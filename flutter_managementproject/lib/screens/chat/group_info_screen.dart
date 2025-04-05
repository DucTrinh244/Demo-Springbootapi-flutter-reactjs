import 'package:flutter/material.dart';

class GroupInfoScreen extends StatelessWidget {
  final String groupName;

  const GroupInfoScreen({super.key, required this.groupName});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF2F5F9),
      appBar: AppBar(
        title: const Text('Group Info'),
        backgroundColor: Colors.blueAccent,
        elevation: 0,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildSectionTitle('Group Name'),
            const SizedBox(height: 10),
            Card(
              elevation: 3,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              child: ListTile(
                leading: const Icon(Icons.group, color: Colors.blueAccent),
                title: Text(
                  groupName,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 24),
            _buildSectionTitle('Members'),
            const SizedBox(height: 10),
            _buildMemberTile('You', Icons.person),
            _buildMemberTile('Member A', Icons.person_outline),
            _buildMemberTile('Member B', Icons.person_outline),
            // Có thể dùng ListView.builder cho dữ liệu động
          ],
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: const TextStyle(
        fontWeight: FontWeight.bold,
        fontSize: 20,
        color: Colors.black87,
      ),
    );
  }

  Widget _buildMemberTile(String name, IconData icon) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 6),
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: Colors.blueAccent,
          child: Icon(icon, color: Colors.white),
        ),
        title: Text(name, style: const TextStyle(fontSize: 16)),
        trailing: const Icon(Icons.more_vert),
      ),
    );
  }
}
