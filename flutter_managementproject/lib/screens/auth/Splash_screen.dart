import 'package:flutter/material.dart';
import 'package:flutter_managementproject/Services/auth_service.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    _checkToken();
  }

  void _checkToken() async {
    await Future.delayed(const Duration(seconds: 1)); // Cho hiệu ứng splash
    // ignore: use_build_context_synchronously
    await AuthService().loadAllPrefs(context); // Kiểm tra token
  }

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: CircularProgressIndicator(), // loading UI
      ),
    );
  }
}
