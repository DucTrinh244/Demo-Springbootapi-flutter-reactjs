import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Profile'),
        centerTitle: true,
        backgroundColor: const Color.fromARGB(255, 47, 202, 202),
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            Container(
              padding: EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.blueAccent,
                borderRadius: BorderRadius.vertical(
                  bottom: Radius.circular(30),
                ),
              ),
              child: Column(
                children: [
                  CircleAvatar(
                    radius: 50,
                    backgroundImage: AssetImage('assets/images/profile.jpg'),
                  ),
                  SizedBox(height: 10),
                  Text(
                    'John Doe',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  SizedBox(height: 5),
                  Text(
                    'johndoe@example.com',
                    style: TextStyle(fontSize: 16, color: Colors.white70),
                  ),
                ],
              ),
            ),
            SizedBox(height: 20),
            ListTile(
              leading: Icon(Icons.person, color: Colors.blueAccent),
              title: Text('Account Settings'),
              trailing: Icon(Icons.arrow_forward_ios),
              onTap: () {
                // Navigate to account settings
              },
            ),
            Divider(),
            ListTile(
              leading: Icon(Icons.lock, color: Colors.blueAccent),
              title: Text('Privacy Settings'),
              trailing: Icon(Icons.arrow_forward_ios),
              onTap: () {
                // Navigate to privacy settings
              },
            ),
            Divider(),
            ListTile(
              leading: Icon(Icons.notifications, color: Colors.blueAccent),
              title: Text('Notifications'),
              trailing: Icon(Icons.arrow_forward_ios),
              onTap: () {
                // Navigate to notifications settings
              },
            ),
            Divider(),
            ListTile(
              leading: Icon(Icons.logout, color: Colors.redAccent),
              title: Text('Logout'),
              onTap: () async {
                SharedPreferences prefs = await SharedPreferences.getInstance();
                await prefs.remove('jwtToken');
                await prefs.remove('email');

                // ignore: use_build_context_synchronously
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('👋 Đã đăng xuất thành công!'),
                    backgroundColor: Colors.blue,
                  ),
                );

                // Chuyển về màn hình đăng nhập
                // ignore: use_build_context_synchronously
                Navigator.pushNamedAndRemoveUntil(
                  // ignore: use_build_context_synchronously
                  context,
                  '/login',
                  (Route<dynamic> route) => false,
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
