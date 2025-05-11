import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_managementproject/Services/globals.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class CustomDrawer extends StatefulWidget {
  const CustomDrawer({super.key});

  @override
  State<CustomDrawer> createState() => _CustomDrawerState();
}

class _CustomDrawerState extends State<CustomDrawer> {
  String name = '';
  String email = '';
  String avatarUrl = '';

  @override
  void initState() {
    super.initState();
    fetchUserData();
  }

  Future<void> fetchUserData() async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/users/profile'),
      headers: await getAuthHeaders(),
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      setState(() {
        name = data['name'] ?? 'No name';
        email = data['email'] ?? 'No email';
      });
    } else {
      // Xử lý lỗi
      setState(() {
        name = 'Unknown';
        email = 'Unknown';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        children: [
          UserAccountsDrawerHeader(
            accountName: Text(name),
            accountEmail: Text(email),
            currentAccountPicture: CircleAvatar(
              backgroundImage:
                  avatarUrl.isNotEmpty ? NetworkImage(avatarUrl) : null,
              child: avatarUrl.isEmpty ? Icon(Icons.person) : null,
            ),
          ),
          ListTile(
            title: Text('Home'),
            leading: Icon(Icons.dashboard),
            onTap: () {
              Navigator.pushNamed(context, '/dashboard');
            },
          ),
          ListTile(
            title: Text('Projects'),
            leading: Icon(Icons.folder_outlined),
            onTap: () {
              Navigator.pushNamed(context, '/project');
            },
          ),
          ListTile(
            title: Text('Tasks'),
            leading: Icon(Icons.task_alt),
            onTap: () {
              Navigator.pushNamed(context, '/task');
            },
          ),
          ListTile(
            title: Text('Chats'),
            leading: Icon(Icons.chat),
            onTap: () {
              Navigator.pushNamed(context, '/main-chat');
            },
          ),
          ListTile(
            title: Text('Profile'),
            leading: Icon(Icons.person),
            onTap: () {
              Navigator.pushNamed(context, '/profile');
            },
          ),
          ListTile(
            title: Text('Log Out'),
            leading: Icon(Icons.exit_to_app),
            onTap: () async {
              SharedPreferences prefs = await SharedPreferences.getInstance();
              await prefs.remove('jwtToken');
              await prefs.remove('email');

              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('👋 Đã đăng xuất thành công!'),
                  backgroundColor: Colors.blue,
                ),
              );

              Navigator.pushNamedAndRemoveUntil(
                context,
                '/login',
                (Route<dynamic> route) => false,
              );
            },
          ),
        ],
      ),
    );
  }
}
