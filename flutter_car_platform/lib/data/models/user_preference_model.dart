class UserPreferenceModel {
  final String? id;
  final String userId;
  final List<String> preferredBrands;
  final double? maxPrice;
  final double? minPrice;
  final List<String> preferredCities;
  final bool notifyOnNewCars;
  final bool notifyOnChatMessages;
  final String? fcmToken;
  final DateTime? updatedAt;

  UserPreferenceModel({
    this.id,
    required this.userId,
    this.preferredBrands = const [],
    this.maxPrice,
    this.minPrice,
    this.preferredCities = const [],
    this.notifyOnNewCars = true,
    this.notifyOnChatMessages = true,
    this.fcmToken,
    this.updatedAt,
  });

  factory UserPreferenceModel.fromJson(Map<String, dynamic> json) {
    return UserPreferenceModel(
      id: json['id'] as String?,
      userId: json['user_id'] as String,
      preferredBrands: (json['preferred_brands'] as List<dynamic>?)
              ?.map((e) => e.toString())
              .toList() ??
          [],
      maxPrice: (json['max_price'] != null)
          ? double.tryParse(json['max_price'].toString())
          : null,
      minPrice: (json['min_price'] != null)
          ? double.tryParse(json['min_price'].toString())
          : null,
      preferredCities: (json['preferred_cities'] as List<dynamic>?)
              ?.map((e) => e.toString())
              .toList() ??
          [],
      notifyOnNewCars: json['notify_on_new_cars'] as bool? ?? true,
      notifyOnChatMessages: json['notify_on_chat_messages'] as bool? ?? true,
      fcmToken: json['fcm_token'] as String?,
      updatedAt: json['updated_at'] != null
          ? DateTime.parse(json['updated_at'] as String)
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      if (id != null) 'id': id,
      'user_id': userId,
      'preferred_brands': preferredBrands,
      'max_price': maxPrice,
      'min_price': minPrice,
      'preferred_cities': preferredCities,
      'notify_on_new_cars': notifyOnNewCars,
      'notify_on_chat_messages': notifyOnChatMessages,
      if (fcmToken != null) 'fcm_token': fcmToken,
      'updated_at': (updatedAt ?? DateTime.now()).toIso8601String(),
    };
  }

  UserPreferenceModel copyWith({
    List<String>? preferredBrands,
    double? maxPrice,
    double? minPrice,
    List<String>? preferredCities,
    bool? notifyOnNewCars,
    bool? notifyOnChatMessages,
    String? fcmToken,
  }) {
    return UserPreferenceModel(
      id: id,
      userId: userId,
      preferredBrands: preferredBrands ?? this.preferredBrands,
      maxPrice: maxPrice ?? this.maxPrice,
      minPrice: minPrice ?? this.minPrice,
      preferredCities: preferredCities ?? this.preferredCities,
      notifyOnNewCars: notifyOnNewCars ?? this.notifyOnNewCars,
      notifyOnChatMessages: notifyOnChatMessages ?? this.notifyOnChatMessages,
      fcmToken: fcmToken ?? this.fcmToken,
      updatedAt: DateTime.now(),
    );
  }

  // Helper method to check if a car matches this user's preferences
  bool matchesCar({required String brand, required double price, required String city}) {
    if (!notifyOnNewCars) return false;

    // Check brand filter
    if (preferredBrands.isNotEmpty && !preferredBrands.contains(brand)) {
      return false;
    }

    // Check max price
    if (maxPrice != null && price > maxPrice!) {
      return false;
    }

    // Check min price
    if (minPrice != null && price < minPrice!) {
      return false;
    }

    // Check city filter
    if (preferredCities.isNotEmpty && !preferredCities.contains(city)) {
      return false;
    }

    return true;
  }
}
