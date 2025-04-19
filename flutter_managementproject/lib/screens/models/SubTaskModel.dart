// ignore: file_names
class SubTask {
  final String? subtaskName;
  final String? description;
  final String? assigneeEmail;
  final String? startDate;
  final String? endDate;
  final String? status;

  SubTask({
    this.subtaskName,
    this.description,
    this.assigneeEmail,
    this.startDate,
    this.endDate,
    this.status,
  });
  SubTask copyWith({
    String? subtaskName,
    String? description,
    String? assigneeEmail,
    String? startDate,
    String? endDate,
    String? status,
  }) {
    return SubTask(
      subtaskName: subtaskName ?? this.subtaskName,
      description: description ?? this.description,
      assigneeEmail: assigneeEmail ?? this.assigneeEmail,
      startDate: startDate ?? this.startDate,
      endDate: endDate ?? this.endDate,
      status: status ?? this.status,
    );
  }

  factory SubTask.fromJson(Map<String, dynamic> json) {
    return SubTask(
      subtaskName: json['subtaskName'],
      description: json['description'],
      assigneeEmail: json['assigneeEmail'],
      startDate: json['startDate'],
      endDate: json['endDate'],
      status: json['status'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'subtaskName': subtaskName,
      'description': description,
      'assigneeEmail': assigneeEmail,
      'startDate': startDate,
      'endDate': endDate,
      'status': status,
    };
  }
}
