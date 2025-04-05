import 'package:flutter/material.dart';

class MainChatScreen extends StatelessWidget {
  const MainChatScreen({super.key});

  // Danh sách nhóm mẫu
  final List<Map<String, String>> groupChats = const [
    {"name": "Flutter Developers"},
    {"name": "Team Alpha"},
    {"name": "Design Squad"},
    {"name": "Backend Ninjas"},
    {"name": "UI/UX Lovers"},
    {"name": "Marketing Team"},
    {"name": "Study Buddies"},
    {"name": "Music Fans"},
    {"name": "Project X"},
    {"name": "Startup Hub"},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Group Chats'),
        centerTitle: true,
        backgroundColor: Colors.blueAccent,
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(12),
        itemCount: groupChats.length,
        itemBuilder: (context, index) {
          final group = groupChats[index];
          return _buildGroupCard(context, group['name']!);
        },
      ),
    );
  }

  // Widget cho từng nhóm chat
  Widget _buildGroupCard(BuildContext context, String groupName) {
    return GestureDetector(
      onTap: () {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Clicked on "$groupName"')));
      },
      child: Card(
        elevation: 4,
        margin: const EdgeInsets.symmetric(vertical: 8),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        child: ListTile(
          contentPadding: const EdgeInsets.symmetric(
            horizontal: 16,
            vertical: 12,
          ),
          leading: CircleAvatar(
            radius: 28,
            backgroundColor: Colors.blueAccent,
            child: Text(
              groupName[0], // Ký tự đầu tiên
              style: const TextStyle(
                color: Colors.white,
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          title: Text(
            groupName,
            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
          ),
          trailing: const Icon(Icons.arrow_forward_ios_rounded),
        ),
      ),
    );
  }
}
