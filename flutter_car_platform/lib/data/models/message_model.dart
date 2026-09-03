class MessageModel {
  final String id;
  final String? conversationId;
  final String senderId;
  final String receiverId;
  final String? carId;
  final String content;
  final DateTime createdAt;

  MessageModel({
    required this.id,
    this.conversationId,
    required this.senderId,
    required this.receiverId,
    this.carId,
    required this.content,
    required this.createdAt,
  });

  factory MessageModel.fromJson(Map<String, dynamic> json) {
    return MessageModel(
      id: json['id'] as String,
      conversationId: json['conversation_id'] as String?,
      senderId: json['sender_id'] as String,
      receiverId: json['receiver_id'] as String,
      carId: json['car_id'] as String?,
      content: json['content'] as String? ?? '',
      createdAt: json['created_at'] != null
          ? DateTime.parse(json['created_at'] as String)
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'conversation_id': conversationId,
      'sender_id': senderId,
      'receiver_id': receiverId,
      'car_id': carId,
      'content': content,
      'created_at': createdAt.toIso8601String(),
    };
  }
}
