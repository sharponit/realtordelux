export const MINIMUM_PROPERTY_PHOTO_COUNT = 200;

export function getUploadWarnings(imageCount: number, adminOverride = false) {
  const belowMinimum = imageCount < MINIMUM_PROPERTY_PHOTO_COUNT;

  return {
    below_minimum_warning: belowMinimum && !adminOverride,
    admin_override_minimum: adminOverride,
    required_minimum: MINIMUM_PROPERTY_PHOTO_COUNT
  };
}
