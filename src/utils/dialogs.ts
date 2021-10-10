interface Dialog {
  top: string;
  bottom: string;
}

export enum DialogName {
  FirstSteps,
  Goal,
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
    top: 'Others are hidden around the world',
    bottom: 'Listen to their sound, explore, and find them',
  },
  [DialogName.Camera]: {
    top: "Your sight won't follow you further",
    bottom: 'Let music guide your journey',
  },
};
