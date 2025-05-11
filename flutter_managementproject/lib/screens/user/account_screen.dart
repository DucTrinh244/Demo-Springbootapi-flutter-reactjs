import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class AccountScreen extends StatefulWidget {
  const AccountScreen({super.key});

  @override
  State<AccountScreen> createState() => _AccountScreenState();
}

class _AccountScreenState extends State<AccountScreen> {
  // Sample user data - in a real app, this would come from your backend
  final Map<String, dynamic> userData = {
    'name': 'John Doe',
    'email': 'johndoe@example.com',
    'phone': '+84 912 345 678',
    'dateOfBirth': DateTime(1990, 5, 15),
    'address': '123 Nguyen Hue Street, District 1, Ho Chi Minh City',
    'occupation': 'Software Developer',
    'company': 'Tech Solutions Inc.',
    'joinDate': DateTime(2022, 3, 10),
  };

  bool isEditing = false;
  late TextEditingController nameController;
  late TextEditingController phoneController;
  late TextEditingController addressController;
  late TextEditingController occupationController;
  late TextEditingController companyController;
  DateTime? selectedDate;

  @override
  void initState() {
    super.initState();
    nameController = TextEditingController(text: userData['name']);
    phoneController = TextEditingController(text: userData['phone']);
    addressController = TextEditingController(text: userData['address']);
    occupationController = TextEditingController(text: userData['occupation']);
    companyController = TextEditingController(text: userData['company']);
    selectedDate = userData['dateOfBirth'];
  }

  @override
  void dispose() {
    nameController.dispose();
    phoneController.dispose();
    addressController.dispose();
    occupationController.dispose();
    companyController.dispose();
    super.dispose();
  }

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: selectedDate ?? DateTime.now(),
      firstDate: DateTime(1950),
      lastDate: DateTime.now(),
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: const ColorScheme.light(
              primary: Colors.indigo,
              onPrimary: Colors.white,
              onSurface: Color(0xFF2D3748),
            ),
            textButtonTheme: TextButtonThemeData(
              style: TextButton.styleFrom(foregroundColor: Colors.indigo),
            ),
          ),
          child: child!,
        );
      },
    );
    if (picked != null && picked != selectedDate) {
      setState(() {
        selectedDate = picked;
      });
    }
  }

  void _toggleEdit() {
    setState(() {
      isEditing = !isEditing;
      if (!isEditing) {
        // Save the changes (in a real app, you would send this to your backend)
        userData['name'] = nameController.text;
        userData['phone'] = phoneController.text;
        userData['address'] = addressController.text;
        userData['occupation'] = occupationController.text;
        userData['company'] = companyController.text;
        userData['dateOfBirth'] = selectedDate;

        // Show success message
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Row(
              children: [
                Icon(Icons.check_circle_outline, color: Colors.white),
                SizedBox(width: 10),
                Text('Thông tin đã được cập nhật thành công!'),
              ],
            ),
            backgroundColor: Colors.green,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.all(Radius.circular(10)),
            ),
            margin: EdgeInsets.all(10),
          ),
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      appBar: AppBar(
        title: const Text(
          'Account Information',
          style: TextStyle(fontWeight: FontWeight.w600),
        ),
        centerTitle: true,
        elevation: 0,
        backgroundColor: Colors.white,
        foregroundColor: const Color(0xFF2D3748),
        actions: [
          TextButton.icon(
            onPressed: _toggleEdit,
            icon: Icon(
              isEditing ? Icons.save_outlined : Icons.edit_outlined,
              color: Colors.indigo,
            ),
            label: Text(
              isEditing ? 'Save' : 'Edit',
              style: const TextStyle(color: Colors.indigo),
            ),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Header
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 20),
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.only(
                  bottomLeft: Radius.circular(30),
                  bottomRight: Radius.circular(30),
                ),
                boxShadow: [
                  BoxShadow(
                    color: Color(0x0A000000),
                    blurRadius: 10,
                    offset: Offset(0, 4),
                  ),
                ],
              ),
              child: Column(
                children: [
                  const Text(
                    'Personal Information',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF2D3748),
                    ),
                  ),
                  const SizedBox(height: 5),
                  Text(
                    'Update your personal details here',
                    style: TextStyle(fontSize: 14, color: Colors.grey.shade600),
                  ),
                  const SizedBox(height: 10),
                  Container(
                    width: 60,
                    height: 4,
                    decoration: BoxDecoration(
                      color: Colors.indigo.shade100,
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // User Information
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildSectionTitle('Basic Details'),

                  _buildTextField(
                    label: 'Full Name',
                    controller: nameController,
                    icon: Icons.person_outline,
                    isEditable: isEditing,
                  ),

                  _buildTextField(
                    label: 'Email',
                    value: userData['email'],
                    icon: Icons.email_outlined,
                    isEditable: false, // Email is not editable
                    hintText: 'This field cannot be changed',
                  ),

                  _buildTextField(
                    label: 'Phone Number',
                    controller: phoneController,
                    icon: Icons.phone_outlined,
                    isEditable: isEditing,
                    keyboardType: TextInputType.phone,
                  ),

                  const SizedBox(height: 25),
                ],
              ),
            ),
          ],
        ),
      ),
      floatingActionButton:
          isEditing
              ? FloatingActionButton.extended(
                onPressed: _toggleEdit,
                backgroundColor: Colors.indigo,
                foregroundColor: Colors.white,
                icon: const Icon(Icons.save),
                label: const Text('Save Changes'),
              )
              : null,
    );
  }

  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.only(left: 8, bottom: 12, top: 8),
      child: Text(
        title,
        style: const TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.w600,
          color: Color(0xFF2D3748),
        ),
      ),
    );
  }

  Widget _buildTextField({
    required String label,
    String? value,
    required IconData icon,
    TextEditingController? controller,
    bool isEditable = true,
    TextInputType keyboardType = TextInputType.text,
    int maxLines = 1,
    String? hintText,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.07),
            blurRadius: 8,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon, size: 22, color: Colors.indigo),
                const SizedBox(width: 10),
                Text(
                  label,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                    color: Colors.grey.shade700,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),
            isEditable
                ? TextField(
                  controller: controller,
                  enabled: isEditable,
                  keyboardType: keyboardType,
                  maxLines: maxLines,
                  style: const TextStyle(
                    fontSize: 16,
                    color: Color(0xFF2D3748),
                  ),
                  decoration: InputDecoration(
                    hintText: hintText,
                    hintStyle: TextStyle(color: Colors.grey.shade400),
                    contentPadding: const EdgeInsets.symmetric(vertical: 8),
                    isDense: true,
                    border: InputBorder.none,
                  ),
                )
                : Text(
                  value ?? controller?.text ?? '',
                  style: const TextStyle(
                    fontSize: 16,
                    color: Color(0xFF2D3748),
                  ),
                ),
          ],
        ),
      ),
    );
  }

  Widget _buildDateField({required String label, required IconData icon}) {
    final formattedDate =
        selectedDate != null
            ? DateFormat('MMMM dd, yyyy').format(selectedDate!)
            : 'Not set';

    return GestureDetector(
      onTap: isEditing ? () => _selectDate(context) : null,
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.07),
              blurRadius: 8,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Icon(icon, size: 22, color: Colors.indigo),
                  const SizedBox(width: 10),
                  Text(
                    label,
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                      color: Colors.grey.shade700,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              Row(
                children: [
                  Expanded(
                    child: Text(
                      formattedDate,
                      style: const TextStyle(
                        fontSize: 16,
                        color: Color(0xFF2D3748),
                      ),
                    ),
                  ),
                  if (isEditing)
                    const Icon(
                      Icons.calendar_month,
                      color: Colors.indigo,
                      size: 20,
                    ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
