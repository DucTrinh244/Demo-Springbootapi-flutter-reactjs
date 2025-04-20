import 'package:flutter/material.dart';
import 'package:flutter_managementproject/screens/models/RoomModel.dart';

class GroupInfoScreen extends StatelessWidget {
  final RoomModel room;

  const GroupInfoScreen({super.key, required this.room});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FD),
      appBar: AppBar(
        title: const Text(
          'Group Info',
          style: TextStyle(fontWeight: FontWeight.w600),
        ),
        backgroundColor: Colors.blueAccent,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.edit),
            onPressed: () {
              // Implement edit functionality
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildHeaderSection(context),
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildSectionHeader('Group Information'),
                  const SizedBox(height: 12),
                  _buildInfoCard(),
                  const SizedBox(height: 24),
                  _buildSectionHeader('Members (${room.members.length})'),
                  const SizedBox(height: 12),
                  _buildMembersList(),
                ],
              ),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: Colors.blueAccent,
        child: const Icon(Icons.person_add),
        onPressed: () {
          // Implement add member functionality
        },
      ),
    );
  }

  Widget _buildHeaderSection(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.only(bottom: 24),
      decoration: const BoxDecoration(
        color: Colors.blueAccent,
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(32),
          bottomRight: Radius.circular(32),
        ),
      ),
      child: Column(
        children: [
          const SizedBox(height: 16),
          CircleAvatar(
            radius: 45,
            backgroundColor: Colors.white,
            child: Text(
              room.roomName.substring(0, 1).toUpperCase(),
              style: const TextStyle(
                fontSize: 32,
                fontWeight: FontWeight.bold,
                color: Colors.blueAccent,
              ),
            ),
          ),
          const SizedBox(height: 16),
          Text(
            room.roomName,
            style: const TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            'Created by ${room.members.first}',
            style: const TextStyle(fontSize: 14, color: Colors.white70),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Row(
      children: [
        Text(
          title,
          style: const TextStyle(
            fontWeight: FontWeight.w600,
            fontSize: 18,
            color: Colors.black87,
          ),
        ),
        const Expanded(child: Divider(indent: 12, color: Colors.black26)),
      ],
    );
  }

  Widget _buildInfoCard() {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [_buildInfoRow(Icons.group, 'Group Name', room.roomName)],
        ),
      ),
    );
  }

  Widget _buildInfoRow(IconData icon, String label, String value) {
    return Row(
      children: [
        Icon(icon, color: Colors.blueAccent, size: 20),
        const SizedBox(width: 12),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              label,
              style: const TextStyle(fontSize: 14, color: Colors.black54),
            ),
            const SizedBox(height: 4),
            Text(
              value,
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildMembersList() {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 8),
        child: Column(
          children: [
            // Hiển thị thành viên đầu tiên là người tạo
            _buildMemberTile(room.members.first, isCreator: true),
            if (room.members.length > 1) const Divider(height: 1, indent: 70),
            // Hiển thị các thành viên còn lại
            ...room.members
                .skip(1)
                .map((member) => _buildMemberTile(member, isCreator: false)),
          ],
        ),
      ),
    );
  }

  Widget _buildMemberTile(String name, {required bool isCreator}) {
    return ListTile(
      leading: CircleAvatar(
        backgroundColor:
            isCreator ? Colors.green : Colors.blueAccent.withOpacity(0.8),
        child: Text(
          name.substring(0, 1).toUpperCase(),
          style: const TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      title: Text(
        name,
        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
      ),
      subtitle: Text(
        isCreator ? 'Group Creator' : 'Member',
        style: TextStyle(
          fontSize: 12,
          color: isCreator ? Colors.green : Colors.black54,
        ),
      ),
      trailing: PopupMenuButton(
        icon: const Icon(Icons.more_vert),
        itemBuilder:
            (context) => [
              if (!isCreator)
                PopupMenuItem(
                  value: 'remove',
                  child: Row(
                    children: const [
                      Icon(
                        Icons.remove_circle_outline,
                        color: Colors.redAccent,
                        size: 20,
                      ),
                      SizedBox(width: 8),
                      Text('Remove'),
                    ],
                  ),
                ),
            ],
        onSelected: (value) {
          // Implement menu actions
        },
      ),
    );
  }
}
