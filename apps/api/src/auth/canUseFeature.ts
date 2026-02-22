import { planFeatures } from "./planFeatures";

export function canUseFeature(plan: string, feature: string) {
  const features = planFeatures[plan as keyof typeof planFeatures] || [];
  return features.includes(feature);
}