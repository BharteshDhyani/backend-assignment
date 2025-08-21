type Tier = "tier_0" | "tier_1" | "tier_2";

type LimitKey = keyof typeof DEFAULT_USER_LIMITS;

export const DEFAULT_USER_LIMITS = {
  persona: {
    tier_0: 3,
    tier_1: 100,
    tier_2: 100,
  },
  templates: {
    tier_0: 10,
    tier_1: 1000,
    tier_2: 1000,
  },
  saved_profile: {
    tier_0: 3,
    tier_1: 30000,
    tier_2: 30000,
  },
  lists: {
    tier_0: 3,
    tier_1: 50,
    tier_2: 50,
  },
  user_tags: {
    tier_0: 10,
    tier_1: 1000,
    tier_2: 1000,
  },
  summarize_profile: {
    tier_0: 5,
    tier_1: 30000,
    tier_2: 30000,
  },
};

export const getDefaultLimitsForUser = (tier: number) => {
  const tierKey = `tier_${tier}` as Tier;
  const keys = Object.keys(DEFAULT_USER_LIMITS) as LimitKey[];

  const limits: Record<LimitKey, number> = {} as Record<LimitKey, number>;

  for (let idx = 0; idx < keys.length; idx++) {
    const key = keys[idx];
    limits[key] =
      DEFAULT_USER_LIMITS[key][tierKey] || DEFAULT_USER_LIMITS[key]["tier_0"];
  }

  return limits;
};
