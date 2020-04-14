import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {
  public courses = [];
  public unfilteredCourses = [];
  public searchInput = '';
  public paymentFilter = '';
  public difficultyFilter = '';
  public environment = environment;

  constructor(
    private route: ActivatedRoute,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.titleService.setTitle('Programer21 | Check out all the courses');

    this.courses = this.route.snapshot.data.courses;

    this.unfilteredCourses = JSON.parse(JSON.stringify(this.courses));
  }

  filterCourses() {
    this.courses = this.unfilteredCourses.filter(course => {
      if (this.searchInput !== '' && !course.title.match(new RegExp(this.searchInput, 'i'))) {
        return false;
      }

      if (this.paymentFilter !== '') {
        if ((course.price === 0 && this.paymentFilter !== 'free') ||
        (course.price > 0 && this.paymentFilter !== 'paid')) {
          return false;
        }
      }

      if (this.difficultyFilter !== '' && course.difficulty !== this.difficultyFilter) {
        return false;
      }

      return true;
    });
  }
}
