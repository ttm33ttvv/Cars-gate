class ShowroomRatingModel {
  final String id;
  final String showroomId;
  final String userId;
  final String userName;
  final String? userAvatar;
  final int rating; // 1 to 5
  final String comment;
  final DateTime createdAt;

  ShowroomRatingModel({
    required this.id,
    required this.showroomId,
    required this.userId,
    required this.userName,
    this.userAvatar,
    required this.rating,
    required this.comment,
    required this.createdAt,
  });

  factory ShowroomRatingModel.fromJson(Map<String, dynamic> json) {
    // Check if user object is joined
    final userObj = json['users'] as Map<String, dynamic>?;

    return ShowroomRatingModel(
      id: json['id'] as String,
      showroomId: json['showroom_id'] as String,
      userId: json['user_id'] as String,
      userName: userObj?['name'] as String? ?? json['user_name'] as String? ?? 'مشتري معتمد',
      userAvatar: userObj?['avatar'] as String? ?? json['user_avatar'] as String?,
      rating: (json['rating'] as num?)?.toInt() ?? 5,
      comment: json['comment'] as String? ?? '',
      createdAt: json['created_at'] != null
          ? DateTime.parse(json['created_at'] as String)
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'showroom_id': showroomId,
      'user_id': userId,
      'rating': rating,
      'comment': comment,
    };
  }
}
