class CarModel {
  final String id;
  final String? showroomId;
  final String? userId;
  final String brand;
  final String model;
  final int year;
  final double price;
  final String city;
  final String? phone;
  final String? whatsapp;
  final List<String> images;
  final String? description;
  final String status; // 'active', 'pending', 'rejected', 'sold'
  final DateTime createdAt;

  CarModel({
    required this.id,
    this.showroomId,
    this.userId,
    required this.brand,
    required this.model,
    required this.year,
    required this.price,
    required this.city,
    this.phone,
    this.whatsapp,
    this.images = const [],
    this.description,
    this.status = 'pending',
    required this.createdAt,
  });

  String get title => '$brand $model $year';
  bool get isActive => status == 'active';
  bool get isPending => status == 'pending';
  bool get isRejected => status == 'rejected';

  String get mainImage {
    if (images.isNotEmpty && images.first.isNotEmpty) {
      return images.first;
    }
    return 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800';
  }

  factory CarModel.fromJson(Map<String, dynamic> json) {
    List<String> parsedImages = [];
    if (json['images'] != null) {
      if (json['images'] is List) {
        parsedImages = (json['images'] as List).map((e) => e.toString()).toList();
      }
    }

    return CarModel(
      id: json['id'] as String,
      showroomId: json['showroom_id'] as String?,
      userId: json['user_id'] as String?,
      brand: json['brand'] as String? ?? '',
      model: json['model'] as String? ?? '',
      year: (json['year'] as num?)?.toInt() ?? 2024,
      price: (json['price'] as num?)?.toDouble() ?? 0.0,
      city: json['city'] as String? ?? 'الرياض',
      phone: json['phone'] as String?,
      whatsapp: json['whatsapp'] as String?,
      images: parsedImages,
      description: json['description'] as String?,
      status: json['status'] as String? ?? 'pending',
      createdAt: json['created_at'] != null
          ? DateTime.parse(json['created_at'] as String)
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'showroom_id': showroomId,
      'user_id': userId,
      'brand': brand,
      'model': model,
      'year': year,
      'price': price,
      'city': city,
      'phone': phone,
      'whatsapp': whatsapp,
      'images': images,
      'description': description,
      'status': status,
      'created_at': createdAt.toIso8601String(),
    };
  }
}
