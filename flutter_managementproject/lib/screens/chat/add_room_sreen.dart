import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:http/http.dart' as http;

import '../../Services/globals.dart';

class CreateRoomScreen extends StatefulWidget {
  const CreateRoomScreen({super.key});

  @override
  State<CreateRoomScreen> createState() => _CreateRoomScreenState();
}

class _CreateRoomScreenState extends State<CreateRoomScreen> {
  final TextEditingController _roomNameController = TextEditingController();
  final TextEditingController _memberEmailController = TextEditingController();
  final List<String> _members = [];

  bool _isLoading = false;
  final _formKey = GlobalKey<FormState>();

  void _addMember() {
    final email = _memberEmailController.text.trim();

    if (email.isEmpty) {
      return;
    }

    // Basic email validation
    final bool emailValid = RegExp(
      r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$',
    ).hasMatch(email);

    if (!emailValid) {
      Fluttertoast.showToast(msg: "Email không hợp lệ");
      return;
    }

    if (_members.contains(email)) {
      Fluttertoast.showToast(msg: "Email này đã được thêm");
      return;
    }

    setState(() {
      _members.add(email);
      _memberEmailController.clear();
    });
  }

  void _removeMember(String email) {
    setState(() {
      _members.remove(email);
    });
  }

  Future<void> _createRoom() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    final String roomName = _roomNameController.text.trim();

    if (roomName.isEmpty) {
      Fluttertoast.showToast(
        msg: "Vui lòng nhập tên nhóm",
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.BOTTOM,
        backgroundColor: Colors.red,
        textColor: Colors.white,
        fontSize: 16.0,
      );
      return;
    }

    if (_members.isEmpty) {
      Fluttertoast.showToast(
        msg: "Vui lòng thêm ít nhất một thành viên",
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.BOTTOM,
        backgroundColor: Colors.red,
        textColor: Colors.white,
        fontSize: 16.0,
      );
      return;
    }

    setState(() => _isLoading = true);

    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/rooms/add-room-with-member'),
        headers: await getAuthHeaders(),
        body: jsonEncode({"roomName": roomName, "members": _members}),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        Fluttertoast.showToast(
          msg: "Tạo nhóm thành công",
          toastLength: Toast.LENGTH_SHORT,
          gravity: ToastGravity.BOTTOM,
          backgroundColor: Colors.green,
          textColor: Colors.white,
          fontSize: 16.0,
        );

        // ignore: use_build_context_synchronously
        Navigator.pop(context, true); // Quay lại màn hình trước
      } else {
        Fluttertoast.showToast(
          msg: "Lỗi: ${response.statusCode}",
          toastLength: Toast.LENGTH_SHORT,
          gravity: ToastGravity.BOTTOM,
          backgroundColor: Colors.red,
          textColor: Colors.white,
          fontSize: 16.0,
        );
      }
    } catch (e) {
      Fluttertoast.showToast(
        msg: "Lỗi kết nối: $e",
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.BOTTOM,
        backgroundColor: Colors.red,
        textColor: Colors.white,
        fontSize: 16.0,
      );
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Tạo Nhóm Mới'),
        backgroundColor: const Color(0xFF4299E1),
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              TextFormField(
                controller: _roomNameController,
                decoration: InputDecoration(
                  labelText: 'Tên nhóm',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  filled: true,
                  fillColor: Colors.grey[100],
                  prefixIcon: const Icon(Icons.group),
                ),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Vui lòng nhập tên nhóm';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 20),
              Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      controller: _memberEmailController,
                      decoration: InputDecoration(
                        labelText: 'Email thành viên',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        filled: true,
                        fillColor: Colors.grey[100],
                        prefixIcon: const Icon(Icons.email),
                      ),
                      keyboardType: TextInputType.emailAddress,
                    ),
                  ),
                  const SizedBox(width: 10),
                  ElevatedButton(
                    onPressed: _addMember,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF4299E1),
                      padding: const EdgeInsets.all(15),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: const Icon(Icons.add, color: Colors.white),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              const Text(
                'Danh sách thành viên:',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
              ),
              const SizedBox(height: 8),
              Expanded(
                child: Container(
                  decoration: BoxDecoration(
                    border: Border.all(color: Colors.grey.shade300),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child:
                      _members.isEmpty
                          ? const Center(
                            child: Text(
                              'Chưa có thành viên nào',
                              style: TextStyle(color: Colors.grey),
                            ),
                          )
                          : ListView.separated(
                            padding: const EdgeInsets.all(10),
                            itemCount: _members.length,
                            separatorBuilder:
                                (context, index) => const Divider(),
                            itemBuilder: (context, index) {
                              final email = _members[index];
                              return ListTile(
                                leading: CircleAvatar(
                                  backgroundColor: const Color(
                                    0xFF4299E1,
                                  ).withOpacity(0.2),
                                  child: const Icon(
                                    Icons.person,
                                    color: Color(0xFF4299E1),
                                  ),
                                ),
                                title: Text(email),
                                trailing: IconButton(
                                  icon: const Icon(
                                    Icons.remove_circle_outline,
                                    color: Colors.red,
                                  ),
                                  onPressed: () => _removeMember(email),
                                ),
                                contentPadding: EdgeInsets.zero,
                              );
                            },
                          ),
                ),
              ),
              const SizedBox(height: 24),
              SizedBox(
                height: 50,
                child:
                    _isLoading
                        ? const Center(child: CircularProgressIndicator())
                        : ElevatedButton.icon(
                          onPressed: _createRoom,
                          icon: const Icon(Icons.group_add),
                          label: const Text(
                            'Tạo nhóm',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF4299E1),
                            foregroundColor: Colors.white,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            elevation: 2,
                          ),
                        ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
