import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_managementproject/Services/globals.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

  bool _isLoading = false;

  Future<void> login() async {
    final url = Uri.parse('$baseUrl/authentication');

    setState(() {
      _isLoading = true;
    });

    try {
      final response = await http.post(
        url,
        headers: defaultHeaders,
        body: jsonEncode({
          'email': emailController.text,
          'password': passwordController.text,
        }),
      );

      setState(() {
        _isLoading = false;
      });

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final token = data['jwt'];

        SharedPreferences prefs = await SharedPreferences.getInstance();
        await prefs.setString('jwtToken', token);

        // Kiểm tra lại sau khi lưu
        final savedToken = prefs.getString('jwtToken');
        if (savedToken != null && savedToken == token) {
          // ignore: use_build_context_synchronously
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('✅ Đăng nhập thành công và đã lưu token!'),
              backgroundColor: Colors.green,
            ),
          );
        } else {
          // ignore: use_build_context_synchronously
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text(
                '⚠️ Đăng nhập thành công nhưng không lưu được token!',
              ),
              backgroundColor: Colors.orange,
            ),
          );
        }

        // ignore: use_build_context_synchronously
        Navigator.pushReplacementNamed(context, '/dashboard');
      } else {
        final errorMsg =
            response.body.isNotEmpty
                ? jsonDecode(response.body)['message'] ?? 'Đăng nhập thất bại!'
                : 'Đăng nhập thất bại!';
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
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Image.network(
                'https://i.pinimg.com/736x/e5/6b/84/e56b841924ac729935e858cb59535fb7.jpg',
                height: 200,
              ),
              const SizedBox(height: 30),
              const Text(
                'Welcome Back!',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
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
              const SizedBox(height: 24),
              _isLoading
                  ? const CircularProgressIndicator()
                  : ElevatedButton(
                    onPressed: login,
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 100,
                        vertical: 16,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      backgroundColor: Colors.blueAccent,
                    ),
                    child: const Text('Login', style: TextStyle(fontSize: 16)),
                  ),
              const SizedBox(height: 12),
              TextButton(
                onPressed: () {
                  Navigator.pushNamed(context, '/register');
                },
                child: const Text("Don't have an account? Register"),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
