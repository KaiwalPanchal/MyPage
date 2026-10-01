export interface QuestItem {
  id: string;
  codeName: string;
  title: string;
  hint: string;
  discovered: boolean;
  discoveredDialogue: string;
}

export interface SecretGameState {
  hasMet: boolean;
  acceptedGuide: boolean;
  clickCount: number;
  foundKonami: boolean;
  foundFooter: boolean;
  foundSnack: boolean;
  foundSecretRoom: boolean;
  discoveredCircleOrigin: boolean;
  activeLocation: "corner" | "footer" | "room";
  isMinimized: boolean;
  isMuted: boolean;
  visitCount: number;
}

export type CircleMood =
  | "idle"
  | "talking"
  | "curious"
  | "teasing"
  | "shocked"
  | "celebrating"
  | "sleeping"
  | "secretive";

export interface DialogueMessage {
  id: string;
  text: string;
  mood?: CircleMood;
  choices?: {
    label: string;
    action: () => void;
  }[];
  autoDismissMs?: number;
}
