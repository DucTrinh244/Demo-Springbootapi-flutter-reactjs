import 'package:flutter/material.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],
      appBar: AppBar(
        title: Text("Dashboard", style: TextStyle(fontWeight: FontWeight.bold)),
        elevation: 0,
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: GridView.count(
          crossAxisCount: 2,
          crossAxisSpacing: 16.0,
          mainAxisSpacing: 16.0,
          children: [
            _buildGridItem(context, Icons.person, 'Profile', '/profile'),
            _buildGridItem(context, Icons.person, 'Projects', '/project'),
            _buildGridItem(context, Icons.person, 'Task', '/task'),
            _buildGridItem(context, Icons.chat, 'Chat', '/chat'),
            _buildGridItem(context, Icons.login, 'Login', '/login'),
            _buildGridItem(context, Icons.logout, 'Register', '/register'),
          ],
        ),
      ),
    );
  }

  Widget _buildGridItem(
    BuildContext context,
    IconData icon,
    String label,
    String route,
  ) {
    return GestureDetector(
      onTap: () {
        Navigator.pushNamed(context, route);
      },
      child: Container(
        decoration: BoxDecoration(
          color: Colors.blue,
          borderRadius: BorderRadius.circular(12.0),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 50.0, color: Colors.white),
            SizedBox(height: 10.0),
            Text(label, style: TextStyle(color: Colors.white, fontSize: 16.0)),
          ],
        ),
      ),
    );
  }
}
