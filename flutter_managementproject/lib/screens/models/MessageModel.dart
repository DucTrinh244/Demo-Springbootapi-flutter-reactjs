class MessageModel {
  final String sender;
  final String content;
  final DateTime timeStamp;

  MessageModel({
    required this.sender,
    required this.content,
    required this.timeStamp,
  });

  factory MessageModel.fromJson(Map<String, dynamic> json) {
    return MessageModel(
      sender: json['sender'],
      content: json['content'],
      timeStamp: DateTime.parse(json['timeStamp']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'sender': sender,
      'content': content,
      'timeStamp': timeStamp.toIso8601String(),
    };
  }
}
