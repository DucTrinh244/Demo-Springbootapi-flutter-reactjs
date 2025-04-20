import 'package:flutter/material.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      appBar: AppBar(
        title: const Text(
          "Dashboard",
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 22),
        ),
        elevation: 0,
        backgroundColor: Colors.white,
        foregroundColor: const Color(0xFF2D3748),
        actions: [
          IconButton(
            icon: const CircleAvatar(
              radius: 16,
              backgroundColor: Color(0xFFE2E8F0),
              child: Icon(Icons.person, size: 18, color: Color(0xFF4A5568)),
            ),
            onPressed: () {},
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              "Welcome back!",
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Color(0xFF2D3748),
              ),
            ),
            const SizedBox(height: 6),
            const Text(
              "What would you like to do today?",
              style: TextStyle(fontSize: 16, color: Color(0xFF718096)),
            ),
            const SizedBox(height: 24),
            Expanded(
              child: GridView.count(
                crossAxisCount: 2,
                crossAxisSpacing: 16.0,
                mainAxisSpacing: 16.0,
                childAspectRatio: 1.1,
                children: [
                  _buildGridItem(
                    context,
                    Icons.person_outline,
                    'Profile',
                    '/profile',
                    const Color(0xFF4299E1),
                    const Color(0xFF3182CE),
                  ),
                  _buildGridItem(
                    context,
                    Icons.folder_outlined,
                    'Projects',
                    '/project',
                    const Color(0xFF48BB78),
                    const Color(0xFF38A169),
                  ),
                  _buildGridItem(
                    context,
                    Icons.task_alt,
                    'Tasks',
                    '/task',
                    const Color(0xFFED8936),
                    const Color(0xFFDD6B20),
                  ),
                  _buildGridItem(
                    context,
                    Icons.chat_bubble_outline,
                    'Chat',
                    '/main-chat',
                    const Color(0xFF805AD5),
                    const Color(0xFF6B46C1),
                  ),
                  _buildGridItem(
                    context,
                    Icons.login,
                    'Login',
                    '/login',
                    const Color(0xFFE53E3E),
                    const Color(0xFFC53030),
                  ),
                  _buildGridItem(
                    context,
                    Icons.data_array_outlined,
                    'Data Local',
                    '/LocalData',
                    const Color(0xFF2B6CB0),
                    const Color(0xFF2C5282),
                  ),
                ],
              ),
            ),
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
    Color color,
    Color shadowColor,
  ) {
    return GestureDetector(
      onTap: () {
        Navigator.pushNamed(context, route);
      },
      child: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [color, shadowColor],
          ),
          borderRadius: BorderRadius.circular(16.0),
          boxShadow: [
            BoxShadow(
              color: shadowColor.withOpacity(0.3),
              offset: const Offset(0, 4),
              blurRadius: 8.0,
            ),
          ],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 42.0, color: Colors.white),
            const SizedBox(height: 12.0),
            Text(
              label,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 16.0,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
