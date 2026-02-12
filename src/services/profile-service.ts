import type {
  MyProfile,
  UserProfile,
  BlockedUser,
  UpdateProfileRequest,
  UpdateSettingsRequest,
  Oposicion,
  ProfileSettings,
} from "@/types/profile";

// ============================================
// MOCK DATA
// ============================================

const mock_oposiciones: Oposicion[] = [
  {
    id: "opo-1",
    name: "Auxiliar Administrativo del Estado",
    category: "Administración General",
    icon: "📋",
  },
  {
    id: "opo-2",
    name: "Administrativo del Estado",
    category: "Administración General",
    icon: "🏛️",
  },
  {
    id: "opo-3",
    name: "Tramitación Procesal",
    category: "Justicia",
    icon: "⚖️",
  },
  {
    id: "opo-4",
    name: "Auxilio Judicial",
    category: "Justicia",
    icon: "📜",
  },
  {
    id: "opo-5",
    name: "Correos y Telégrafos",
    category: "Organismos Autónomos",
    icon: "📮",
  },
];

const mock_my_profile: MyProfile = {
  id: "1",
  name: "Guti \"Guti\" Gutierrez",
  email: "maria@postal3.com",
  avatar: "/opo_study.png",
  bio: "Opositora de Auxiliar Administrativo. ¡A por todas! 💪",
  joined_at: "2024-09-15T10:00:00Z",
  elo: 1250,
  league: {
    tier: "plata",
    name: "Liga Plata",
    position: 45,
    total_players: 200,
  },
  streak_days: 12,
  oposiciones: [mock_oposiciones[0], mock_oposiciones[2]],
  active_oposicion: mock_oposiciones[0],
  badges: [
    {
      id: "badge-1",
      name: "Primera Victoria",
      description: "Aprueba tu primer test",
      icon: "trophy",
      rarity: "comun",
      earned_at: "2024-10-01T08:00:00Z",
    },
    {
      id: "badge-2",
      name: "Racha Imparable",
      description: "Mantén una racha de 7 días consecutivos",
      icon: "flame",
      rarity: "raro",
      earned_at: "2024-10-15T12:00:00Z",
    },
    {
      id: "badge-3",
      name: "Precisión Quirúrgica",
      description: "Obtén un 100% en un test de 30+ preguntas",
      icon: "target",
      rarity: "epico",
      earned_at: "2024-11-02T18:30:00Z",
    },
    {
      id: "badge-4",
      name: "Maratonista",
      description: "Completa 50 tests en total",
      icon: "zap",
      rarity: "raro",
      earned_at: "2024-11-20T09:00:00Z",
    },
    {
      id: "badge-5",
      name: "Leyenda del Estudio",
      description: "Acumula 100 horas de estudio",
      icon: "book-open",
      rarity: "legendario",
      earned_at: "2025-01-10T14:00:00Z",
    },
  ],
  stats: {
    tests_completed: 87,
    tests_passed: 72,
    total_questions: 2450,
    correct_answers: 1960,
    accuracy_percentage: 80,
    study_hours: 124,
    best_streak: 18,
    current_position: 45,
    total_points: 15800,
    coins: 342,
  },
  settings: {
    show_stats: true,
    show_badges: true,
    show_elo: true,
    show_streak: true,
    allow_friend_requests: true,
    email_notifications: true,
  },
};

const mock_other_user: UserProfile = {
  id: "2",
  name: "Laura Martínez Ruiz",
  avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
  bio: "Preparando Tramitación Procesal. Constancia y disciplina.",
  joined_at: "2024-08-01T10:00:00Z",
  elo: 1480,
  league: {
    tier: "oro",
    name: "Liga Oro",
    position: 12,
    total_players: 150,
  },
  streak_days: 25,
  active_oposicion: mock_oposiciones[2],
  badges: [
    {
      id: "badge-1",
      name: "Primera Victoria",
      description: "Aprueba tu primer test",
      icon: "trophy",
      rarity: "comun",
      earned_at: "2024-08-10T08:00:00Z",
    },
    {
      id: "badge-6",
      name: "Invencible",
      description: "Gana 10 duelos consecutivos",
      icon: "swords",
      rarity: "epico",
      earned_at: "2024-12-05T16:00:00Z",
    },
    {
      id: "badge-5",
      name: "Leyenda del Estudio",
      description: "Acumula 100 horas de estudio",
      icon: "book-open",
      rarity: "legendario",
      earned_at: "2024-12-20T14:00:00Z",
    },
  ],
  stats: {
    tests_completed: 132,
    tests_passed: 118,
    total_questions: 3800,
    correct_answers: 3230,
    accuracy_percentage: 85,
    study_hours: 210,
    best_streak: 30,
    current_position: 12,
    total_points: 24500,
    coins: 580,
  },
  friendship_status: "none",
  is_profile_public: true,
  show_badges_publicly: true,
};

const mock_blocked_users: BlockedUser[] = [
  {
    id: "blocked-1",
    name: "Carlos Ruiz",
    avatar: undefined,
    blocked_at: "2025-01-05T10:00:00Z",
  },
];

// ============================================
// DELAY HELPER
// ============================================

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ============================================
// MOCK SERVICE
// ============================================

const mock_profile_service = {
  async get_my_profile(): Promise<MyProfile> {
    await delay(400);
    return { ...mock_my_profile };
  },

  async update_profile(data: UpdateProfileRequest): Promise<MyProfile> {
    await delay(300);
    Object.assign(mock_my_profile, data);
    return { ...mock_my_profile };
  },

  async update_settings(data: UpdateSettingsRequest): Promise<ProfileSettings> {
    await delay(300);
    Object.assign(mock_my_profile.settings, data);
    return { ...mock_my_profile.settings };
  },

  async upload_avatar(_file: File): Promise<{ avatar_url: string }> {
    await delay(600);
    const url = "/opo_study.png";
    mock_my_profile.avatar = url;
    return { avatar_url: url };
  },

  async get_user_profile(user_id: string): Promise<UserProfile> {
    await delay(400);
    return { ...mock_other_user, id: user_id };
  },

  async get_blocked_users(): Promise<BlockedUser[]> {
    await delay(300);
    return [...mock_blocked_users];
  },

  async block_user(user_id: string): Promise<void> {
    await delay(300);
    mock_blocked_users.push({
      id: user_id,
      name: "Usuario " + user_id,
      blocked_at: new Date().toISOString(),
    });
  },

  async unblock_user(user_id: string): Promise<void> {
    await delay(300);
    const index = mock_blocked_users.findIndex((u) => u.id === user_id);
    if (index !== -1) mock_blocked_users.splice(index, 1);
  },

  async send_friend_request(user_id: string): Promise<void> {
    await delay(300);
    console.log(`[Mock] Friend request sent to ${user_id}`);
  },

  async accept_friend_request(user_id: string): Promise<void> {
    await delay(300);
    console.log(`[Mock] Friend request accepted from ${user_id}`);
  },

  async get_available_oposiciones(): Promise<Oposicion[]> {
    await delay(200);
    return [...mock_oposiciones];
  },

  async set_active_oposicion(oposicion_id: string): Promise<MyProfile> {
    await delay(300);
    const opo = mock_oposiciones.find((o) => o.id === oposicion_id);
    if (opo) mock_my_profile.active_oposicion = opo;
    return { ...mock_my_profile };
  },

  async add_oposicion(oposicion_id: string): Promise<MyProfile> {
    await delay(300);
    const opo = mock_oposiciones.find((o) => o.id === oposicion_id);
    if (opo && !mock_my_profile.oposiciones.find((o) => o.id === oposicion_id)) {
      mock_my_profile.oposiciones.push(opo);
    }
    return { ...mock_my_profile };
  },

  async remove_oposicion(oposicion_id: string): Promise<MyProfile> {
    await delay(300);
    mock_my_profile.oposiciones = mock_my_profile.oposiciones.filter(
      (o) => o.id !== oposicion_id
    );
    if (mock_my_profile.active_oposicion?.id === oposicion_id) {
      mock_my_profile.active_oposicion = mock_my_profile.oposiciones[0];
    }
    return { ...mock_my_profile };
  },
};

// ============================================
// EXPORT
// ============================================

export const profile_service = mock_profile_service;
