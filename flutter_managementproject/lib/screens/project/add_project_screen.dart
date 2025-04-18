import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_managementproject/Services/globals.dart';
import 'package:fluttertoast/fluttertoast.dart'; // Import Fluttertoast
import 'package:http/http.dart' as http;

class AddProjectScreen extends StatefulWidget {
  const AddProjectScreen({super.key});

  @override
  _AddProjectScreenState createState() => _AddProjectScreenState();
}

class _AddProjectScreenState extends State<AddProjectScreen> {
  final _formKey = GlobalKey<FormState>();

  final TextEditingController _projectNameController = TextEditingController();
  final TextEditingController _descriptionController = TextEditingController();
  final TextEditingController _startDateController = TextEditingController();
  final TextEditingController _endDateController = TextEditingController();

  String _status = 'Pending';
  String _priority = 'Medium';

  // URL của API backend
  Future<void> _saveProject() async {
    if (_formKey.currentState!.validate()) {
      String projectName = _projectNameController.text;
      String description = _descriptionController.text;
      String startDate = _startDateController.text;
      String endDate = _endDateController.text;

      // Dữ liệu dự án dưới dạng JSON
      final Map<String, dynamic> projectData = {
        'projectName': projectName,
        'description': description,
        'startDate': startDate,
        'endDate': endDate,
        'status': _status,
        'priority': _priority,
      };

      // Gửi HTTP POST request tới backend
      try {
        final response = await http.post(
          Uri.parse('$baseUrl/api/projects'),
          headers: await getAuthHeaders(),
          body: json.encode(projectData),
        );

        if (response.statusCode == 200) {
          // Thành công, hiển thị thông báo thành công
          Fluttertoast.showToast(
            msg: "Project created successfully",
            toastLength: Toast.LENGTH_SHORT,
            gravity: ToastGravity.BOTTOM,
            timeInSecForIosWeb: 1,
            backgroundColor: Colors.green,
            textColor: Colors.white,
            fontSize: 16.0,
          );
          // ignore: use_build_context_synchronously
          Navigator.pushReplacementNamed(context, '/dashboard');
        } else {
          // Lỗi, hiển thị thông báo lỗi
          Fluttertoast.showToast(
            msg: "Failed to create project: ${response.body}",
            toastLength: Toast.LENGTH_SHORT,
            gravity: ToastGravity.BOTTOM,
            timeInSecForIosWeb: 1,
            backgroundColor: Colors.red,
            textColor: Colors.white,
            fontSize: 16.0,
          );
        }
      } catch (e) {
        // Hiển thị thông báo lỗi nếu có lỗi trong quá trình gửi request
        Fluttertoast.showToast(
          msg: "Error: $e",
          toastLength: Toast.LENGTH_SHORT,
          gravity: ToastGravity.BOTTOM,
          timeInSecForIosWeb: 1,
          backgroundColor: Colors.red,
          textColor: Colors.white,
          fontSize: 16.0,
        );
      }
    }
  }

  Future<void> _selectDate(
    BuildContext context,
    TextEditingController controller,
  ) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(2000),
      lastDate: DateTime(2101),
    );
    if (picked != null && picked != DateTime.now()) {
      setState(() {
        controller.text =
            "${picked.toLocal()}".split(' ')[0]; // Format: yyyy-mm-dd
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Add Project')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildTextField(_projectNameController, 'Project Name'),
                _buildDescriptionField(),
                _buildDateField('Start Date', _startDateController, context),
                _buildDateField('End Date', _endDateController, context),
                _buildDropdownField(),
                _buildPriorityField(), // Thêm ô nhập Priority
                const SizedBox(height: 20),
                ElevatedButton(
                  onPressed: _saveProject,
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 20.0),
                    backgroundColor: Colors.blueAccent,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    minimumSize: Size(
                      double.infinity,
                      60,
                    ), // Nút dài và rộng hơn
                  ),
                  child: const Text(
                    'Create Project',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // Widget tạo TextField cho các trường thông tin
  Widget _buildTextField(TextEditingController controller, String label) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: TextFormField(
        controller: controller,
        decoration: InputDecoration(
          labelText: label,
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
          filled: true,
          fillColor: Colors.grey[200],
        ),
        validator: (value) {
          if (value == null || value.isEmpty) {
            return 'Please enter $label';
          }
          return null;
        },
      ),
    );
  }

  // Widget tạo TextField mô tả với kích thước lớn hơn
  Widget _buildDescriptionField() {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: TextFormField(
        controller: _descriptionController,
        maxLines: 5, // Tăng số dòng cho TextField mô tả
        decoration: InputDecoration(
          labelText: 'Description',
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
          filled: true,
          fillColor: Colors.grey[200],
        ),
        validator: (value) {
          if (value == null || value.isEmpty) {
            return 'Please enter a description';
          }
          return null;
        },
      ),
    );
  }

  // Widget chọn ngày với DatePicker
  Widget _buildDateField(
    String label,
    TextEditingController controller,
    BuildContext context,
  ) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: TextFormField(
        controller: controller,
        decoration: InputDecoration(
          labelText: label,
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
          filled: true,
          fillColor: Colors.grey[200],
          suffixIcon: IconButton(
            icon: const Icon(Icons.calendar_today),
            onPressed: () => _selectDate(context, controller),
          ),
        ),
        validator: (value) {
          if (value == null || value.isEmpty) {
            return 'Please select a $label';
          }
          return null;
        },
      ),
    );
  }

  // Widget Dropdown cho Status
  Widget _buildDropdownField() {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: DropdownButtonFormField<String>(
        decoration: InputDecoration(
          labelText: 'Status',
          border: const OutlineInputBorder(),
          filled: true,
          fillColor: Colors.grey[200],
        ),
        value: _status,
        items:
            ['Pending', 'In Progress', 'Completed']
                .map(
                  (status) =>
                      DropdownMenuItem(value: status, child: Text(status)),
                )
                .toList(),
        onChanged: (value) {
          setState(() {
            _status = value!;
          });
        },
      ),
    );
  }

  // Widget Dropdown cho Priority
  Widget _buildPriorityField() {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: DropdownButtonFormField<String>(
        decoration: InputDecoration(
          labelText: 'Priority',
          border: const OutlineInputBorder(),
          filled: true,
          fillColor: Colors.grey[200],
        ),
        value: _priority,
        items:
            ['Low', 'Medium', 'High']
                .map(
                  (priority) =>
                      DropdownMenuItem(value: priority, child: Text(priority)),
                )
                .toList(),
        onChanged: (value) {
          setState(() {
            _priority = value!;
          });
        },
      ),
    );
  }
}
