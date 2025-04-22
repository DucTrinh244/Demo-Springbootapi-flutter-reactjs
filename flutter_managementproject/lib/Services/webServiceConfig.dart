import 'dart:async';

import 'package:stomp_dart_client/stomp.dart';
import 'package:stomp_dart_client/stomp_config.dart';
import 'package:stomp_dart_client/stomp_frame.dart';

class WebSocketService {
  static final WebSocketService _instance = WebSocketService._internal();

  factory WebSocketService() {
    return _instance;
  }

  WebSocketService._internal();

  StompClient? _stompClient;
  bool isConnected = false;

  final StreamController<bool> _connectionStateController =
      StreamController<bool>.broadcast();
  Stream<bool> get connectionState => _connectionStateController.stream;

  // Initialize and connect to WebSocket server
  Future<void> initializeWebSocket({required String url}) async {
    _stompClient = StompClient(
      config: StompConfig(
        url: url,
        onConnect: (StompFrame frame) {
          isConnected = true;
          _connectionStateController.add(true);
          print('Connected to WebSocket');
        },
        onDisconnect: (StompFrame frame) {
          isConnected = false;
          _connectionStateController.add(false);
          print('Disconnected from WebSocket');
        },
        onWebSocketError: (dynamic error) {
          isConnected = false;
          _connectionStateController.add(false);
          print('WebSocket Error: $error');
        },
        // Additional configuration as needed
        reconnectDelay: const Duration(milliseconds: 5000),
      ),
    );

    _stompClient?.activate();
  }

  // Subscribe to a specific destination
  void subscribe({
    required String destination,
    required Function(StompFrame) callback,
  }) {
    if (_stompClient != null && isConnected) {
      _stompClient!.subscribe(destination: destination, callback: callback);
    } else {
      print('Cannot subscribe: WebSocket not connected');
    }
  }

  // Send a message to a specific destination
  void sendMessage({
    required String destination,
    required String body,
    Map<String, String>? headers,
  }) {
    if (_stompClient != null && isConnected) {
      _stompClient!.send(
        destination: destination,
        body: body,
        headers: headers,
      );
    } else {
      print('Cannot send message: WebSocket not connected');
    }
  }

  // Disconnect from WebSocket server
  void disconnect() {
    _stompClient?.deactivate();
  }

  // Dispose of resources
  void dispose() {
    _connectionStateController.close();
    disconnect();
  }
}
