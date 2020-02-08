import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.courses = this.route.snapshot.data.courses;
    console.log(this.courses);
    // this.courses = [
    //   {
    //     title: 'HTML For Absolute Beginners',
    //     image: 'assets/images/default_course_image.png',
    //     price: 0,
    //     numberOfLectures: 1,
    //     totalErt: 12,
    //     difficulty: 'beginner',
    //     description: 'HTML is the most important language to learn if you want to create a website. HTML is basically the back bone of every website on the Internet. If you get a grasp of HTML you will be at the right path of achieving valuable knowledge.'
    //   },
    //   {
    //     title: 'CSS The Styling Guide',
    //     image: 'assets/images/sss.gif',
    //     price: 0,
    //     numberOfLectures: 50,
    //     totalErt: 1,
    //     difficulty: 'beginner',
    //     description: 'HTML is the most important language to learn if you want to create a website. HTML is basically the back bone of every website on the Internet. If you get a grasp of HTML you will be at the right path of achieving valuable knowledge.'
    //   },
    //   {
    //     title: 'JavaScript: The Hard Parts',
    //     image: 'assets/images/default_course_image.png',
    //     price: 0,
    //     numberOfLectures: 50,
    //     totalErt: 12,
    //     difficulty: 'advanced',
    //     description: 'HTML is the most important language to learn if you want to create a website. HTML is basically the back bone of every website on the Internet. If you get a grasp of HTML you will be at the right path of achieving valuable knowledge.'
    //   },
    //   {
    //     title: 'PHP For Everyone',
    //     image: 'assets/images/sss.gif',
    //     price: 15,
    //     numberOfLectures: 50,
    //     totalErt: 12,
    //     difficulty: 'advanced',
    //     description: 'HTML is the most important language to learn if you want to create a website. HTML is basically the back bone of every website on the Internet. If you get a grasp of HTML you will be at the right path of achieving valuable knowledge.'
    //   },
    // ];

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
