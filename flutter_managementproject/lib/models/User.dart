// ignore: file_names
class User {
  final String id;
  final String name;
  final String email;

  User({required this.id, required this.name, required this.email});

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['_id'] ?? '', // Thay null bằng chuỗi rỗng ''
      name: json['name'] ?? 'No Name', // Giá trị mặc định
      email: json['email'] ?? 'No Email',
    );
  }
  // Phương thức chuyển User thành JSON
  Map<String, dynamic> toJson() {
    return {'id': id, 'name': name, 'email': email};
  }
}
