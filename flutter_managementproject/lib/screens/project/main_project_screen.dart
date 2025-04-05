import 'package:flutter/material.dart';
import 'package:flutter_managementproject/widgets/customer_drawer.dart';

class MainProjectScreen extends StatelessWidget {
  const MainProjectScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 2,
        iconTheme: IconThemeData(color: Colors.black),
        title: Row(
          children: [
            Icon(Icons.search, color: Colors.black),
            SizedBox(width: 10),
            Expanded(
              child: Text('Search', style: TextStyle(color: Colors.black)),
            ),
            CircleAvatar(
              radius: 20,
              backgroundImage: NetworkImage(
                'https://www.w3schools.com/w3images/avatar2.png',
              ),
            ),
            IconButton(
              icon: Icon(Icons.notifications, color: Colors.black),
              onPressed: () {},
            ),
          ],
        ),
      ),
      drawer: CustomDrawer(),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                ElevatedButton(
                  onPressed: () {
                    Navigator.pushNamed(context, '/add-project');
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.deepPurple,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(30),
                    ),
                  ),
                  child: Text(
                    '+ Create Project',
                    style: TextStyle(color: Colors.white),
                  ),
                ),
                Spacer(),
                DropdownButton<String>(
                  value: 'All',
                  items:
                      ['All', 'Started', 'Approval', 'Completed']
                          .map(
                            (e) => DropdownMenuItem(value: e, child: Text(e)),
                          )
                          .toList(),
                  onChanged: (value) {},
                ),
              ],
            ),
            SizedBox(height: 16),
            ProjectCard(),
            SizedBox(height: 16),
            ProjectCard(),
            SizedBox(height: 16),
            ProjectCard(),
          ],
        ),
      ),
    );
  }
}

class ProjectCard extends StatelessWidget {
  const ProjectCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 6,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(Icons.art_track, size: 40, color: Colors.deepPurple),
                SizedBox(width: 10),
                Text(
                  'UI/UX Design',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                Spacer(),
                IconButton(
                  icon: Icon(Icons.edit, color: Colors.black),
                  onPressed: () {},
                ),
                IconButton(
                  icon: Icon(Icons.delete, color: Colors.black),
                  onPressed: () {},
                ),
              ],
            ),
            SizedBox(height: 8),
            Row(
              children: [
                Row(
                  children: [
                    Icon(Icons.attach_file, size: 16),
                    Text(' 5 Attach'),
                  ],
                ),
                SizedBox(width: 20),
                Row(
                  children: [
                    Icon(Icons.access_time, size: 16),
                    Text(' 4 Month'),
                  ],
                ),
                SizedBox(width: 20),
                Row(
                  children: [Icon(Icons.group, size: 16), Text(' 5 Members')],
                ),
              ],
            ),
            SizedBox(height: 16),
            Row(
              children: [
                Text('Progress', style: TextStyle(fontWeight: FontWeight.bold)),
                Spacer(),
                Text('35 Days Left', style: TextStyle(color: Colors.orange)),
              ],
            ),
            SizedBox(height: 8),
            LinearProgressIndicator(
              value: 0.35,
              backgroundColor: Colors.grey[300],
              valueColor: AlwaysStoppedAnimation<Color>(Colors.orange),
            ),
          ],
        ),
      ),
    );
  }
}
