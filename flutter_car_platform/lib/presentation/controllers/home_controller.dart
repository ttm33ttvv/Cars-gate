import 'package:get/get.dart';
import '../../core/services/supabase_service.dart';
import '../../data/models/showroom_model.dart';
import '../../data/models/car_model.dart';

class HomeController extends GetxController {
  final SupabaseService _supabase = SupabaseService.to;

  final RxList<ShowroomModel> showrooms = <ShowroomModel>[].obs;
  final RxBool isLoading = true.obs;
  final RxString errorMessage = ''.obs;
  final RxString searchQuery = ''.obs;

  // Active carousel photo index per showroom
  final RxMap<String, int> activeCarouselIndex = <String, int>{}.obs;

  @override
  void onInit() {
    super.onInit();
    fetchShowroomsWithCars();
  }

  Future<void> fetchShowroomsWithCars() async {
    try {
      isLoading.value = true;
      errorMessage.value = '';

      // 1. Fetch showrooms from Supabase
      final showroomData = await _supabase.client
          .from('showrooms')
          .select()
          .order('created_at', ascending: false);

      List<ShowroomModel> loadedShowrooms = [];

      for (var item in showroomData) {
        final showroomId = item['id'] as String;

        // Fetch cars for this showroom
        final carsData = await _supabase.client
            .from('cars')
            .select()
            .eq('showroom_id', showroomId)
            .eq('status', 'active')
            .order('created_at', ascending: false)
            .limit(6);

        List<CarModel> cars = (carsData as List)
            .map((c) => CarModel.fromJson(c as Map<String, dynamic>))
            .toList();

        final showroom = ShowroomModel.fromJson(
          item as Map<String, dynamic>,
          cars: cars,
        );
        loadedShowrooms.add(showroom);
        activeCarouselIndex[showroomId] = 0;
      }

      showrooms.assignAll(loadedShowrooms);
    } catch (e) {
      errorMessage.value = e.toString();
      Get.log('Error fetching showrooms: $e');
    } finally {
      isLoading.value = false;
    }
  }

  void onCarouselPageChanged(String showroomId, int index) {
    activeCarouselIndex[showroomId] = index;
  }

  List<ShowroomModel> get filteredShowrooms {
    if (searchQuery.value.trim().isEmpty) {
      return showrooms;
    }
    final q = searchQuery.value.trim().toLowerCase();
    return showrooms.where((s) {
      final matchesName = s.name.toLowerCase().contains(q);
      final matchesLocation = s.location.toLowerCase().contains(q);
      final matchesCars = s.latestCars.any((c) =>
          c.brand.toLowerCase().contains(q) ||
          c.model.toLowerCase().contains(q) ||
          c.city.toLowerCase().contains(q));
      return matchesName || matchesLocation || matchesCars;
    }).toList();
  }
}
