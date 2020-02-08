import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {
  public courseLectures = [];

  constructor() { }

  ngOnInit() {
    this.courseLectures = [
        {
          title: 'The most important part of HTML',
          description: 'HTML is the most important language to learn if you want to create a website. HTML is basically the back bone of every website on the Internet. If you get a grasp of HTML you will be at the right path of achieving valuable knowledge.',
          ert: 10
        },
        {
          title: 'The most important part of HTML',
          description: 'HTML is the most important language to learn if you want to create a website. HTML is basically the back bone of every website on the Internet. If you get a grasp of HTML you will be at the right path of achieving valuable knowledge.',
          ert: 12
        },
        {
          title: 'The most important part of HTML',
          description: 'HTML is the most important language to learn if you want to create a website. HTML is basically the back bone of every website on the Internet. If you get a grasp of HTML you will be at the right path of achieving valuable knowledge.',
          ert: 13
        },
        {
          title: 'The most important part of HTML',
          description: 'HTML is the most important language to learn if you want to create a website. HTML is basically the back bone of every website on the Internet. If you get a grasp of HTML you will be at the right path of achieving valuable knowledge.',
          ert: 13
        },
        {
          title: 'The most important part of HTML',
          description: 'HTML is the most important language to learn if you want to create a website. HTML is basically the back bone of every website on the Internet. If you get a grasp of HTML you will be at the right path of achieving valuable knowledge.',
          ert: 13
        }
    ];
  }

  lectureShowMore(lecture) {
    lecture.showMore = !lecture.showMore;
  }
}
