import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_managementproject/Services/globals.dart';
import 'package:flutter_managementproject/screens/models/SubTaskModel.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:http/http.dart' as http;

class CreateTaskScreen extends StatefulWidget {
  final String projectId;
  final String projectName;

  const CreateTaskScreen({
    super.key,
    required this.projectId,
    required this.projectName,
  });

  @override
  // ignore: library_private_types_in_public_api
  _CreateTaskScreenState createState() => _CreateTaskScreenState();
}

class _CreateTaskScreenState extends State<CreateTaskScreen> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _taskNameController = TextEditingController();
  final TextEditingController _descriptionController = TextEditingController();
  final TextEditingController _assigneeEmailController =
      TextEditingController();
  final TextEditingController _startDateController = TextEditingController();
  final TextEditingController _endDateController = TextEditingController();

  String _status = 'Pending';
  String _priority = 'Medium';
  final List<SubTask> _subtasks = [];

  Future<void> _saveTask() async {
    if (_formKey.currentState!.validate()) {
      String taskName = _taskNameController.text;
      String description = _descriptionController.text;
      String assigneeEmail = _assigneeEmailController.text;
      String startDate = _startDateController.text;
      String endDate = _endDateController.text;

      final Map<String, dynamic> taskData = {
        'taskName': taskName,
        'description': description,
        'assigneeEmail': assigneeEmail,
        'startDate': startDate,
        'endDate': endDate,
        'status': _status,
        'priority': _priority,
        'subtasks': _subtasks.map((subtask) => subtask.toJson()).toList(),
      };

      try {
        final response = await http.post(
          Uri.parse('$baseUrl/api/tasks/${widget.projectId}'),
          headers: await getAuthHeaders(),
          body: json.encode(taskData),
        );

        if (response.statusCode == 200 || response.statusCode == 201) {
          Fluttertoast.showToast(
            msg: "Task created successfully",
            toastLength: Toast.LENGTH_SHORT,
            gravity: ToastGravity.BOTTOM,
            backgroundColor: Colors.green,
            textColor: Colors.white,
            fontSize: 16.0,
          );
          // ignore: use_build_context_synchronously
          Navigator.pushReplacementNamed(context, '/dashboard');
        } else {
          Fluttertoast.showToast(
            msg: "Failed to create task: ${response.body}",
            toastLength: Toast.LENGTH_SHORT,
            gravity: ToastGravity.BOTTOM,
            backgroundColor: Colors.red,
            textColor: Colors.white,
            fontSize: 16.0,
          );
        }
      } catch (e) {
        Fluttertoast.showToast(
          msg: "Error: $e",
          toastLength: Toast.LENGTH_SHORT,
          gravity: ToastGravity.BOTTOM,
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
    if (picked != null) {
      setState(() {
        controller.text = "${picked.toLocal()}".split(' ')[0];
      });
    }
  }

  void _addSubtask() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        final formKey = GlobalKey<FormState>();
        final TextEditingController subtaskNameController =
            TextEditingController();
        final TextEditingController subtaskDescriptionController =
            TextEditingController();
        final TextEditingController subtaskAssigneeController =
            TextEditingController();
        final TextEditingController subtaskStartDateController =
            TextEditingController();
        final TextEditingController subtaskEndDateController =
            TextEditingController();
        String subtaskStatus = 'Pending';

        return AlertDialog(
          title: const Text('Add Subtask'),
          content: SingleChildScrollView(
            child: Form(
              key: formKey,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  TextFormField(
                    controller: subtaskNameController,
                    decoration: const InputDecoration(
                      labelText: 'Subtask Name',
                    ),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter subtask name';
                      }
                      return null;
                    },
                  ),
                  TextFormField(
                    controller: subtaskDescriptionController,
                    decoration: const InputDecoration(labelText: 'Description'),
                    maxLines: 3,
                  ),
                  TextFormField(
                    controller: subtaskAssigneeController,
                    decoration: const InputDecoration(
                      labelText: 'Assignee Email',
                    ),
                  ),
                  InkWell(
                    onTap: () async {
                      await _selectDate(context, subtaskStartDateController);
                    },
                    child: IgnorePointer(
                      child: TextFormField(
                        controller: subtaskStartDateController,
                        decoration: const InputDecoration(
                          labelText: 'Start Date',
                          suffixIcon: Icon(Icons.calendar_today),
                        ),
                      ),
                    ),
                  ),
                  InkWell(
                    onTap: () async {
                      await _selectDate(context, subtaskEndDateController);
                    },
                    child: IgnorePointer(
                      child: TextFormField(
                        controller: subtaskEndDateController,
                        decoration: const InputDecoration(
                          labelText: 'End Date',
                          suffixIcon: Icon(Icons.calendar_today),
                        ),
                      ),
                    ),
                  ),
                  DropdownButtonFormField<String>(
                    decoration: const InputDecoration(labelText: 'Status'),
                    value: subtaskStatus,
                    items:
                        ['Pending', 'In Progress', 'Completed']
                            .map(
                              (item) => DropdownMenuItem(
                                value: item,
                                child: Text(item),
                              ),
                            )
                            .toList(),
                    onChanged: (value) {
                      subtaskStatus = value!;
                    },
                  ),
                ],
              ),
            ),
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: () {
                if (formKey.currentState!.validate()) {
                  final SubTask newSubtask = SubTask(
                    subtaskName: subtaskNameController.text,
                    description: subtaskDescriptionController.text,
                    assigneeEmail: subtaskAssigneeController.text,
                    startDate: subtaskStartDateController.text,
                    endDate: subtaskEndDateController.text,
                    status: subtaskStatus,
                  );

                  setState(() {
                    _subtasks.add(newSubtask);
                  });

                  Navigator.of(context).pop();
                }
              },
              child: const Text('Add'),
            ),
          ],
        );
      },
    );
  }

  void _editSubtask(int index) {
    final SubTask subtask = _subtasks[index];

    showDialog(
      context: context,
      builder: (BuildContext context) {
        final formKey = GlobalKey<FormState>();
        final TextEditingController subtaskNameController =
            TextEditingController(text: subtask.subtaskName);
        final TextEditingController subtaskDescriptionController =
            TextEditingController(text: subtask.description);
        final TextEditingController subtaskAssigneeController =
            TextEditingController(text: subtask.assigneeEmail);
        final TextEditingController subtaskStartDateController =
            TextEditingController(text: subtask.startDate);
        final TextEditingController subtaskEndDateController =
            TextEditingController(text: subtask.endDate);
        String subtaskStatus = subtask.status ?? 'Pending';

        return AlertDialog(
          title: const Text('Edit Subtask'),
          content: SingleChildScrollView(
            child: Form(
              key: formKey,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  TextFormField(
                    controller: subtaskNameController,
                    decoration: const InputDecoration(
                      labelText: 'Subtask Name',
                    ),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter subtask name';
                      }
                      return null;
                    },
                  ),
                  TextFormField(
                    controller: subtaskDescriptionController,
                    decoration: const InputDecoration(labelText: 'Description'),
                    maxLines: 3,
                  ),
                  TextFormField(
                    controller: subtaskAssigneeController,
                    decoration: const InputDecoration(
                      labelText: 'Assignee Email',
                    ),
                  ),
                  InkWell(
                    onTap: () async {
                      await _selectDate(context, subtaskStartDateController);
                    },
                    child: IgnorePointer(
                      child: TextFormField(
                        controller: subtaskStartDateController,
                        decoration: const InputDecoration(
                          labelText: 'Start Date',
                          suffixIcon: Icon(Icons.calendar_today),
                        ),
                      ),
                    ),
                  ),
                  InkWell(
                    onTap: () async {
                      await _selectDate(context, subtaskEndDateController);
                    },
                    child: IgnorePointer(
                      child: TextFormField(
                        controller: subtaskEndDateController,
                        decoration: const InputDecoration(
                          labelText: 'End Date',
                          suffixIcon: Icon(Icons.calendar_today),
                        ),
                      ),
                    ),
                  ),
                  DropdownButtonFormField<String>(
                    decoration: const InputDecoration(labelText: 'Status'),
                    value: subtaskStatus,
                    items:
                        ['Pending', 'In Progress', 'Completed']
                            .map(
                              (item) => DropdownMenuItem(
                                value: item,
                                child: Text(item),
                              ),
                            )
                            .toList(),
                    onChanged: (value) {
                      subtaskStatus = value!;
                    },
                  ),
                ],
              ),
            ),
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: () {
                if (formKey.currentState!.validate()) {
                  setState(() {
                    _subtasks[index] = SubTask(
                      subtaskName: subtaskNameController.text,
                      description: subtaskDescriptionController.text,
                      assigneeEmail: subtaskAssigneeController.text,
                      startDate: subtaskStartDateController.text,
                      endDate: subtaskEndDateController.text,
                      status: subtaskStatus,
                    );
                  });
                  Navigator.of(context).pop();
                }
              },
              child: const Text('Save'),
            ),
          ],
        );
      },
    );
  }

  void _removeSubtask(int index) {
    setState(() {
      _subtasks.removeAt(index);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Create Task - ${widget.projectName}',
          style: const TextStyle(fontSize: 18),
        ),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Task Details',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.blueGrey,
                  ),
                ),
                const SizedBox(height: 15),
                _buildTextField(_taskNameController, 'Task Name'),
                _buildDescriptionField(),
                _buildTextField(_assigneeEmailController, 'Assignee Email'),
                _buildDateField('Start Date', _startDateController, context),
                _buildDateField('End Date', _endDateController, context),
                _buildDropdownField(
                  'Status',
                  ['Pending', 'In Progress', 'Completed'],
                  (value) {
                    setState(() {
                      _status = value!;
                    });
                  },
                  _status,
                ),
                _buildDropdownField('Priority', ['Low', 'Medium', 'High'], (
                  value,
                ) {
                  setState(() {
                    _priority = value!;
                  });
                }, _priority),
                const SizedBox(height: 20),
                const Divider(),
                _buildSubtasksSection(),
                const SizedBox(height: 20),
                ElevatedButton(
                  onPressed: _saveTask,
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 20.0),
                    backgroundColor: Colors.greenAccent,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    minimumSize: const Size(double.infinity, 60),
                  ),
                  child: const Text(
                    'Create Task',
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

  Widget _buildSubtasksSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              'Subtasks',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Colors.blueGrey,
              ),
            ),
            ElevatedButton.icon(
              onPressed: _addSubtask,
              icon: const Icon(Icons.add),
              label: const Text('Add Subtask'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.blueAccent,
                foregroundColor: Colors.white,
              ),
            ),
          ],
        ),
        const SizedBox(height: 10),
        _subtasks.isEmpty
            ? const Card(
              child: Padding(
                padding: EdgeInsets.all(16.0),
                child: Center(
                  child: Text(
                    'No subtasks added yet',
                    style: TextStyle(
                      fontSize: 16,
                      fontStyle: FontStyle.italic,
                      color: Colors.grey,
                    ),
                  ),
                ),
              ),
            )
            : ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: _subtasks.length,
              itemBuilder: (context, index) {
                final subtask = _subtasks[index];
                return Card(
                  margin: const EdgeInsets.symmetric(vertical: 5),
                  elevation: 2,
                  child: ExpansionTile(
                    title: Text(
                      subtask.subtaskName ?? 'Unnamed Subtask',
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                    subtitle: Text(
                      'Status: ${subtask.status}',
                      style: TextStyle(color: _getStatusColor(subtask.status)),
                    ),
                    trailing: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        IconButton(
                          icon: const Icon(Icons.edit, color: Colors.blue),
                          onPressed: () => _editSubtask(index),
                        ),
                        IconButton(
                          icon: const Icon(Icons.delete, color: Colors.red),
                          onPressed: () => _removeSubtask(index),
                        ),
                      ],
                    ),
                    children: [
                      Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            if (subtask.description != null &&
                                subtask.description!.isNotEmpty)
                              _buildDetailRow(
                                'Description',
                                subtask.description!,
                              ),
                            if (subtask.assigneeEmail != null &&
                                subtask.assigneeEmail!.isNotEmpty)
                              _buildDetailRow(
                                'Assignee',
                                subtask.assigneeEmail!,
                              ),
                            if (subtask.startDate != null)
                              _buildDetailRow('Start Date', subtask.startDate!),
                            if (subtask.endDate != null)
                              _buildDetailRow('End Date', subtask.endDate!),
                          ],
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
      ],
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            '$label: ',
            style: const TextStyle(
              fontWeight: FontWeight.bold,
              color: Colors.blueGrey,
            ),
          ),
          Expanded(child: Text(value)),
        ],
      ),
    );
  }

  Color _getStatusColor(String? status) {
    switch (status) {
      case 'Completed':
        return Colors.green;
      case 'In Progress':
        return Colors.orange;
      case 'Pending':
      default:
        return Colors.grey;
    }
  }

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

  Widget _buildDescriptionField() {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: TextFormField(
        controller: _descriptionController,
        maxLines: 5,
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

  Widget _buildDropdownField(
    String label,
    List<String> items,
    ValueChanged<String?> onChanged,
    String selectedValue,
  ) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: DropdownButtonFormField<String>(
        decoration: InputDecoration(
          labelText: label,
          border: const OutlineInputBorder(),
          filled: true,
          fillColor: Colors.grey[200],
        ),
        value: selectedValue,
        items:
            items
                .map((item) => DropdownMenuItem(value: item, child: Text(item)))
                .toList(),
        onChanged: onChanged,
      ),
    );
  }
}
