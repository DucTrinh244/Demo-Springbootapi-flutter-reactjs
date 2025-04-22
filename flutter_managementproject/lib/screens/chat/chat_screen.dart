import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_managementproject/Services/globals.dart';
import 'package:flutter_managementproject/screens/chat/group_info_screen.dart';
import 'package:flutter_managementproject/screens/models/MessageModel.dart';
import 'package:flutter_managementproject/screens/models/RoomModel.dart';
import 'package:intl/intl.dart';
import 'package:stomp_dart_client/stomp.dart';
import 'package:stomp_dart_client/stomp_config.dart';
import 'package:stomp_dart_client/stomp_frame.dart';

class ChatScreen extends StatefulWidget {
  final RoomModel room;

  const ChatScreen({super.key, required this.room});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final TextEditingController _messageController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  StompClient? stompClient;
  String email = '';
  bool isConnected = false;

  @override
  void initState() {
    super.initState();
    _initialize();
  }

  @override
  void dispose() {
    _messageController.dispose();
    _scrollController.dispose();
    _disconnectWebSocket();
    super.dispose();
  }

  Future<void> _initialize() async {
    email = await getEmail();
    setState(() {});
    _connectToWebSocket();
  }

  void _connectToWebSocket() {
    stompClient = StompClient(
      config: StompConfig.sockJS(
        url: '$baseUrl/chat',
        onConnect: _onConnectCallback,
        onWebSocketError: (error) => print('WebSocket error: $error'),
        stompConnectHeaders: {'Authorization': 'Bearer ${getToken()}'},
        webSocketConnectHeaders: {'Authorization': 'Bearer ${getToken()}'},
      ),
    );
    stompClient!.activate();
  }

  void _disconnectWebSocket() {
    stompClient?.deactivate();
  }

  void _onConnectCallback(StompFrame frame) {
    setState(() => isConnected = true);

    stompClient?.subscribe(
      destination: '/topic/room/${widget.room.roomId}',
      callback: (StompFrame frame) {
        if (frame.body != null) {
          final message = jsonDecode(frame.body!);
          _handleNewMessage(message);
        }
      },
    );
  }

  void _handleNewMessage(dynamic messageData) {
    final newMessage = MessageModel(
      sender: messageData['sender'],
      content: messageData['content'],
      timeStamp: DateTime.parse(messageData['timeStamp']),
    );

    setState(() {
      widget.room.messages.add(newMessage);
    });

    _scrollToBottom();
  }

  void _scrollToBottom() {
    Future.delayed(const Duration(milliseconds: 100), () {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  void _sendMessage() {
    final msg = _messageController.text.trim();
    if (msg.isEmpty || !isConnected) return;

    final messageData = {
      'roomId': widget.room.roomId,
      'sender': email,
      'content': msg,
    };

    stompClient?.send(
      destination: '/app/sendMessage/${widget.room.roomId}',
      body: jsonEncode(messageData),
      headers: {'content-type': 'application/json'},
    );

    _messageController.clear();
  }

  String _formatTime(DateTime time) {
    return DateFormat('HH:mm').format(time);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.room.roomName),
        backgroundColor: Colors.blueAccent,
        actions: [
          IconButton(
            icon: const Icon(Icons.info_outline),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => GroupInfoScreen(room: widget.room),
                ),
              );
            },
          ),
        ],
      ),
      body: Column(
        children: [
          if (!isConnected)
            Container(
              color: Colors.amber[100],
              padding: const EdgeInsets.all(8),
              child: Row(
                children: [
                  Icon(Icons.warning, color: Colors.amber[800]),
                  const SizedBox(width: 8),
                  const Text('Đang kết nối đến máy chủ...'),
                ],
              ),
            ),
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.all(12),
              itemCount: widget.room.messages.length,
              itemBuilder: (context, index) {
                final msg = widget.room.messages[index];
                final isMe = msg.sender == email;

                return Align(
                  alignment:
                      isMe ? Alignment.centerRight : Alignment.centerLeft,
                  child: Container(
                    margin: const EdgeInsets.symmetric(vertical: 6),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: isMe ? Colors.blue[100] : Colors.grey[300],
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              msg.sender,
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 14,
                              ),
                            ),
                            const SizedBox(width: 8),
                            Text(
                              _formatTime(msg.timeStamp),
                              style: const TextStyle(
                                fontSize: 12,
                                color: Colors.grey,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Text(msg.content, style: const TextStyle(fontSize: 16)),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              color: Colors.grey[100],
              boxShadow: [
                BoxShadow(
                  color: Colors.grey.shade300,
                  blurRadius: 2,
                  offset: const Offset(0, -1),
                ),
              ],
            ),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _messageController,
                    textInputAction: TextInputAction.send,
                    decoration: InputDecoration(
                      hintText: 'Nhập tin nhắn...',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(24),
                        borderSide: BorderSide.none,
                      ),
                      fillColor: Colors.white,
                      filled: true,
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 12,
                      ),
                    ),
                    onSubmitted: (_) => _sendMessage(),
                  ),
                ),
                const SizedBox(width: 8),
                IconButton(
                  icon: const Icon(Icons.send),
                  color: isConnected ? Colors.blueAccent : Colors.grey,
                  iconSize: 28,
                  onPressed: isConnected ? _sendMessage : null,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
