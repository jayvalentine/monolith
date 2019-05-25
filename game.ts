class Game {
  day: number;

  constructor() {
    this.day = 0;
  }

  reset() {
    this.day = 0;
  }

  start() {
    this.displayMessage(
      `You awaken in a cold void. A glistening blue-green marble hangs below you.
      You slowly become aware of the various sensors attached to you, reading
      magnetic fields, temperature, radiation, and more.
      You observe Kepler 62-f slowly, and search for a landing site.`
    )
  }

  displayMessage(message: string)
  {
    $("#GameMainScreen").append(`<p>${message}</p>`).hide().fadeIn(1000);
  }
}