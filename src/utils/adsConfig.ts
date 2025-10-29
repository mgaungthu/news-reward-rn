
// Google AdMob test units (safe for dev)
export const ADMOB_BANNER_TEST = 'ca-app-pub-3940256099942544/6300978111';
export const ADMOB_INTERSTITIAL_TEST = 'ca-app-pub-3940256099942544/1033173712';
export const ADMOB_REWARDED_TEST = 'ca-app-pub-3940256099942544/5224354917';

// Use test units by default in development
export const ADMOB_BANNER_ID =
  process.env.NODE_ENV === 'production'
    ? 'YOUR_ADMOB_BANNER_UNIT_ID'
    : ADMOB_BANNER_TEST;

export const ADMOB_INTERSTITIAL_ID =
  process.env.NODE_ENV === 'production'
    ? 'YOUR_ADMOB_INTERSTITIAL_UNIT_ID'
    : ADMOB_INTERSTITIAL_TEST;

export const ADMOB_REWARDED_ID =
  process.env.NODE_ENV === 'production'
    ? 'YOUR_ADMOB_REWARDED_UNIT_ID'
    : ADMOB_REWARDED_TEST;

// Google Ad Manager sample ad unit paths (replace with your network)
export const GAM_BANNER_PATH = '/6499/example/banner';
export const GAM_INTERSTITIAL_PATH = '/6499/example/interstitial';
