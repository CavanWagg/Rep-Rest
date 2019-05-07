import { Component } from '@angular/core';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { NavigationBar } from '@ionic-native/navigation-bar/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  percent = 0;
  radius = 100;
  fullTime: any = '00:01:30';
  timer: any = false;
  progress: any = 0;
  overallProgress:any = 0;
  overallTimer: any = false;
  minutes = 1;
  seconds: any = 1;
  countDownTimer: any = false;
  timeLeft: any = {
    m: '00',
    s: '00'
  };
  remainingTime = `${this.timeLeft.m}:${this.timeLeft.s}`;

  elapsed: any = {
    h: '00',
    m: '00',
    s: '00'
  }

  constructor(private insomnia: Insomnia, private navigationBar: NavigationBar) { 

    let autoHide: boolean = true;
    this.navigationBar.setUp(autoHide);

  }

  startTimer() {

    if(this.timer) {
      clearInterval(this.timer)
      clearInterval(this.countDownTimer);
    }

    if (!this.overallTimer) {
      this.progressTimer();
    }

    this.timer = false;
    this.percent = 0;
    this.progress = 0;

    let timeSplit = this.fullTime.split(':');
    this.minutes = timeSplit[1];
    this.seconds = timeSplit[2]; 

    // tslint:disable-next-line:radix
    let totalSeconds = Math.floor(this.minutes * 60) + parseInt(this.seconds);
    let secondsLeft = totalSeconds;

    let forwardsTimer = () => {
      if (this.percent == this.radius) clearInterval(this.timer)
      this.percent = Math.floor((this.progress / totalSeconds) * 100)
      ++this.progress
    }

    let backwardsTimer = () => {
      if (secondsLeft >= 0) {
        this.timeLeft.m = Math.floor(secondsLeft / 60)
        this.timeLeft.s = secondsLeft - (60 * this.timeLeft.m)
        this.remainingTime = `${this.pad(this.timeLeft.m, 2)}:${this.pad(this.timeLeft.s, 2)}`
        secondsLeft--;
      }
    }

    // run once when clicked
    forwardsTimer()
    backwardsTimer()

    // timers start 1 second later
    this.countDownTimer = setInterval(backwardsTimer, 1000)
    this.timer = setInterval(forwardsTimer, 1000)
  }

  stopTimer() {
    clearInterval(this.countDownTimer);
    clearInterval(this.timer);
    clearInterval(this.overallTimer);
    this.countDownTimer = false;
    this.overallTimer = false;
    this.timer = false;
    this.percent = 0;
    this.progress = 0;
    this.elapsed = {
      h: '00',
      m: '00',
      s: '00'
    }
    this.timeLeft = {
      m: '00',
      s: '00'
    }
    this.remainingTime = `${this.pad(this.timeLeft.m, 2)}:${this.pad(this.timeLeft.s, 2)}`;
    this.insomnia.allowSleepAgain()
  }
   
progressTimer() {
  const countdownDate = new Date();
  this.overallTimer = setInterval(() => {

      const now = new Date().getTime();
      // Calc distance between now and the count down date
      const distance = now - countdownDate.getTime();

      // calcs for hours, min, seconds
      this.elapsed.h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.elapsed.m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      this.elapsed.s = Math.floor((distance % (1000 * 60)) / 1000);

      this.elapsed.m = this.pad(this.elapsed.m, 2);
      this.elapsed.s = this.pad(this.elapsed.s, 2);

    }, 1000);
  }
    pad(num, size) {
      let s = num + '';
      while (s.length < size) { s = '0' + s; }
      return s;
    }
    updateMyDate($event) {
      console.log($event.split(':'));
    }
}
