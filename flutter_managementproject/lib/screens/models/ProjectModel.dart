class ProjectModel {
  final String projectId;
  final String projectName;
  final String description;
  final String startDate;
  final String endDate;
  final String projectOwnerId;
  final String status;
  final String? priority;
  final double budget;
  final List<String> members;

  ProjectModel({
    required this.projectId,
    required this.projectName,
    required this.description,
    required this.startDate,
    required this.endDate,
    required this.projectOwnerId,
    required this.status,
    this.priority,
    required this.budget,
    required this.members,
  });

  factory ProjectModel.fromJson(Map<String, dynamic> json) {
    return ProjectModel(
      projectId: json['projectId'],
      projectName: json['projectName'],
      description: json['description'],
      startDate: json['startDate'],
      endDate: json['endDate'],
      projectOwnerId: json['projectOwnerId'],
      status: json['status'],
      priority: json['priority'],
      budget: (json['budget'] as num).toDouble(),
      members: List<String>.from(json['members']),
    );
  }
}
