class ConversationModel {
  final String id;
  final String participant1;
  final String participant2;
  final String? carId;
  final String lastMessage;
  final DateTime updatedAt;
  final String? otherUserName;
  final String? otherUserAvatar;
  final String? carTitle;

  ConversationModel({
    required this.id,
    required this.participant1,
    required this.participant2,
    this.carId,
    required this.lastMessage,
    required this.updatedAt,
    this.otherUserName,
    this.otherUserAvatar,
    this.carTitle,
  });

  factory ConversationModel.fromJson(Map<String, dynamic> json) {
    return ConversationModel(
      id: json['id'] as String,
      participant1: json['participant1'] as String,
      participant2: json['participant2'] as String,
      carId: json['car_id'] as String?,
      lastMessage: json['last_message'] as String? ?? '',
      updatedAt: json['updated_at'] != null
          ? DateTime.parse(json['updated_at'] as String)
          : DateTime.now(),
      otherUserName: json['other_user_name'] as String?,
      otherUserAvatar: json['other_user_avatar'] as String?,
      carTitle: json['car_title'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'participant1': participant1,
      'participant2': participant2,
      'car_id': carId,
      'last_message': lastMessage,
      'updated_at': updatedAt.toIso8601String(),
    };
  }
}
