import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public carouselCourses = [];

  constructor(
    private route: ActivatedRoute,
    private titleService: Title
  ) {}

  ngOnInit() {
    this.titleService.setTitle('Programer21 | Learn Programming the Modern Way');

    this.carouselCourses = this.route.snapshot.data.courses.slice(0, 3);
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
