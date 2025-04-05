import 'package:flutter/material.dart';
import 'package:flutter_managementproject/screens/project/add_project_screen.dart';
import 'package:flutter_managementproject/screens/project/main_project_screen.dart';
import 'package:flutter_managementproject/screens/user/profile_screen.dart';

final Map<String, WidgetBuilder> appRoutes = {
  '/profile': (context) => const ProfileScreen(),
  '/project': (context) => const MainProjectScreen(),
  '/task': (context) => const ProfileScreen(),
  '/add-project': (context) => const AddProjectScreen(),
  '/update-project': (context) => const ProfileScreen(),
  '/chat': (context) => const ProfileScreen(),
};
