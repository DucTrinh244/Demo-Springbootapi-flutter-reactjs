import 'package:flutter/material.dart';
import 'package:flutter_managementproject/screens/auth/Splash_screen.dart';
import 'package:flutter_managementproject/screens/auth/login_screen.dart';
import 'package:flutter_managementproject/screens/auth/register_screen.dart';
import 'package:flutter_managementproject/screens/chat/add_room_sreen.dart';
import 'package:flutter_managementproject/screens/chat/chat_screen.dart';
import 'package:flutter_managementproject/screens/chat/main_chat_screen.dart';
import 'package:flutter_managementproject/screens/check/shared_prefs_page.dart';
import 'package:flutter_managementproject/screens/home_screen.dart';
import 'package:flutter_managementproject/screens/models/RoomModel.dart';
import 'package:flutter_managementproject/screens/models/SubTaskModel.dart';
import 'package:flutter_managementproject/screens/models/TaskModel.dart';
import 'package:flutter_managementproject/screens/project/add_project_screen.dart';
import 'package:flutter_managementproject/screens/project/detail_project_over_screen.dart';
import 'package:flutter_managementproject/screens/project/detail_project_screen.dart';
import 'package:flutter_managementproject/screens/project/main_project_screen.dart';
import 'package:flutter_managementproject/screens/task/add_task_screen.dart';
import 'package:flutter_managementproject/screens/task/detail_subtask.dart';
import 'package:flutter_managementproject/screens/task/main_task_screen.dart';
import 'package:flutter_managementproject/screens/task/task_detail_screen.dart';
import 'package:flutter_managementproject/screens/user/account_screen.dart';
import 'package:flutter_managementproject/screens/user/profile_screen.dart';

void main() {
  // WidgetsFlutterBinding.ensureInitialized();

  // // Initialize WebSocket service
  // WebSocketService().initializeWebSocket(url: '$baseUrl/chat');
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
      ),
      home:
          const SplashScreen(), // ⚠️ ĐỔI TỪ DashboardScreen THÀNH SplashScreen
      // home: const MyHomePage(title: 'Flutter Demo Home Page'),
      // routes: appRoutes,
      routes: {
        '/profile': (context) => const ProfileScreen(),
        '/account': (context) {
          final args =
              ModalRoute.of(context)!.settings.arguments
                  as Map<String, dynamic>?;
          return AccountScreen(arguments: args ?? {});
        },
        '/dashboard': (context) => const HomeScreen(),
        '/project': (context) => const MainProjectScreen(),
        '/task': (context) => const MainTaskScreen(),
        '/LocalData': (context) => const SharedPrefsPage(),
        '/add-project': (context) => const AddProjectScreen(),
        '/add-task': (context) {
          final args =
              ModalRoute.of(context)!.settings.arguments
                  as Map<String, dynamic>;
          return CreateTaskScreen(
            projectId: args['projectId'],
            projectName: args['projectName'],
          );
        },
        '/task-detail':
            (context) => TaskDetailScreen(
              task: ModalRoute.of(context)!.settings.arguments as TaskModel,
            ),
        '/subtask-detail':
            (context) => SubtaskDetailScreen(
              subtask: ModalRoute.of(context)!.settings.arguments as SubTask,
            ),

        '/chat':
            (context) => ChatScreen(
              room: ModalRoute.of(context)!.settings.arguments as RoomModel,
            ),
        '/main-chat': (context) => const MainChatScreen(),
        '/create-room': (context) => const CreateRoomScreen(),
        '/detail-project': (context) => const DetailProjectScreen(),
        '/detail-project-over': (context) => const DetailProjectOverScreen(),
        '/login': (context) => const LoginScreen(),
        '/register': (context) => const RegisterScreen(),
      },
    );
  }
}

// class MyHomePage extends StatelessWidget {
//   const MyHomePage({super.key, required this.title});

//   final String title;

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(
//         backgroundColor: Theme.of(context).colorScheme.inversePrimary,
//         title: Text(title),
//       ),
//       body: GridView.builder(
//         padding: const EdgeInsets.all(16.0),
//         gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
//           crossAxisCount: 2, // Số cột
//           crossAxisSpacing: 10.0,
//           mainAxisSpacing: 10.0,
//         ),
//         itemCount: 2, // Chỉ có 2 ô
//         itemBuilder: (context, index) {
//           return GestureDetector(
//             onTap: () {
//               if (index == 0) {
//                 Navigator.push(
//                   context,
//                   MaterialPageRoute(builder: (context) => AddUserPage()),
//                 );
//               } else if (index == 1) {
//                 Navigator.push(
//                   context,
//                   MaterialPageRoute(builder: (context) => UserListScreen()),
//                 );
//               }
//             },
//             child: Container(
//               decoration: BoxDecoration(
//                 color: Colors.deepPurple[100],
//                 borderRadius: BorderRadius.circular(8.0),
//               ),
//               child: Center(
//                 child: Text(
//                   index == 0 ? 'Add User' : 'User List',
//                   style: const TextStyle(
//                     fontSize: 18,
//                     fontWeight: FontWeight.bold,
//                   ),
//                 ),
//               ),
//             ),
//           );
//         },
//       ),
//     );
//   }
// }
