export interface ButtonEvents {
    "button-press"?: (timeOfPress: Date) => void;
    "hide-button"?: () => void;
}

export interface SomeOtherEvents {
    "custom-event"?: (someData: number) => void;
}
