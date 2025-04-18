import 'package:flutter/material.dart';
import 'package:flutter_managementproject/screens/auth/login_screen.dart';
import 'package:flutter_managementproject/screens/auth/register_screen.dart';
import 'package:flutter_managementproject/screens/chat/chat_screen.dart';
import 'package:flutter_managementproject/screens/chat/main_chat_screen.dart';
import 'package:flutter_managementproject/screens/check/shared_prefs_page.dart';
import 'package:flutter_managementproject/screens/dashboard_screen.dart';
import 'package:flutter_managementproject/screens/project/add_project_screen.dart';
import 'package:flutter_managementproject/screens/project/detail_project_screen.dart';
import 'package:flutter_managementproject/screens/project/main_project_screen.dart';
import 'package:flutter_managementproject/screens/task/add_task_screen.dart';
import 'package:flutter_managementproject/screens/task/main_task_screen.dart';
import 'package:flutter_managementproject/screens/user/profile_screen.dart';

void main() {
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
      home: const DashboardScreen(),
      // home: const MyHomePage(title: 'Flutter Demo Home Page'),
      // routes: appRoutes,
      routes: {
        '/profile': (context) => const ProfileScreen(),
        '/dashboard': (context) => const DashboardScreen(),
        '/project': (context) => const MainProjectScreen(),
        '/task': (context) => const MainTaskScreen(),
        '/LocalData': (context) => const SharedPrefsPage(),
        '/add-project': (context) => const AddProjectScreen(),
        '/add-task': (context) => const CreateTaskScreen(),
        '/chat': (context) => const ChatScreen(groupName: 'Flutter Developers'),
        '/main-chat': (context) => const MainChatScreen(),
        '/detail-project': (context) => const DetailProjectScreen(),
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
