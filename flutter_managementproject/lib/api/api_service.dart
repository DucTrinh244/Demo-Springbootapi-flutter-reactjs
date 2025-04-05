import 'dart:convert'; // chuyển đổi dữ liệu json

import 'package:http/http.dart' as http; // gửi yêu cầu api

import '../Services/globals.dart';
import '../models/user.dart';

class ApiService {
  // get UserUser
  Future<List<User>> fetchUsers() async {
    // hàm bất đồng bộ
    final response = await http.get(
      Uri.parse(baseUrl),
    ); // gửi request  và await
    if (response.statusCode == 200) {
      // check repos
      List<dynamic> data = json.decode(
        response.body,
      ); // giải mã json thành user
      return data.map((json) => User.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load users'); // nếu trường hợp lỗi
    }
  }

  Future<void> addUser(User user) async {
    final response = await http.post(
      Uri.parse(baseUrl),
      headers: defaultHeaders,
      body: json.encode(user.toJson()), // Chuyển User thành JSON
    );

    if (response.statusCode == 201) {
      print('User added successfully');
    } else {
      throw Exception('Failed to add user');
    }
  }
}
