import 'package:shared_preferences/shared_preferences.dart';

final String baseUrl = 'http://192.168.1.77:8080';

final Map<String, String> defaultHeaders = {
  'Content-Type': 'application/json; charset=UTF-8',
};
Future<String> getToken() async {
  final prefs = await SharedPreferences.getInstance();
  return prefs.getString('jwtToken') ?? '';
}

Future<String> getEmail() async {
  final prefs = await SharedPreferences.getInstance();
  return prefs.getString('email') ?? '';
}

// Hàm để lấy headers kèm theo Authorization
Future<Map<String, String>> getAuthHeaders() async {
  final token = await getToken();
  return {...defaultHeaders, 'Authorization': 'Bearer $token'};
}
