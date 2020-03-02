import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public carouselCourses = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.carouselCourses = this.route.snapshot.data.courses;
    this.carouselCourses = [ this.carouselCourses[0], this.carouselCourses[1], this.carouselCourses[2] ];
  }

  courseCarouselPrevious() {
    const popedCourse = this.carouselCourses.pop();
    this.carouselCourses.unshift(popedCourse);
  }

  courseCarouselNext() {
    const shiftedCourse = this.carouselCourses.shift();
    this.carouselCourses.push(shiftedCourse);
  }
}
