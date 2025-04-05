import 'dart:convert'; // Để làm việc với JSON

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import '../Services/globals.dart';

class AddUserPage extends StatefulWidget {
  const AddUserPage({super.key});

  @override
  // ignore: library_private_types_in_public_api
  _AddUserPageState createState() => _AddUserPageState();
}

class _AddUserPageState extends State<AddUserPage> {
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  String _errorMessage = ''; // Để hiển thị thông báo lỗi nếu có

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    super.dispose();
  }

  // Hàm xử lý gửi dữ liệu lên API
  Future<void> _submitData() async {
    final name = _nameController.text;
    final email = _emailController.text;

    if (name.isEmpty || email.isEmpty) {
      setState(() {
        _errorMessage = 'Vui lòng điền đầy đủ tên và email.';
      });
      return;
    }

    try {
      final response = await http.post(
        Uri.parse(baseUrl), // Địa chỉ API
        headers: defaultHeaders,
        body: json.encode({'name': name, 'email': email}),
      );

      if (response.statusCode == 200) {
        // Thành công, chuyển hướng hoặc hiển thị thông báo thành công
        // ignore: use_build_context_synchronously
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('🎉 Người dùng đã được thêm thành công!')),
        );
        _nameController.clear();
        _emailController.clear();
        setState(() {
          _errorMessage = ''; // Reset lỗi
        });
      } else {
        setState(() {
          _errorMessage = '❌ Lỗi khi thêm người dùng. Vui lòng thử lại.';
        });
      }
    } catch (error) {
      setState(() {
        _errorMessage = '❌ Lỗi kết nối. Vui lòng thử lại.';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Add User')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Hiển thị lỗi nếu có
            if (_errorMessage.isNotEmpty)
              Padding(
                padding: const EdgeInsets.only(bottom: 10.0),
                child: Text(
                  _errorMessage,
                  style: TextStyle(color: Colors.red, fontSize: 16),
                ),
              ),
            // TextField: Nhập tên người dùng
            TextField(
              controller: _nameController,
              decoration: InputDecoration(
                labelText: 'Name',
                border: OutlineInputBorder(),
              ),
            ),
            SizedBox(height: 16),
            // TextField: Nhập email người dùng
            TextField(
              controller: _emailController,
              decoration: InputDecoration(
                labelText: 'Email',
                border: OutlineInputBorder(),
              ),
              keyboardType: TextInputType.emailAddress,
            ),
            SizedBox(height: 16),
            // Nút gửi dữ liệu
            ElevatedButton(onPressed: _submitData, child: Text('Submit')),
          ],
        ),
      ),
    );
  }
}
