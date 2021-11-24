interface Dialog {
  top: string;
  bottom: string;
}

export enum DialogName {
  FirstSteps,
  Goal,
  Hints,
  Camera,
}

type Dialogs = {
  [key in DialogName]: Dialog;
};

export const dialogs: Dialogs = {
  [DialogName.FirstSteps]: {
    top: 'Move with arrow keys',
    bottom: 'Complete the path',
  },
  [DialogName.Goal]: {
    top: `To find the others, you'll have explore the world`,
    bottom: 'Listen to their sound before leaving',
  },
  [DialogName.Hints]: {
    top: 'This signal comes from a far away place',
    bottom: 'A path will awaits you there. Find it and complete it.',
  },
  [DialogName.Camera]: {
    top: "Your sight won't follow you further",
    bottom: 'Let music guide your journey',
  },
};
