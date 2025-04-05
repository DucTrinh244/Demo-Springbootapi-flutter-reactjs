import 'package:flutter/material.dart';
import 'package:flutter_managementproject/screens/home_screen.dart';
import 'package:flutter_managementproject/screens/main_screen.dart';
import 'package:flutter_managementproject/screens/user/profile_screen.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  // ignore: library_private_types_in_public_api
  _DashboardScreenState createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  int _selectedIndex = 0; // Trạng thái cho tab hiện tại

  // Hàm để thay đổi trang theo chỉ số tab đã chọn
  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index; // Cập nhật chỉ số tab
    });
  }

  // Hàm để trả về widget tương ứng với tab đã chọn
  Widget _getBody() {
    switch (_selectedIndex) {
      case 0:
        return MainScreen();
      case 1:
        return HomeScreen();
      case 2:
        return ProfileScreen();
      default:
        return MainScreen();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _getBody(), // Hiển thị nội dung dựa trên tab được chọn
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex, // Cập nhật chỉ số tab hiện tại
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(
            icon: Icon(Icons.dashboard),
            label: 'Dashboard',
          ),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Profile'),
        ],
        onTap: _onItemTapped, // Xử lý sự kiện khi người dùng nhấn vào một mục
      ),
    );
  }
}
