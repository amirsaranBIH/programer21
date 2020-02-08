import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public carouselCourses = [];

  constructor() {}

  ngOnInit() {
    this.carouselCourses = [
      {
        image: 'assets/images/default_course_image.png',
        courseDetailLink: '/asd1'
      },
      {
        image: 'assets/images/sss.gif',
        courseDetailLink: '/asd2'
      },
      {
        image: 'assets/images/default_course_image.png',
        courseDetailLink: '/asd3'
      },
    ];
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
