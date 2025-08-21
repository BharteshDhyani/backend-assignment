import { getConfig } from '../config';

class Plans {
  static get values() {
    return {
      free: 'free',
      growth: 'growth',
      enterprise: 'enterprise',
    };
  }

  static selectPlanByStripePriceId(stripePriceId: string) {
    const growthStripePriceId =
      getConfig().PLAN_STRIPE_PRICES_GROWTH;
    const enterpriseStripePriceId =
      getConfig().PLAN_STRIPE_PRICES_ENTERPRISE;

    if (growthStripePriceId === stripePriceId) {
      return Plans.values.growth;
    }

    if (enterpriseStripePriceId === stripePriceId) {
      return Plans.values.enterprise;
    }

    return Plans.values.free;
  }

  static selectStripePriceIdByPlan(
    plan: keyof typeof Plans.values,
  ) {
    if (plan === Plans.values.growth) {
      return getConfig().PLAN_STRIPE_PRICES_GROWTH;
    }

    if (plan === Plans.values.enterprise) {
      return getConfig().PLAN_STRIPE_PRICES_ENTERPRISE;
    }

    return null;
  }

}

export default Plans;
