import 'package:flutter/material.dart';
import 'package:flutter_managementproject/Services/globals.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class SharedPrefsPage extends StatefulWidget {
  const SharedPrefsPage({super.key});

  @override
  // ignore: library_private_types_in_public_api
  _SharedPrefsPageState createState() => _SharedPrefsPageState();
}

class _SharedPrefsPageState extends State<SharedPrefsPage> {
  Map<String, Object> _allPrefs = {};
  String _tokenStatus = "";

  @override
  void initState() {
    super.initState();
    _loadAllPrefs();
  }

  Future<void> _loadAllPrefs() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    setState(() {
      _allPrefs = prefs.getKeys().fold<Map<String, Object>>({}, (map, key) {
        map[key] = prefs.get(key)!;
        return map;
      });
    });

    if (_allPrefs.containsKey("jwtToken")) {
      _validateToken(_allPrefs["jwtToken"].toString());
    }
  }

  Future<void> _validateToken(String token) async {
    final String apiUrl = '$baseUrl/validate-token'; // hoặc URL máy chủ của bạn

    try {
      final response = await http.post(
        Uri.parse(apiUrl),
        headers: defaultHeaders,
        body: token, // Gửi chuỗi token dạng JSON string
      );

      if (response.statusCode == 200) {
        setState(() {
          _tokenStatus = "✅ Token hợp lệ";
        });
      } else {
        setState(() {
          _tokenStatus = "❌ Token không hợp lệ: ${response.body}";
        });
      }
    } catch (e) {
      setState(() {
        _tokenStatus = "⚠️ Lỗi khi kiểm tra token: $e";
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('SharedPreferences')),
      body: Column(
        children: [
          if (_tokenStatus.isNotEmpty)
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Text(
                _tokenStatus,
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: _tokenStatus.contains("✅") ? Colors.green : Colors.red,
                ),
              ),
            ),
          Expanded(
            child:
                _allPrefs.isEmpty
                    ? Center(child: Text("Không có dữ liệu"))
                    : ListView.builder(
                      itemCount: _allPrefs.length,
                      itemBuilder: (context, index) {
                        String key = _allPrefs.keys.elementAt(index);
                        return ListTile(
                          title: Text(key),
                          subtitle: Text('${_allPrefs[key]}'),
                        );
                      },
                    ),
          ),
        ],
      ),
    );
  }
}
