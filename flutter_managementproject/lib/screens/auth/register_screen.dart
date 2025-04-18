import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_managementproject/Services/globals.dart';
import 'package:http/http.dart' as http;

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final TextEditingController nameController = TextEditingController();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController phoneController = TextEditingController();

  bool _isLoading = false;

  Future<void> register() async {
    final url = Uri.parse('$baseUrl/register'); // Sửa URL nếu cần thiết

    setState(() {
      _isLoading = true;
    });

    try {
      final response = await http.post(
        url,
        headers: defaultHeaders,
        body: jsonEncode({
          'email': emailController.text,
          'name': nameController.text,
          'password': passwordController.text,
          'phone': phoneController.text,
        }),
      );

      setState(() {
        _isLoading = false;
      });

      // ignore: use_build_context_synchronously
      if (response.statusCode == 200 || response.statusCode == 201) {
        // ignore: use_build_context_synchronously
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('✅ Đăng ký thành công! Vui lòng đăng nhập lại '),
            backgroundColor: Colors.green,
          ),
        );

        // ignore: use_build_context_synchronously
        Navigator.pushReplacementNamed(context, '/login');
      } else {
        final errorMsg =
            response.body.isNotEmpty
                ? jsonDecode(response.body)['message'] ?? 'Đăng ký thất bại!'
                : 'Đăng ký thất bại!';
        // ignore: use_build_context_synchronously
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('❌ $errorMsg'), backgroundColor: Colors.red),
        );
      }
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
      // ignore: use_build_context_synchronously
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('❌ Có lỗi xảy ra: $e'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            children: [
              Image.network(
                'https://i.pinimg.com/736x/e5/6b/84/e56b841924ac729935e858cb59535fb7.jpg',
                height: 200,
              ),
              const SizedBox(height: 20),
              const Text(
                'Create Account',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 20),
              TextField(
                controller: nameController,
                decoration: InputDecoration(
                  hintText: 'Full Name',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  prefixIcon: const Icon(Icons.person),
                ),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: emailController,
                decoration: InputDecoration(
                  hintText: 'Email',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  prefixIcon: const Icon(Icons.email),
                ),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: passwordController,
                obscureText: true,
                decoration: InputDecoration(
                  hintText: 'Password',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  prefixIcon: const Icon(Icons.lock),
                ),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: phoneController,
                decoration: InputDecoration(
                  hintText: 'Phone Number',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  prefixIcon: const Icon(Icons.phone),
                ),
              ),
              const SizedBox(height: 24),
              _isLoading
                  ? const CircularProgressIndicator()
                  : ElevatedButton(
                    onPressed: register,
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 100,
                        vertical: 16,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      backgroundColor: Colors.green,
                    ),
                    child: const Text(
                      'Register',
                      style: TextStyle(fontSize: 16),
                    ),
                  ),
              const SizedBox(height: 12),
              TextButton(
                onPressed: () {
                  Navigator.pop(context); // quay lại Login
                },
                child: const Text('Already have an account? Login'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
