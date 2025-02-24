import { Handler } from "../interface/Handler";

export class Timer {
  private timer: NodeJS.Timeout | null;
  private handler: Handler;

  constructor(arg: Handler) {
    this.timer = null;
    this.handler = arg;
  }

  startTimer(milliseconds: number) {
    this.timer = setInterval(() => {
      this.handler.handler();
    }, milliseconds);
  }

  stopTimer() {
    if (this.timer !== null) {
      console.log("parou");
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
