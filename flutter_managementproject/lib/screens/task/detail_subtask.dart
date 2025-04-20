import 'package:flutter/material.dart';
import 'package:flutter_managementproject/screens/models/SubTaskModel.dart';

class SubtaskDetailScreen extends StatefulWidget {
  final SubTask subtask;
  // final Function(SubTask) onSubtaskUpdated;

  const SubtaskDetailScreen({super.key, required this.subtask});

  @override
  State<SubtaskDetailScreen> createState() => _SubtaskDetailScreenState();
}

class _SubtaskDetailScreenState extends State<SubtaskDetailScreen> {
  late TextEditingController _nameController;
  late TextEditingController _descriptionController;
  late TextEditingController _assigneeController;
  late TextEditingController _startDateController;
  late TextEditingController _endDateController;
  String _currentStatus = 'Not Started';
  bool _isEditing = false;

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController(text: widget.subtask.subtaskName);
    _descriptionController = TextEditingController(
      text: widget.subtask.description,
    );
    _assigneeController = TextEditingController(
      text: widget.subtask.assigneeEmail,
    );
    _startDateController = TextEditingController(
      text: widget.subtask.startDate,
    );
    _endDateController = TextEditingController(text: widget.subtask.endDate);
    _currentStatus = widget.subtask.status ?? 'Not Started';
  }

  @override
  void dispose() {
    _nameController.dispose();
    _descriptionController.dispose();
    _assigneeController.dispose();
    _startDateController.dispose();
    _endDateController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        iconTheme: IconThemeData(color: Colors.black),
        title: Text('Subtask Details', style: TextStyle(color: Colors.black)),
        actions: [
          if (!_isEditing)
            IconButton(
              icon: Icon(Icons.edit_outlined),
              onPressed: () {
                setState(() {
                  _isEditing = true;
                });
              },
            ),
          if (_isEditing)
            IconButton(icon: Icon(Icons.check), onPressed: _saveChanges),
          IconButton(
            icon: Icon(Icons.delete_outline),
            onPressed: () {
              _showDeleteConfirmationDialog();
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildSubtaskHeader(),
            SizedBox(height: 24),
            _buildSubtaskDetails(),
            SizedBox(height: 24),
            _buildTimelineSection(),
            SizedBox(height: 24),
            _buildStatusSection(),
            SizedBox(height: 24),
            _buildAssigneeSection(),
            SizedBox(height: 24),
            _buildAttachmentsSection(),
            SizedBox(height: 24),
            _buildDependenciesSection(),
            SizedBox(height: 24),
            _buildCommentsSection(),
          ],
        ),
      ),
    );
  }

  Widget _buildSubtaskHeader() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          decoration: BoxDecoration(
            color: _getStatusColor(_currentStatus),
            borderRadius: BorderRadius.circular(20),
          ),
          child: Text(
            _currentStatus,
            style: TextStyle(
              color: _getStatusTextColor(_currentStatus),
              fontWeight: FontWeight.w500,
            ),
          ),
        ),
        SizedBox(height: 16),
        _isEditing
            ? TextField(
              controller: _nameController,
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              decoration: InputDecoration(
                border: OutlineInputBorder(),
                labelText: 'Subtask Name',
              ),
            )
            : Text(
              widget.subtask.subtaskName ?? 'Unnamed Subtask',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
      ],
    );
  }

  Widget _buildSubtaskDetails() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Description',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        SizedBox(height: 8),
        _isEditing
            ? TextField(
              controller: _descriptionController,
              maxLines: 5,
              decoration: InputDecoration(
                border: OutlineInputBorder(),
                hintText: 'Enter subtask description',
              ),
            )
            : Text(
              widget.subtask.description ?? 'No description provided.',
              style: TextStyle(
                fontSize: 16,
                color: Colors.black87,
                height: 1.5,
              ),
            ),
      ],
    );
  }

  Widget _buildTimelineSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Timeline',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        SizedBox(height: 16),
        _isEditing
            ? Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _startDateController,
                    decoration: InputDecoration(
                      border: OutlineInputBorder(),
                      labelText: 'Start Date',
                      suffixIcon: IconButton(
                        icon: Icon(Icons.calendar_today),
                        onPressed:
                            () => _selectDate(context, _startDateController),
                      ),
                    ),
                  ),
                ),
                SizedBox(width: 16),
                Expanded(
                  child: TextField(
                    controller: _endDateController,
                    decoration: InputDecoration(
                      border: OutlineInputBorder(),
                      labelText: 'End Date',
                      suffixIcon: IconButton(
                        icon: Icon(Icons.calendar_today),
                        onPressed:
                            () => _selectDate(context, _endDateController),
                      ),
                    ),
                  ),
                ),
              ],
            )
            : _buildTimelineVisual(),
      ],
    );
  }

  Widget _buildTimelineVisual() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.grey[100],
        borderRadius: BorderRadius.circular(8),
      ),
      padding: EdgeInsets.all(16),
      child: Column(
        children: [
          Row(
            children: [
              Icon(Icons.calendar_today, size: 16),
              SizedBox(width: 8),
              Text(
                'Start: ${widget.subtask.startDate ?? 'Not set'}',
                style: TextStyle(fontWeight: FontWeight.w500),
              ),
            ],
          ),
          SizedBox(height: 8),
          Row(
            children: [
              Icon(Icons.flag, size: 16),
              SizedBox(width: 8),
              Text(
                'End: ${widget.subtask.endDate ?? 'Not set'}',
                style: TextStyle(fontWeight: FontWeight.w500),
              ),
            ],
          ),
          SizedBox(height: 16),
          LinearProgressIndicator(
            value: _getProgressValue(),
            backgroundColor: Colors.grey[300],
            valueColor: AlwaysStoppedAnimation<Color>(
              _getProgressColor(_currentStatus),
            ),
          ),
          SizedBox(height: 8),
          Text(
            _getProgressText(),
            style: TextStyle(
              color: Colors.grey[600],
              fontStyle: FontStyle.italic,
            ),
          ),
        ],
      ),
    );
  }

  double _getProgressValue() {
    switch (_currentStatus.toLowerCase()) {
      case 'completed':
        return 1.0;
      case 'in progress':
        return 0.5;
      case 'on hold':
        return 0.3;
      case 'not started':
        return 0.0;
      default:
        return 0.0;
    }
  }

  Color _getProgressColor(String status) {
    switch (status.toLowerCase()) {
      case 'completed':
        return Colors.green;
      case 'in progress':
        return Colors.blue;
      case 'on hold':
        return Colors.orange;
      case 'not started':
        return Colors.grey;
      default:
        return Colors.grey;
    }
  }

  String _getProgressText() {
    switch (_currentStatus.toLowerCase()) {
      case 'completed':
        return 'Task completed';
      case 'in progress':
        return 'Work in progress';
      case 'on hold':
        return 'Currently on hold';
      case 'not started':
        return 'Not started yet';
      default:
        return 'Status unknown';
    }
  }

  Widget _buildStatusSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Status',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        SizedBox(height: 16),
        _isEditing
            ? DropdownButtonFormField<String>(
              value: _currentStatus,
              decoration: InputDecoration(
                border: OutlineInputBorder(),
                contentPadding: EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 8,
                ),
              ),
              items:
                  ['Not Started', 'In Progress', 'On Hold', 'Completed'].map((
                    String value,
                  ) {
                    return DropdownMenuItem<String>(
                      value: value,
                      child: Text(value),
                    );
                  }).toList(),
              onChanged: (String? newValue) {
                if (newValue != null) {
                  setState(() {
                    _currentStatus = newValue;
                  });
                }
              },
            )
            : Row(
              children: [
                Container(
                  width: 16,
                  height: 16,
                  decoration: BoxDecoration(
                    color: _getProgressColor(_currentStatus),
                    shape: BoxShape.circle,
                  ),
                ),
                SizedBox(width: 8),
                Text(
                  _currentStatus,
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
                ),
              ],
            ),
      ],
    );
  }

  Widget _buildAssigneeSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Assignee',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        SizedBox(height: 16),
        _isEditing
            ? TextField(
              controller: _assigneeController,
              decoration: InputDecoration(
                border: OutlineInputBorder(),
                labelText: 'Assignee Email',
                prefixIcon: Icon(Icons.person),
              ),
            )
            : Row(
              children: [
                CircleAvatar(
                  radius: 20,
                  backgroundColor: Colors.deepPurple,
                  child: Text(
                    _getInitials(widget.subtask.assigneeEmail),
                    style: TextStyle(color: Colors.white),
                  ),
                ),
                SizedBox(width: 12),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      _getNameFromEmail(widget.subtask.assigneeEmail),
                      style: TextStyle(
                        fontWeight: FontWeight.w600,
                        fontSize: 16,
                      ),
                    ),
                    Text(
                      widget.subtask.assigneeEmail ?? 'Unassigned',
                      style: TextStyle(color: Colors.grey, fontSize: 14),
                    ),
                  ],
                ),
              ],
            ),
      ],
    );
  }

  String _getInitials(String? email) {
    if (email == null || email.isEmpty) return 'NA';

    final name = email.split('@')[0];
    final parts = name.split('.');
    if (parts.length > 1) {
      return '${parts[0][0]}${parts[1][0]}'.toUpperCase();
    } else {
      return name.isNotEmpty ? name[0].toUpperCase() : 'NA';
    }
  }

  String _getNameFromEmail(String? email) {
    if (email == null || email.isEmpty) return 'Unassigned';

    final name = email.split('@')[0];
    final parts = name.split('.');
    if (parts.length > 1) {
      return '${_capitalize(parts[0])} ${_capitalize(parts[1])}';
    } else {
      return _capitalize(name);
    }
  }

  String _capitalize(String s) {
    if (s.isEmpty) return '';
    return s[0].toUpperCase() + s.substring(1);
  }

  Widget _buildAttachmentsSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Text(
              'Attachments',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            Spacer(),
            TextButton.icon(
              onPressed: () {},
              icon: Icon(Icons.attach_file),
              label: Text('Add'),
              style: TextButton.styleFrom(foregroundColor: Colors.deepPurple),
            ),
          ],
        ),
        SizedBox(height: 12),
        Container(
          decoration: BoxDecoration(
            color: Colors.grey[100],
            borderRadius: BorderRadius.circular(8),
          ),
          padding: EdgeInsets.all(16),
          width: double.infinity,
          child: Column(
            children: [
              Icon(Icons.cloud_upload_outlined, size: 48, color: Colors.grey),
              SizedBox(height: 8),
              Text(
                'No attachments yet',
                style: TextStyle(color: Colors.grey[600]),
              ),
              SizedBox(height: 8),
              TextButton(
                onPressed: () {},
                child: Text('Add Attachment'),
                style: TextButton.styleFrom(foregroundColor: Colors.deepPurple),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildDependenciesSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Text(
              'Dependencies',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            Spacer(),
            TextButton.icon(
              onPressed: () {},
              icon: Icon(Icons.link),
              label: Text('Link'),
              style: TextButton.styleFrom(foregroundColor: Colors.deepPurple),
            ),
          ],
        ),
        SizedBox(height: 12),
        Container(
          decoration: BoxDecoration(
            color: Colors.grey[100],
            borderRadius: BorderRadius.circular(8),
          ),
          padding: EdgeInsets.all(16),
          width: double.infinity,
          child: Column(
            children: [
              Icon(Icons.link_off, size: 48, color: Colors.grey),
              SizedBox(height: 8),
              Text(
                'No linked dependencies',
                style: TextStyle(color: Colors.grey[600]),
              ),
              SizedBox(height: 8),
              Text(
                'Link this subtask to other tasks that need to be completed before or after this one',
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.grey[500], fontSize: 12),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildCommentsSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Comments',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        SizedBox(height: 16),
        Container(
          padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            color: Colors.grey[100],
            borderRadius: BorderRadius.circular(25),
          ),
          child: Row(
            children: [
              Expanded(
                child: TextField(
                  decoration: InputDecoration(
                    hintText: 'Add a comment...',
                    border: InputBorder.none,
                  ),
                ),
              ),
              IconButton(
                icon: Icon(Icons.send, color: Colors.deepPurple),
                onPressed: () {},
              ),
            ],
          ),
        ),
        SizedBox(height: 20),
        Center(
          child: Text('No comments yet', style: TextStyle(color: Colors.grey)),
        ),
      ],
    );
  }

  void _selectDate(
    BuildContext context,
    TextEditingController controller,
  ) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(2023),
      lastDate: DateTime(2030),
    );
    if (picked != null) {
      setState(() {
        controller.text = "${picked.day}/${picked.month}/${picked.year}";
      });
    }
  }

  void _saveChanges() {
    final updatedSubtask = SubTask(
      subtaskName: _nameController.text,
      description: _descriptionController.text,
      assigneeEmail: _assigneeController.text,
      startDate: _startDateController.text,
      endDate: _endDateController.text,
      status: _currentStatus,
    );

    // widget.onSubtaskUpdated(updatedSubtask);

    setState(() {
      _isEditing = false;
    });

    ScaffoldMessenger.of(
      context,
    ).showSnackBar(SnackBar(content: Text('Subtask updated successfully')));
  }

  void _showDeleteConfirmationDialog() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Delete Subtask'),
          content: Text(
            'Are you sure you want to delete this subtask? This action cannot be undone.',
          ),
          actions: [
            TextButton(
              child: Text('Cancel'),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
            TextButton(
              child: Text('Delete', style: TextStyle(color: Colors.red)),
              onPressed: () {
                // Implement delete functionality here
                Navigator.of(context).pop(); // Close dialog
                Navigator.of(context).pop(); // Return to previous screen
              },
            ),
          ],
        );
      },
    );
  }

  Color _getStatusColor(String? status) {
    if (status == null) return Colors.grey[100]!;

    switch (status.toLowerCase()) {
      case 'completed':
        return Colors.green[100]!;
      case 'in progress':
        return Colors.blue[100]!;
      case 'on hold':
        return Colors.orange[100]!;
      case 'not started':
        return Colors.grey[100]!;
      default:
        return Colors.grey[100]!;
    }
  }

  Color _getStatusTextColor(String? status) {
    if (status == null) return Colors.grey[800]!;

    switch (status.toLowerCase()) {
      case 'completed':
        return Colors.green[800]!;
      case 'in progress':
        return Colors.blue[800]!;
      case 'on hold':
        return Colors.orange[800]!;
      case 'not started':
        return Colors.grey[800]!;
      default:
        return Colors.grey[800]!;
    }
  }
}
