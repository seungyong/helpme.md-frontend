export interface Installation {
  installations: InstallationItem[];
}

export interface InstallationItem {
  installationId: string;
  avatarUrl: string;
  name: string;
}
