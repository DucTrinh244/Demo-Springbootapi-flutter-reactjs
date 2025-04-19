import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_managementproject/Services/globals.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class AuthService {
  Future<bool> validateToken(String token) async {
    final url = Uri.parse('$baseUrl/validate-token');
    try {
      final response = await http.post(
        url,
        headers: await getAuthHeaders(),
        body: token,
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['jwt'] != null &&
            data['jwt'] != 'Invalid token: User not found') {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }

  Future<void> loadAllPrefs(BuildContext context) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();

    if (prefs.containsKey("jwtToken")) {
      String token = prefs.getString("jwtToken")!;
      bool isValid = await validateToken(token);
      if (isValid) {
        // Có thể thực hiện điều gì đó nếu token hợp lệ
        // ignore: use_build_context_synchronously
        Navigator.pushReplacementNamed(context, '/dashboard');
      } else {
        // ignore: use_build_context_synchronously
        Navigator.pushReplacementNamed(context, '/login');
      }
    } else {
      // ignore: use_build_context_synchronously
      Navigator.pushReplacementNamed(context, '/login');
    }
  }
}
