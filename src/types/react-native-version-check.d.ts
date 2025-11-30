declare module "react-native-version-check" {
  interface NeedUpdateResponse {
    isNeeded: boolean;
    currentVersion: string;
    latestVersion: string;
  }

  export function getLatestVersion(options?: {
    forceUpdate?: boolean;
    provider?: "google" | "apple";
    packageName?: string;
    country?: string;
  }): Promise<string>;

  export function needUpdate(options: {
    currentVersion: string;
    latestVersion: string;
  }): NeedUpdateResponse;

  export function getPlayStoreUrl(options?: {
    packageName?: string;
  }): Promise<string>;

  export function getAppStoreUrl(options?: {
    appID?: string;
    country?: string;
  }): Promise<string>;

  const VersionCheck: {
    getLatestVersion: typeof getLatestVersion;
    needUpdate: typeof needUpdate;
    getPlayStoreUrl: typeof getPlayStoreUrl;
    getAppStoreUrl: typeof getAppStoreUrl;
  };

  export default VersionCheck;
}