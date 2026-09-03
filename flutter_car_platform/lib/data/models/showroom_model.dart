import 'car_model.dart';

class ShowroomModel {
  final String id;
  final String name;
  final String? logo;
  final String? description;
  final String location;
  final String? phone;
  final String? userId;
  final DateTime createdAt;
  List<CarModel> latestCars;

  ShowroomModel({
    required this.id,
    required this.name,
    this.logo,
    this.description,
    required this.location,
    this.phone,
    this.userId,
    required this.createdAt,
    this.latestCars = const [],
  });

  factory ShowroomModel.fromJson(Map<String, dynamic> json, {List<CarModel>? cars}) {
    return ShowroomModel(
      id: json['id'] as String,
      name: json['name'] as String? ?? 'معرض سيارات',
      logo: json['logo'] as String?,
      description: json['description'] as String?,
      location: json['location'] as String? ?? 'المملكة العربية السعودية',
      phone: json['phone'] as String?,
      userId: json['user_id'] as String?,
      createdAt: json['created_at'] != null
          ? DateTime.parse(json['created_at'] as String)
          : DateTime.now(),
      latestCars: cars ?? [],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'logo': logo,
      'description': description,
      'location': location,
      'phone': phone,
      'user_id': userId,
      'created_at': createdAt.toIso8601String(),
    };
  }
}
