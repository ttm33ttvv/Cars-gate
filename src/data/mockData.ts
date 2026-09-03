import { Showroom, Car, Conversation, User } from '../types';

export const INITIAL_SHOWROOMS: Showroom[] = [
  {
    id: 'a1111111-0000-0000-0000-000000000001',
    name: 'معرض صنعاء الدولي للسيارات',
    logo: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=300',
    description: 'أكبر معرض للسيارات الحديثة والفاخرة في صنعاء، وارد وكالة ومجمرك جاهز مع الضمان.',
    location: 'صنعاء - شارع الستين الجنوبي',
    phone: '+967771234567',
    userId: '22222222-2222-2222-2222-222222222222',
    averageRating: 4.8,
    ratingsCount: 24,
    ratings: [
      {
        id: 'r1',
        showroomId: 'a1111111-0000-0000-0000-000000000001',
        userId: 'u101',
        userName: 'عادل الأنسي',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
        rating: 5,
        comment: 'من أفضل المعارض في صنعاء، تعامل راقي ومصداقية تامة في الفحص والسيارات نظيفة جداً كرت ومجمركة.',
        createdAt: 'قبل يومين'
      },
      {
        id: 'r2',
        showroomId: 'a1111111-0000-0000-0000-000000000001',
        userId: 'u102',
        userName: 'د. نبيل الشرجبي',
        userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100',
        rating: 5,
        comment: 'اشتريت مرسيدس S500 وكانت الإجراءات الجمركية ونقل الملكية سريعة ومنظمة في نفس اليوم. أنصح بالتعامل معهم.',
        createdAt: 'قبل 5 أيام'
      },
      {
        id: 'r3',
        showroomId: 'a1111111-0000-0000-0000-000000000001',
        userId: 'u103',
        userName: 'م. كمال الذبحاني',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        rating: 4,
        comment: 'معرض ممتاز والسيارات مختارة بعناية، الأسعار بالدولار منطقية مقارنة بنظافة المركبات.',
        createdAt: 'قبل أسبوعين'
      }
    ],
    cars: [
      {
        id: 'c1111111-0000-0000-0000-000000000001',
        showroomId: 'a1111111-0000-0000-0000-000000000001',
        brand: 'مرسيدس بنز',
        model: 'S-Class S500',
        year: 2024,
        price: 62000,
        city: 'صنعاء',
        phone: '+967771234567',
        whatsapp: '+967771234567',
        images: [
          'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',
          'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800'
        ],
        description: 'مرسيدس S500 فل كامل مواصفات خليجية، مجمرك مرقم جاهز، أصفار وكالة مع فحص شامل وضمان.',
        status: 'active',
        createdAt: '2026-09-01T10:00:00Z',
      },
      {
        id: 'c1111111-0000-0000-0000-000000000002',
        showroomId: 'a1111111-0000-0000-0000-000000000001',
        brand: 'بي إم دبليو',
        model: '7 Series 740i',
        year: 2023,
        price: 48000,
        city: 'صنعاء',
        phone: '+967771234567',
        whatsapp: '+967771234567',
        images: [
          'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
          'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800'
        ],
        description: 'بي إم دبليو الفئة السابعة M-Sport، شاشة سينما خلفية، رادار وقيادة ذاتية، مجمرك صنعاء.',
        status: 'active',
        createdAt: '2026-09-02T12:00:00Z',
      }
    ]
  },
  {
    id: 'a1111111-0000-0000-0000-000000000002',
    name: 'معرض عدن سيتي موتورز',
    logo: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=300',
    description: 'متخصصون في استيراد سيارات الدفع الرباعي وتويوتا لاند كروزر ولكزس النظيفة والمضمونة في عدن.',
    location: 'عدن - المنصورة، خط التسعين',
    phone: '+967733987654',
    userId: '22222222-2222-2222-2222-222222222222',
    averageRating: 4.9,
    ratingsCount: 31,
    ratings: [
      {
        id: 'r21',
        showroomId: 'a1111111-0000-0000-0000-000000000002',
        userId: 'u201',
        userName: 'وسام اليافعي',
        userAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100',
        rating: 5,
        comment: 'خدمة فوق الممتازة في فرع المنصورة بعدن، شريت لاند كروزر VXR مفحوص وجاهز بضمان.',
        createdAt: 'قبل 3 أيام'
      },
      {
        id: 'r22',
        showroomId: 'a1111111-0000-0000-0000-000000000002',
        userId: 'u202',
        userName: 'هشام العدني',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
        rating: 5,
        comment: 'وفروا لي فحص كمبيوتر دقيق وتسهيل إنهاء الجمارك والأرقام. قمة في الأمانة والاحترام.',
        createdAt: 'قبل أسبوع'
      }
    ],
    cars: [
      {
        id: 'c1111111-0000-0000-0000-000000000003',
        showroomId: 'a1111111-0000-0000-0000-000000000002',
        brand: 'تويوتا',
        model: 'لاند كروزر VXR',
        year: 2024,
        price: 55000,
        city: 'عدن',
        phone: '+967733987654',
        whatsapp: '+967733987654',
        images: [
          'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?w=800',
          'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800'
        ],
        description: 'تويوتا لاند كروزر VXR توين تيربو، فتحة سقف، تبريد مقاعد ونظام ملاحة، مجمرك عدن.',
        status: 'active',
        createdAt: '2026-09-02T14:30:00Z',
      }
    ]
  },
  {
    id: 'a1111111-0000-0000-0000-000000000003',
    name: 'معرض حضرموت الدولي للسيارات',
    logo: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=300',
    description: 'تشكيلة واسعة من سيارات تويوتا ولكزس ونيسان وهيونداي المستوردة والمجمركة بالمكلا.',
    location: 'المكلا - حي فوه، الشارع العام',
    phone: '+967712345678',
    userId: '22222222-2222-2222-2222-222222222222',
    averageRating: 4.7,
    ratingsCount: 19,
    ratings: [
      {
        id: 'r31',
        showroomId: 'a1111111-0000-0000-0000-000000000003',
        userId: 'u301',
        userName: 'سالم باعباد',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
        rating: 5,
        comment: 'معرض متميز في المكلا - حي فوه، تعامل صادق وأمانة عالية في فحص البودي والمحركات.',
        createdAt: 'قبل 4 أيام'
      },
      {
        id: 'r32',
        showroomId: 'a1111111-0000-0000-0000-000000000003',
        userId: 'u302',
        userName: 'أحمد بن محفوظ',
        userAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100',
        rating: 4,
        comment: 'خيارات واسعة من سيارات الدفع الرباعي النظيفة بأسعار مناسبة ومعاملة راقية.',
        createdAt: 'قبل 10 أيام'
      }
    ],
    cars: [
      {
        id: 'c1111111-0000-0000-0000-000000000004',
        showroomId: 'a1111111-0000-0000-0000-000000000003',
        brand: 'بورش',
        model: 'باناميرا 4S',
        year: 2023,
        price: 49000,
        city: 'المكلا',
        phone: '+967712345678',
        whatsapp: '+967712345678',
        images: [
          'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800'
        ],
        description: 'بورش باناميرا بحالة الوكالة، عداد 14,000 كم فقط، نظيفة جداً كرت ومجمركة.',
        status: 'active',
        createdAt: '2026-09-03T08:00:00Z',
      }
    ]
  }
];

export const INITIAL_PENDING_CARS: Car[] = [
  {
    id: 'c1111111-0000-0000-0000-000000000005',
    userId: '33333333-3333-3333-3333-333333333333',
    brand: 'لكزس',
    model: 'LX 600 VIP',
    year: 2024,
    price: 68000,
    city: 'صنعاء',
    phone: '+967774444444',
    whatsapp: '+967774444444',
    images: [
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800'
    ],
    description: 'إعلان من المالك مباشرة بصنعاء: لكزس LX600 أعلى فئة VIP 4 مقاعد، كرت وارد خليجي مجمرك.',
    status: 'pending',
    createdAt: '2026-09-03T11:00:00Z',
  },
  {
    id: 'c1111111-0000-0000-0000-000000000006',
    userId: '33333333-3333-3333-3333-333333333333',
    brand: 'أودي',
    model: 'RSQ8 Carbon',
    year: 2023,
    price: 58000,
    city: 'عدن',
    phone: '+967735112233',
    whatsapp: '+967735112233',
    images: [
      'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800'
    ],
    description: 'أودي RSQ8 فل كاربون فايبر، تبريد وتدفئة مقاعد ومساج، جنوط 23 بوصة، مجمرك عدن.',
    status: 'pending',
    createdAt: '2026-09-03T13:45:00Z',
  }
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'sample_conv_1',
    participant1: '33333333-3333-3333-3333-333333333333',
    participant2: '22222222-2222-2222-2222-222222222222',
    carId: 'c1111111-0000-0000-0000-000000000001',
    lastMessage: 'مرحباً، هل السيارة مفحوصة ومجمركة وجاهزة للمعاينة في المعرض؟',
    updatedAt: 'قبل 10 دقائق',
    otherUserName: 'معرض صنعاء الدولي للسيارات',
    carTitle: 'مرسيدس بنز S500',
  },
  {
    id: 'sample_conv_2',
    participant1: '33333333-3333-3333-3333-333333333333',
    participant2: '22222222-2222-2222-2222-222222222222',
    carId: 'c1111111-0000-0000-0000-000000000003',
    lastMessage: 'نعم متوفرة في فرع عدن - خط التسعين، يمكنك زيارة المعرض اليوم.',
    updatedAt: 'قبل ساعتين',
    otherUserName: 'معرض عدن سيتي موتورز',
    carTitle: 'تويوتا لاند كروزر VXR',
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'طارق الأهدل',
    email: 'admin@carsgate-ye.com',
    phone: '+967770000001',
    role: 'admin',
    createdAt: '2026-01-15',
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'معرض صنعاء الدولي',
    email: 'owner@sanaashowroom.com',
    phone: '+967771234567',
    role: 'showroom_owner',
    createdAt: '2026-02-10',
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'محمد باوزير',
    email: 'user@carsgate-ye.com',
    phone: '+967774444444',
    role: 'user',
    createdAt: '2026-03-01',
  }
];
