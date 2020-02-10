import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../services/authentication.service';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public user;
  public monthlyActivityDays = [];
  public courseActivityPercentages = [];
  public enrolledCourses = [];
  public latestLectures = [];
  public monthlyActivity = {};
  public currentEnrolledCourse = 0;
  public environment = environment;

  constructor(
    public auth: AuthenticationService,
    private route: ActivatedRoute
    ) {}

  ngOnInit() {
    this.user = this.auth.userData;
    this.enrolledCourses = this.route.snapshot.data.enrolledCourses;
    this.courseActivityPercentages = this.route.snapshot.data.courseActivityPercentages;
    this.latestLectures = this.route.snapshot.data.latestLectures;
    this.monthlyActivity = this.route.snapshot.data.monthlyActivity;

    const days = this.getDaysInMonth(1, 2020);

    const maxMonthlyActivity = this.getMaxMonthlyActivity();

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < days.length; i++) {
      if (this.monthlyActivity.hasOwnProperty(days[i])) {
        this.monthlyActivityDays.push((this.monthlyActivity[days[i]].lecturesFinished / maxMonthlyActivity) * 100);
      } else {
        this.monthlyActivityDays.push(0);
      }
    }

    this.calculateCourseActivityOffest(this.courseActivityPercentages);
  }

  // calculating offsets for each percentage using
  // formula 360 / (100 / (thisPercentage + allPreviousPercentages))
  private calculateCourseActivityOffest(percentages) {
    let totalOffest = 0;

    percentages = percentages.map((p, i) => {
      if (i > 0) {
        totalOffest += 360 / (100 / percentages[i - 1].percentage);
        p.offset = totalOffest;
      } else {
        p.offset = 0;
      }

      return p;
    });
  }

  getDaysInMonth(month, year) {
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(moment(date).format('YYYY-MM-DD'));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }

  getMaxMonthlyActivity() {
    let maxActivity = 0;

    // tslint:disable-next-line: forin
    for (const activity in this.monthlyActivity) {
      const a: any = activity;

      if (this.monthlyActivity[a].lecturesFinished > maxActivity) {
        maxActivity = this.monthlyActivity[a].lecturesFinished;
      }
    }

    return maxActivity;
  }

  previousEnrolledCourse() {
    if (this.currentEnrolledCourse > 0) {
      this.currentEnrolledCourse--;
    }
  }

  nextEnrolledCourse() {
    if (this.currentEnrolledCourse < this.enrolledCourses.length - 1) {
      this.currentEnrolledCourse++;
    }
  }

  formatDateNumber(day) {
    return day < 10 ? '0' + day : day;
  }

  formatDate(date) {
    return moment(date).format('MMMM D, YYYY');
  }
}
