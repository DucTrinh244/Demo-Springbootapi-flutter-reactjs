import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_managementproject/Services/globals.dart';
import 'package:flutter_managementproject/screens/models/ProjectModel.dart';
import 'package:flutter_managementproject/screens/models/UserModel.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:http/http.dart' as http;

class AddMemberToProjectScreen extends StatefulWidget {
  const AddMemberToProjectScreen({super.key});

  @override
  State<AddMemberToProjectScreen> createState() =>
      _AddMemberToProjectScreenState();
}

class _AddMemberToProjectScreenState extends State<AddMemberToProjectScreen> {
  final TextEditingController _searchController = TextEditingController();
  List<UserModel> _allUsers = [];
  List<UserModel> _filteredUsers = [];
  final List<UserModel> _selectedUsers = [];
  bool _isLoading = false;
  late ProjectModel _project;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final args =
        ModalRoute.of(context)!.settings.arguments as Map<String, dynamic>;
    _project = args['project'];
    _fetchUsers();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _fetchUsers() async {
    setState(() {
      _isLoading = true;
    });

    try {
      String url = '$baseUrl/api/users';
      final response = await http.get(
        Uri.parse(url),
        headers: await getAuthHeaders(),
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        List<UserModel> users = data.map((e) => UserModel.fromJson(e)).toList();

        // Filter out users who are already project members
        users =
            users
                .where(
                  (user) =>
                      !_project.members.contains(user.email) &&
                      user.email != _project.projectOwnerId,
                )
                .toList();

        setState(() {
          _allUsers = users;
          _filteredUsers = users;
          _isLoading = false;
        });
      } else {
        _showErrorToast("Lỗi: ${response.reasonPhrase}");
        setState(() {
          _isLoading = false;
        });
      }
    } catch (e) {
      _showErrorToast("Lỗi: $e");
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _filterUsers(String query) {
    if (query.isEmpty) {
      setState(() {
        _filteredUsers = _allUsers;
      });
    } else {
      setState(() {
        _filteredUsers =
            _allUsers
                .where(
                  (user) =>
                      user.email.toLowerCase().contains(query.toLowerCase()) ||
                      (user.fullName?.toLowerCase().contains(
                            query.toLowerCase(),
                          ) ??
                          false),
                )
                .toList();
      });
    }
  }

  void _toggleUserSelection(UserModel user) {
    setState(() {
      if (_isUserSelected(user)) {
        _selectedUsers.removeWhere(
          (selectedUser) => selectedUser.id == user.id,
        );
      } else {
        _selectedUsers.add(user);
      }
    });
  }

  bool _isUserSelected(UserModel user) {
    return _selectedUsers.any((selectedUser) => selectedUser.id == user.id);
  }

  Future<void> _addMembersToProject() async {
    if (_selectedUsers.isEmpty) {
      _showInfoToast("Vui lòng chọn ít nhất một thành viên");
      return;
    }

    setState(() {
      _isLoading = true;
    });

    try {
      List<String> memberEmails =
          _selectedUsers.map((user) => user.email).toList();

      String url = '$baseUrl/api/projects/${_project.projectId}/members';
      final response = await http.put(
        Uri.parse(url),
        headers: await getAuthHeaders(),
        body: jsonEncode(memberEmails),
      );

      if (response.statusCode == 200) {
        _showSuccessToast("Thêm thành viên thành công");
        // ignore: use_build_context_synchronously
        Navigator.pop(context, true); // Return true to indicate success
      } else {
        _showErrorToast("Lỗi ${response.statusCode}: ${response.reasonPhrase}");
        setState(() {
          _isLoading = false;
        });
      }
    } catch (e) {
      _showErrorToast("Lỗi: $e");
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _showErrorToast(String message) {
    Fluttertoast.showToast(
      msg: message,
      backgroundColor: Colors.red,
      textColor: Colors.white,
    );
  }

  void _showInfoToast(String message) {
    Fluttertoast.showToast(
      msg: message,
      backgroundColor: Colors.blue,
      textColor: Colors.white,
    );
  }

  void _showSuccessToast(String message) {
    Fluttertoast.showToast(
      msg: message,
      backgroundColor: Colors.green,
      textColor: Colors.white,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],
      appBar: AppBar(
        title: Text(
          'Thêm thành viên',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
        backgroundColor: Colors.blue.shade700,
        elevation: 0,
        actions: [
          if (_selectedUsers.isNotEmpty)
            Padding(
              padding: const EdgeInsets.only(right: 16.0),
              child: Center(
                child: Container(
                  padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    '${_selectedUsers.length}',
                    style: TextStyle(
                      color: Colors.blue.shade700,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
            ),
        ],
      ),
      body: Column(
        children: [
          Container(
            padding: EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.blue.shade700,
              borderRadius: BorderRadius.only(
                bottomLeft: Radius.circular(20),
                bottomRight: Radius.circular(20),
              ),
              boxShadow: [
                BoxShadow(
                  // ignore: deprecated_member_use
                  color: Colors.blue.withOpacity(0.3),
                  blurRadius: 8,
                  offset: Offset(0, 4),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Thêm thành viên cho dự án',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  _project.projectName,
                  style: TextStyle(
                    // ignore: deprecated_member_use
                    color: Colors.white.withOpacity(0.9),
                    fontSize: 16,
                  ),
                ),
                SizedBox(height: 16),
                TextField(
                  controller: _searchController,
                  onChanged: _filterUsers,
                  decoration: InputDecoration(
                    hintText: 'Tìm kiếm người dùng...',
                    hintStyle: TextStyle(color: Colors.white70),
                    prefixIcon: Icon(Icons.search, color: Colors.white70),
                    filled: true,
                    fillColor: Colors.white24,
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide.none,
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide.none,
                    ),
                    contentPadding: EdgeInsets.symmetric(vertical: 12),
                  ),
                  style: TextStyle(color: Colors.white),
                ),
              ],
            ),
          ),

          if (_selectedUsers.isNotEmpty) ...[
            Container(
              padding: EdgeInsets.symmetric(vertical: 12, horizontal: 16),
              color: Colors.grey[100],
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Đã chọn (${_selectedUsers.length})',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      color: Colors.grey[800],
                    ),
                  ),
                  SizedBox(height: 8),
                  SizedBox(
                    height: 56,
                    child: ListView.builder(
                      scrollDirection: Axis.horizontal,
                      itemCount: _selectedUsers.length,
                      itemBuilder: (context, index) {
                        final user = _selectedUsers[index];
                        return Padding(
                          padding: const EdgeInsets.only(right: 8.0),
                          child: Chip(
                            avatar: CircleAvatar(
                              backgroundColor: Colors.blue.shade100,
                              child: Text(
                                user.email.substring(0, 1).toUpperCase(),
                                style: TextStyle(
                                  color: Colors.blue.shade700,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                            label: Text(user.email),
                            deleteIcon: Icon(Icons.close, size: 18),
                            onDeleted: () => _toggleUserSelection(user),
                            backgroundColor: Colors.white,
                            elevation: 1,
                            padding: EdgeInsets.symmetric(horizontal: 8),
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),
            Divider(height: 1),
          ],

          Expanded(
            child:
                _isLoading
                    ? Center(child: CircularProgressIndicator())
                    : _filteredUsers.isEmpty
                    ? _buildEmptyState()
                    : ListView.builder(
                      itemCount: _filteredUsers.length,
                      itemBuilder: (context, index) {
                        final user = _filteredUsers[index];
                        final isSelected = _isUserSelected(user);

                        return ListTile(
                          leading: CircleAvatar(
                            backgroundColor:
                                isSelected
                                    ? Colors.blue.shade700
                                    : Colors.grey.shade300,
                            child:
                                isSelected
                                    ? Icon(Icons.check, color: Colors.white)
                                    : Text(
                                      user.email.substring(0, 1).toUpperCase(),
                                      style: TextStyle(
                                        color:
                                            isSelected
                                                ? Colors.white
                                                : Colors.black87,
                                      ),
                                    ),
                          ),
                          title: Text(
                            user.fullName ?? 'Không có tên',
                            style: TextStyle(
                              fontWeight:
                                  isSelected
                                      ? FontWeight.bold
                                      : FontWeight.normal,
                            ),
                          ),
                          subtitle: Text(user.email),
                          trailing:
                              isSelected
                                  ? Icon(
                                    Icons.check_circle,
                                    color: Colors.blue.shade700,
                                  )
                                  : Icon(
                                    Icons.radio_button_unchecked,
                                    color: Colors.grey,
                                  ),
                          onTap: () => _toggleUserSelection(user),
                          tileColor: isSelected ? Colors.blue.shade50 : null,
                        );
                      },
                    ),
          ),
        ],
      ),
      bottomNavigationBar: Container(
        padding: EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              // ignore: deprecated_member_use
              color: Colors.black.withOpacity(0.05),
              blurRadius: 5,
              offset: Offset(0, -2),
            ),
          ],
        ),
        child: SafeArea(
          child: ElevatedButton(
            onPressed: _selectedUsers.isEmpty ? null : _addMembersToProject,
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.blue.shade700,
              padding: EdgeInsets.symmetric(vertical: 16),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              disabledBackgroundColor: Colors.grey.shade300,
            ),
            child:
                _isLoading
                    ? SizedBox(
                      height: 20,
                      width: 20,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                      ),
                    )
                    : Text(
                      'Thêm thành viên',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
          ),
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    final bool isSearching = _searchController.text.isNotEmpty;

    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            isSearching ? Icons.search_off : Icons.people_outline,
            size: 80,
            color: Colors.grey[400],
          ),
          SizedBox(height: 16),
          Text(
            isSearching
                ? 'Không tìm thấy người dùng'
                : 'Không có người dùng khả dụng',
            style: TextStyle(
              fontSize: 18,
              color: Colors.grey[600],
              fontWeight: FontWeight.w500,
            ),
          ),
          SizedBox(height: 8),
          Text(
            isSearching
                ? 'Thử tìm kiếm với từ khóa khác'
                : 'Tất cả người dùng đã được thêm vào dự án',
            style: TextStyle(color: Colors.grey[500]),
          ),
          if (isSearching) ...[
            SizedBox(height: 24),
            TextButton.icon(
              onPressed: () {
                _searchController.clear();
                _filterUsers('');
              },
              icon: Icon(Icons.clear),
              label: Text('Xóa tìm kiếm'),
            ),
          ],
        ],
      ),
    );
  }
}
