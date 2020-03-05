export class Timer {
  private t0Millis: number;

  constructor() {
    this.t0Millis = new Date().getTime();
  }

  public getElapsedTime(): number {
    return new Date().getTime() - this.t0Millis;
  }

  public reset() {
    this.t0Millis = new Date().getTime();
  }
}
