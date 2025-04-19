import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_managementproject/Services/globals.dart';
import 'package:flutter_managementproject/screens/models/SubTaskModel.dart';
import 'package:flutter_managementproject/screens/models/TaskModel.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class TaskDetailScreen extends StatefulWidget {
  final TaskModel task;

  const TaskDetailScreen({super.key, required this.task});

  @override
  State<TaskDetailScreen> createState() => _TaskDetailScreenState();
}

class _TaskDetailScreenState extends State<TaskDetailScreen> {
  bool _isExpanded = false;
  List<SubTask> _subtasks = [];

  @override
  void initState() {
    super.initState();
    _subtasks = widget.task.subtasks ?? [];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        iconTheme: IconThemeData(color: Colors.black),
        title: Text('Task Detail', style: TextStyle(color: Colors.black)),
        actions: [
          IconButton(icon: Icon(Icons.edit_outlined), onPressed: () {}),
          IconButton(icon: Icon(Icons.more_vert), onPressed: () {}),
        ],
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildTaskHeader(),
            SizedBox(height: 24),
            _buildTaskDetails(),
            SizedBox(height: 24),
            _buildAssignedSection(),
            SizedBox(height: 24),
            // _buildAttachments(),
            // SizedBox(height: 24),
            _buildSubtasksSection(),
            SizedBox(height: 24),
            // _buildCommentsSection(),
          ],
        ),
      ),
    );
  }

  Widget _buildTaskHeader() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Container(
              padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: Colors.deepPurple,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(
                widget.task.taskName ?? 'UI/UX Design',
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
            Spacer(),
            Container(
              padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: _getPriorityColor(widget.task.priority),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(
                widget.task.priority?.toUpperCase() ?? 'HIGH',
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
          ],
        ),
        SizedBox(height: 16),
        Text(
          widget.task.taskName ?? 'Design System for Mobile App',
          style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
        ),
        SizedBox(height: 8),
        Container(
          padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          decoration: BoxDecoration(
            color: _getStatusColor(widget.task.status),
            borderRadius: BorderRadius.circular(20),
          ),
          child: Text(
            widget.task.status ?? 'In Progress',
            style: TextStyle(
              color: _getStatusTextColor(widget.task.status),
              fontWeight: FontWeight.w500,
            ),
          ),
        ),
        SizedBox(height: 16),
        Row(
          children: [
            Icon(Icons.calendar_today, size: 16, color: Colors.grey),
            SizedBox(width: 8),
            Text(
              'Due: ${widget.task.endDate ?? 'May 10, 2025'}',
              style: TextStyle(color: Colors.grey),
            ),
            SizedBox(width: 24),
            Icon(Icons.access_time, size: 16, color: Colors.grey),
            SizedBox(width: 8),
            Text(
              'Started: ${widget.task.startDate ?? 'Apr 15, 2025'}',
              style: TextStyle(color: Colors.grey),
            ),
          ],
        ),
      ],
    );
  }

  Color _getPriorityColor(String? priority) {
    if (priority == null) return Colors.orangeAccent;

    switch (priority.toLowerCase()) {
      case 'high':
        return Colors.orangeAccent;
      case 'medium':
        return Colors.amber;
      case 'low':
        return Colors.blue;
      default:
        return Colors.grey;
    }
  }

  Color _getStatusColor(String? status) {
    if (status == null) return Colors.green[100]!;

    switch (status.toLowerCase()) {
      case 'completed':
        return Colors.green[100]!;
      case 'in progress':
        return Colors.blue[100]!;
      case 'pending':
        return Colors.amber[100]!;
      case 'on hold':
        return Colors.red[100]!;
      default:
        return Colors.grey[100]!;
    }
  }

  Color _getStatusTextColor(String? status) {
    if (status == null) return Colors.green[800]!;

    switch (status.toLowerCase()) {
      case 'completed':
        return Colors.green[800]!;
      case 'in progress':
        return Colors.blue[800]!;
      case 'pending':
        return Colors.amber[800]!;
      case 'on hold':
        return Colors.red[800]!;
      default:
        return Colors.grey[800]!;
    }
  }

  Widget _buildTaskDetails() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Description',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        SizedBox(height: 8),
        Text(
          widget.task.description ??
              'Create a comprehensive design system for our mobile application. This includes creating UI components, style guides, and interaction patterns that will be used across the app.',
          style: TextStyle(fontSize: 16, color: Colors.black87, height: 1.5),
        ),
        SizedBox(height: 16),
        ExpansionPanelList(
          elevation: 1,
          expandedHeaderPadding: EdgeInsets.zero,
          expansionCallback: (int index, bool isExpanded) {
            setState(() {
              _isExpanded = !isExpanded;
            });
          },
        ),
      ],
    );
  }

  Widget _buildAssignedSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Assigned To',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        SizedBox(height: 12),
        Row(
          children: [
            CircleAvatar(
              radius: 20,
              backgroundImage: NetworkImage(
                'https://www.w3schools.com/w3images/avatar2.png',
              ),
            ),
            SizedBox(width: 12),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  widget.task.assigneeEmail?.split('@').first ?? 'You',
                  style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16),
                ),
                Text(
                  widget.task.assigneeEmail ?? 'UI/UX Designer',
                  style: TextStyle(color: Colors.grey, fontSize: 14),
                ),
              ],
            ),
            Spacer(),
            OutlinedButton.icon(
              onPressed: () {},
              icon: Icon(Icons.person_add_alt),
              label: Text('Add'),
              style: OutlinedButton.styleFrom(
                foregroundColor: Colors.deepPurple,
                side: BorderSide(color: Colors.deepPurple),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20),
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }

  // Widget _buildAttachments() {
  //   return Column(
  //     crossAxisAlignment: CrossAxisAlignment.start,
  //     children: [
  //       Row(
  //         children: [
  //           Text(
  //             'Attachments',
  //             style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
  //           ),
  //           SizedBox(width: 8),
  //           Text('(3)', style: TextStyle(fontSize: 16, color: Colors.grey)),
  //           Spacer(),
  //           TextButton.icon(
  //             onPressed: () {},
  //             icon: Icon(Icons.attach_file),
  //             label: Text('Add'),
  //             style: TextButton.styleFrom(foregroundColor: Colors.deepPurple),
  //           ),
  //         ],
  //       ),
  //       SizedBox(height: 12),
  //       Row(
  //         children: [
  //           _buildAttachmentItem(
  //             icon: Icons.picture_as_pdf,
  //             color: Colors.red,
  //             name: 'Requirements.pdf',
  //             size: '2.4 MB',
  //           ),
  //           SizedBox(width: 16),
  //           _buildAttachmentItem(
  //             icon: Icons.image,
  //             color: Colors.blue,
  //             name: 'References.png',
  //             size: '1.8 MB',
  //           ),
  //         ],
  //       ),
  //     ],
  //   );
  // }

  // Widget _buildAttachmentItem({
  //   required IconData icon,
  //   required Color color,
  //   required String name,
  //   required String size,
  // }) {
  //   return Expanded(
  //     child: Container(
  //       padding: EdgeInsets.all(12),
  //       decoration: BoxDecoration(
  //         border: Border.all(color: Colors.grey[300]!),
  //         borderRadius: BorderRadius.circular(10),
  //       ),
  //       child: Row(
  //         children: [
  //           Container(
  //             padding: EdgeInsets.all(8),
  //             decoration: BoxDecoration(
  //               color: color.withOpacity(0.1),
  //               borderRadius: BorderRadius.circular(8),
  //             ),
  //             child: Icon(icon, color: color, size: 20),
  //           ),
  //           SizedBox(width: 8),
  //           Expanded(
  //             child: Column(
  //               crossAxisAlignment: CrossAxisAlignment.start,
  //               children: [
  //                 Text(
  //                   name,
  //                   style: TextStyle(fontWeight: FontWeight.w500, fontSize: 14),
  //                   overflow: TextOverflow.ellipsis,
  //                 ),
  //                 Text(
  //                   size,
  //                   style: TextStyle(color: Colors.grey, fontSize: 12),
  //                 ),
  //               ],
  //             ),
  //           ),
  //         ],
  //       ),
  //     ),
  //   );
  // }

  Widget _buildSubtasksSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Text(
              'Subtasks',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            SizedBox(width: 8),
            Text(
              '(${_subtasks.length})',
              style: TextStyle(fontSize: 16, color: Colors.grey),
            ),
            Spacer(),
            TextButton.icon(
              onPressed: _showAddSubtaskDialog,
              icon: Icon(Icons.add),
              label: Text('Add'),
              style: TextButton.styleFrom(foregroundColor: Colors.deepPurple),
            ),
          ],
        ),
        SizedBox(height: 16),
        if (_subtasks.isEmpty)
          Center(
            child: Padding(
              padding: EdgeInsets.symmetric(vertical: 20),
              child: Text(
                'No subtasks yet. Add one to get started!',
                style: TextStyle(color: Colors.grey),
              ),
            ),
          )
        else
          ..._subtasks.map((subtask) => _buildSubtaskItem(subtask)).toList(),
      ],
    );
  }

  Widget _buildSubtaskItem(SubTask subtask) {
    bool isCompleted = subtask.status?.toLowerCase() == 'completed';

    return Container(
      margin: EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        border: Border.all(color: Colors.grey[300]!),
        borderRadius: BorderRadius.circular(10),
      ),
      child: ListTile(
        contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        leading: Checkbox(
          value: isCompleted,
          activeColor: Colors.deepPurple,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
          onChanged: (bool? value) {
            setState(() {
              // Find the index of the subtask in the list by comparing references
              final index = _subtasks.indexOf(subtask);
              if (index != -1) {
                _subtasks[index] = _subtasks[index].copyWith(
                  status: value ?? false ? 'Completed' : 'In Progress',
                );
              }
            });
          },
        ),
        title: Text(
          subtask.subtaskName ?? 'Unnamed Task',
          style: TextStyle(
            fontWeight: FontWeight.w600,
            decoration: isCompleted ? TextDecoration.lineThrough : null,
            color: isCompleted ? Colors.grey : Colors.black,
          ),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(height: 4),
            Text(
              subtask.description ?? 'No description',
              style: TextStyle(color: Colors.grey[600], fontSize: 13),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            SizedBox(height: 8),
            Row(
              children: [
                Icon(Icons.calendar_today, size: 14, color: Colors.grey),
                SizedBox(width: 4),
                Text(
                  '${subtask.startDate ?? 'N/A'} - ${subtask.endDate ?? 'N/A'}',
                  style: TextStyle(color: Colors.grey, fontSize: 12),
                ),
                SizedBox(width: 16),
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                  decoration: BoxDecoration(
                    color: _getStatusColor(subtask.status),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Text(
                    subtask.status ?? 'Pending',
                    style: TextStyle(
                      color: _getStatusTextColor(subtask.status),
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
        trailing: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              'Assignee',
              style: TextStyle(fontSize: 10, color: Colors.grey),
            ),
            SizedBox(height: 4),
            Text(
              'You',
              style: TextStyle(fontSize: 12, fontWeight: FontWeight.w500),
            ),
          ],
        ),
        onTap: () {
          // Show subtask details or edit dialog
        },
      ),
    );
  }

  // Widget _buildCommentsSection() {
  //   return Column(
  //     crossAxisAlignment: CrossAxisAlignment.start,
  //     children: [
  //       Text(
  //         'Comments',
  //         style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
  //       ),
  //       SizedBox(height: 16),
  //       _buildCommentItem(
  //         avatar: 'https://www.w3schools.com/w3images/avatar5.png',
  //         name: 'Sarah Johnson',
  //         time: '10:30 AM',
  //         comment:
  //             'Please review the color palette I sent yesterday. I think we need more contrast for accessibility.',
  //       ),
  //       SizedBox(height: 12),
  //       _buildCommentItem(
  //         avatar: 'https://www.w3schools.com/w3images/avatar2.png',
  //         name: 'You',
  //         time: '11:45 AM',
  //         comment: 'I agree. I\'ll update the design and share it by EOD.',
  //       ),
  //       SizedBox(height: 16),
  //       Container(
  //         padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
  //         decoration: BoxDecoration(
  //           color: Colors.grey[100],
  //           borderRadius: BorderRadius.circular(25),
  //         ),
  //         child: Row(
  //           children: [
  //             Expanded(
  //               child: TextField(
  //                 decoration: InputDecoration(
  //                   hintText: 'Add a comment...',
  //                   border: InputBorder.none,
  //                 ),
  //               ),
  //             ),
  //             IconButton(
  //               icon: Icon(Icons.send, color: Colors.deepPurple),
  //               onPressed: () {},
  //             ),
  //           ],
  //         ),
  //       ),
  //     ],
  //   );
  // }

  // Widget _buildCommentItem({
  //   required String avatar,
  //   required String name,
  //   required String time,
  //   required String comment,
  // }) {
  //   return Row(
  //     crossAxisAlignment: CrossAxisAlignment.start,
  //     children: [
  //       CircleAvatar(radius: 20, backgroundImage: NetworkImage(avatar)),
  //       SizedBox(width: 12),
  //       Expanded(
  //         child: Column(
  //           crossAxisAlignment: CrossAxisAlignment.start,
  //           children: [
  //             Row(
  //               children: [
  //                 Text(name, style: TextStyle(fontWeight: FontWeight.w600)),
  //                 SizedBox(width: 8),
  //                 Text(
  //                   time,
  //                   style: TextStyle(color: Colors.grey, fontSize: 12),
  //                 ),
  //               ],
  //             ),
  //             SizedBox(height: 4),
  //             Text(comment, style: TextStyle(height: 1.4)),
  //             SizedBox(height: 4),
  //             Row(
  //               children: [
  //                 TextButton(
  //                   onPressed: () {},
  //                   child: Text(
  //                     'Reply',
  //                     style: TextStyle(color: Colors.grey[600], fontSize: 12),
  //                   ),
  //                   style: TextButton.styleFrom(
  //                     minimumSize: Size.zero,
  //                     padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
  //                     tapTargetSize: MaterialTapTargetSize.shrinkWrap,
  //                   ),
  //                 ),
  //                 TextButton(
  //                   onPressed: () {},
  //                   child: Text(
  //                     'Edit',
  //                     style: TextStyle(color: Colors.grey[600], fontSize: 12),
  //                   ),
  //                   style: TextButton.styleFrom(
  //                     minimumSize: Size.zero,
  //                     padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
  //                     tapTargetSize: MaterialTapTargetSize.shrinkWrap,
  //                   ),
  //                 ),
  //               ],
  //             ),
  //           ],
  //         ),
  //       ),
  //     ],
  //   );
  // }

  void _showAddSubtaskDialog() {
    String? subtaskName;
    String? description;
    String? assigneeEmail;
    String? startDate;
    String? endDate;
    String? status = 'Pending';

    TextEditingController startDateController = TextEditingController();
    TextEditingController endDateController = TextEditingController();

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Add Subtask'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Subtask Name
                TextField(
                  decoration: InputDecoration(
                    labelText: 'Subtask Name',
                    border: OutlineInputBorder(),
                  ),
                  onChanged: (value) {
                    subtaskName = value;
                  },
                ),
                SizedBox(height: 16),

                // Description
                TextField(
                  decoration: InputDecoration(
                    labelText: 'Description',
                    border: OutlineInputBorder(),
                  ),
                  maxLines: 3,
                  onChanged: (value) {
                    description = value;
                  },
                ),
                SizedBox(height: 16),

                // Start Date
                TextField(
                  controller: startDateController,
                  readOnly: true,
                  decoration: InputDecoration(
                    labelText: 'Start Date',
                    border: OutlineInputBorder(),
                    suffixIcon: Icon(Icons.calendar_today),
                  ),
                  onTap: () async {
                    DateTime? picked = await showDatePicker(
                      context: context,
                      initialDate: DateTime.now(),
                      firstDate: DateTime(2000),
                      lastDate: DateTime(2100),
                    );
                    if (picked != null) {
                      String formattedDate =
                          "${picked.year}-${picked.month}-${picked.day}";
                      startDateController.text = formattedDate;
                      startDate = formattedDate;
                    }
                  },
                ),
                SizedBox(height: 16),

                // End Date
                TextField(
                  controller: endDateController,
                  readOnly: true,
                  decoration: InputDecoration(
                    labelText: 'End Date',
                    border: OutlineInputBorder(),
                    suffixIcon: Icon(Icons.calendar_today),
                  ),
                  onTap: () async {
                    DateTime? picked = await showDatePicker(
                      context: context,
                      initialDate: DateTime.now(),
                      firstDate: DateTime(2000),
                      lastDate: DateTime(2100),
                    );
                    if (picked != null) {
                      String formattedDate =
                          "${picked.year}-${picked.month}-${picked.day}";
                      endDateController.text = formattedDate;
                      endDate = formattedDate;
                    }
                  },
                ),

                SizedBox(height: 16),
              ],
            ),
          ),
          actions: [
            TextButton(
              child: Text('Cancel'),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
            ElevatedButton(
              child: Text('Add', style: TextStyle(color: Colors.white)),
              onPressed: () {
                setState(() {
                  _subtasks.add(
                    SubTask(
                      subtaskName: subtaskName ?? 'New Subtask',
                      description: description,
                      assigneeEmail: assigneeEmail,
                      startDate: startDate,
                      endDate: endDate,
                      status: status,
                    ),
                  );
                });

                addSubTask(
                  widget.task.id ?? '',
                  subtaskName ?? 'New Subtask',
                  description ?? '',
                  startDate ?? '',
                  endDate ?? '',
                );

                Navigator.of(context).pop();
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.deepPurple,
              ),
            ),
          ],
        );
      },
    );
  }

  // ignore: non_constant_identifier_names
  Future<bool> addSubTask(
    // ignore: non_constant_identifier_names
    String TaskId,
    String subTaskName,
    String description,
    String startDate,
    String endDate,
  ) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? email = prefs.getString('email');
    SubTask subTask = SubTask(
      subtaskName: subTaskName,
      description: description,
      assigneeEmail: email,
      startDate: startDate,
      endDate: endDate,
      status: 'Pending',
    );
    try {
      final response = await http.put(
        Uri.parse('$baseUrl/api/tasks/$TaskId/subtasks'),
        headers: await getAuthHeaders(),
        body: jsonEncode(subTask.toJson()),
      );

      if (response.statusCode == 201 || response.statusCode == 200) {
        Fluttertoast.showToast(
          msg: "Thêm SubTask thành công",
          toastLength: Toast.LENGTH_SHORT,
          gravity: ToastGravity.BOTTOM,
          backgroundColor: Colors.green,
          textColor: Colors.white,
          fontSize: 16.0,
        );
        return true;
      } else {
        Fluttertoast.showToast(
          msg: "Thêm SubTask thất bại'$baseUrl/api/tasks/$TaskId/subtasks'",
          toastLength: Toast.LENGTH_SHORT,
          gravity: ToastGravity.BOTTOM,
          backgroundColor: Colors.red,
          textColor: Colors.white,
          fontSize: 16.0,
        );
        return false;
      }
    } catch (e) {
      Fluttertoast.showToast(
        msg: "Lỗi kết nối",
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.BOTTOM,
        backgroundColor: Colors.red,
        textColor: Colors.white,
        fontSize: 16.0,
      );
      return false;
    }
  }
}
