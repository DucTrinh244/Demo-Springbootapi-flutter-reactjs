import 'package:flutter/material.dart';
import 'package:flutter_managementproject/Services/globals.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

Future<bool> checkTokenValid(BuildContext context) async {
  SharedPreferences prefs = await SharedPreferences.getInstance();
  String? token = prefs.getString('jwtToken');

  if (token == null) {
    // ignore: use_build_context_synchronously
    Navigator.pushReplacementNamed(context, '/login');
    return false;
  }

  final response = await http.get(
    Uri.parse('$baseUrl/check-token'),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    },
  );

  if (response.statusCode == 401 || response.statusCode == 403) {
    await prefs.remove('jwtToken');
    // ignore: use_build_context_synchronously
    Navigator.pushReplacementNamed(context, '/login');
    return false;
  }

  return true;
}
