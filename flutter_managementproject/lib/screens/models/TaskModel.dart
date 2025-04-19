// ignore: file_names
import 'package:flutter_managementproject/screens/models/SubTaskModel.dart';

class TaskModel {
  final String? id;
  final String? taskName;
  final String? description;
  final String? assigneeEmail;
  final String? startDate;
  final String? endDate;
  final String? priority;
  final String? status;
  final String? projectId;
  final List<SubTask>? subtasks;

  TaskModel({
    this.id,
    this.taskName,
    this.description,
    this.assigneeEmail,
    this.startDate,
    this.endDate,
    this.priority,
    this.status,
    this.projectId,
    this.subtasks,
  });

  factory TaskModel.fromJson(Map<String, dynamic> json) {
    return TaskModel(
      id: json['id'],
      taskName: json['taskName'],
      description: json['description'],
      assigneeEmail: json['assigneeEmail'],
      startDate: json['startDate'],
      endDate: json['endDate'],
      priority: json['priority'],
      status: json['status'],
      projectId: json['projectId'],
      subtasks:
          (json['subtasks'] as List<dynamic>?)
              ?.map((e) => SubTask.fromJson(e))
              .toList(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'taskName': taskName,
      'description': description,
      'assigneeEmail': assigneeEmail,
      'startDate': startDate,
      'endDate': endDate,
      'priority': priority,
      'status': status,
      'projectId': projectId,
      'subtasks': subtasks?.map((e) => e.toJson()).toList(),
    };
  }
}
