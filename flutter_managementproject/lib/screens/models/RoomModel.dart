import 'package:flutter_managementproject/screens/models/MessageModel.dart';

class RoomModel {
  final String id;
  final String roomId;
  final String roomName;
  final String userEmail;
  final List<MessageModel> messages;
  final List<String> members;

  RoomModel({
    required this.id,
    required this.roomId,
    required this.roomName,
    required this.userEmail,
    required this.messages,
    required this.members,
  });

  factory RoomModel.fromJson(Map<String, dynamic> json) {
    return RoomModel(
      id: json['id'],
      roomId: json['roomId'],
      roomName: json['roomName'],
      userEmail: json['userEmail'],
      messages:
          (json['messages'] as List<dynamic>)
              .map((msgJson) => MessageModel.fromJson(msgJson))
              .toList(),
      members: List<String>.from(json['members']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'roomId': roomId,
      'roomName': roomName,
      'userEmail': userEmail,
      'messages': messages.map((msg) => msg.toJson()).toList(),
      'members': members,
    };
  }
}
