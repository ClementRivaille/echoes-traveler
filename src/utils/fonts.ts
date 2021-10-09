export enum Font {
  adventurer = 'adventurer',
  ataristocrat = 'ataristocrat',
  ldcBlackRound = 'ldcBlackRound',
}

const FONTS_FILES: { [key in Font]: string } = {
  [Font.adventurer]: './assets/fonts/Adventurer.ttf',
  [Font.ataristocrat]: './assets/fonts/ATARISTOCRAT.ttf',
  [Font.ldcBlackRound]: './assets/fonts/ldcBlackRound.ttf',
};

export async function loadFonts() {
  const fonts = await document.fonts.ready;
  await Promise.all(
    (Object.keys(Font) as Array<keyof typeof Font>).map(async (index) => {
      const fontFace = new FontFace(
        Font[index],
        `url(${FONTS_FILES[Font[index]]})`
      );
      const loadedFont = await fontFace.load();
      fonts.add(loadedFont);
    })
  );
}
