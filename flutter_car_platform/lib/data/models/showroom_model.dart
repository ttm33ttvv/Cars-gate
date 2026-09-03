import 'car_model.dart';
import 'showroom_rating_model.dart';

class ShowroomModel {
  final String id;
  final String name;
  final String? logo;
  final String? description;
  final String location;
  final String? phone;
  final String? userId;
  final double averageRating;
  final int ratingsCount;
  final DateTime createdAt;
  List<CarModel> latestCars;
  List<ShowroomRatingModel> ratings;

  ShowroomModel({
    required this.id,
    required this.name,
    this.logo,
    this.description,
    required this.location,
    this.phone,
    this.userId,
    this.averageRating = 5.0,
    this.ratingsCount = 0,
    required this.createdAt,
    this.latestCars = const [],
    this.ratings = const [],
  });

  factory ShowroomModel.fromJson(Map<String, dynamic> json, {List<CarModel>? cars, List<ShowroomRatingModel>? ratings}) {
    return ShowroomModel(
      id: json['id'] as String,
      name: json['name'] as String? ?? 'معرض سيارات',
      logo: json['logo'] as String?,
      description: json['description'] as String?,
      location: json['location'] as String? ?? 'صنعاء، اليمن',
      phone: json['phone'] as String?,
      userId: json['user_id'] as String?,
      averageRating: (json['average_rating'] as num?)?.toDouble() ?? 5.0,
      ratingsCount: (json['ratings_count'] as num?)?.toInt() ?? 0,
      createdAt: json['created_at'] != null
          ? DateTime.parse(json['created_at'] as String)
          : DateTime.now(),
      latestCars: cars ?? [],
      ratings: ratings ?? [],
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
      'average_rating': averageRating,
      'ratings_count': ratingsCount,
      'created_at': createdAt.toIso8601String(),
    };
  }
}
