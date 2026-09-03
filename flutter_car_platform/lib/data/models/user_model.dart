class UserModel {
  final String id;
  final String email;
  final String name;
  final String? phone;
  final String role; // 'user', 'showroom_owner', 'admin'
  final String? avatar;
  final DateTime createdAt;

  UserModel({
    required this.id,
    required this.email,
    required this.name,
    this.phone,
    this.role = 'user',
    this.avatar,
    required this.createdAt,
  });

  bool get isAdmin => role == 'admin';
  bool get isShowroomOwner => role == 'showroom_owner';

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] as String,
      email: json['email'] as String? ?? '',
      name: json['name'] as String? ?? 'مستخدم',
      phone: json['phone'] as String?,
      role: json['role'] as String? ?? 'user',
      avatar: json['avatar'] as String?,
      createdAt: json['created_at'] != null
          ? DateTime.parse(json['created_at'] as String)
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'name': name,
      'phone': phone,
      'role': role,
      'avatar': avatar,
      'created_at': createdAt.toIso8601String(),
    };
  }
}
