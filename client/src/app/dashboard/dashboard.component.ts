import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../services/authentication.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public user;
  public monthlyActivityDays = [];
  public courseActivityPercentages = [];
  public enrolledCourses = [];
  public currentEnrolledCourse = 0;
  public environment = environment;

  constructor(
    public auth: AuthenticationService,
    private route: ActivatedRoute
    ) {}

  ngOnInit() {
    this.user = this.auth.userData;
    this.enrolledCourses = this.route.snapshot.data.enrolledCourses;
    console.log(this.enrolledCourses)
    for (let i = 0; i < 31; i++) {
      this.monthlyActivityDays.push(Math.floor(Math.random() * 101));
    }

    this.courseActivityPercentages = [
      {
        percentage: 50,
        color: 'orange'
      },
      {
        percentage: 18,
        color: '#00f'
      },
      {
        percentage: 32,
        color: 'yellow'
      }
    ];

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
}
