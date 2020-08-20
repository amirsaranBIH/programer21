import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  public courses = [];
  public currentCourse = 0;
  public users = [];
  public unfilteredUsers = [];
  public searchInput = '';
  public roleFilter = '';
  public verifiedFilter = '';
  public currentSortField = '';
  public currentSortDirection = 'up';
  public environment = environment;

  constructor(
    private route: ActivatedRoute,
    private titleService: Title
  ) {}

  ngOnInit() {
    this.titleService.setTitle('Programer21 | Admin Panel');

    this.users = this.route.snapshot.data.users;

    this.unfilteredUsers = JSON.parse(JSON.stringify(this.users));

    this.courses = this.route.snapshot.data.courses;
  }

  previousCourse() {
    this.currentCourse--;
  }

  nextCourse() {
    this.currentCourse++;
  }

  filterUsers() {
    this.users = this.unfilteredUsers.filter(user => {
      if (this.searchInput !== '' && !user.name.match(new RegExp(this.searchInput, 'i'))) {
        return false;
      }

      if (this.roleFilter !== '' && user.role !== this.roleFilter) {
        return false;
      }

      if (this.verifiedFilter !== '' && user.verified.toString() !== this.verifiedFilter) {
        return false;
      }

      return true;
    });
  }

  sortUsers(selectedSortField) {
    if (this.currentSortField === selectedSortField) {
      if (this.currentSortDirection === 'up') {
        this.currentSortDirection = 'down';
      } else {
        this.currentSortField = '';
      }
    } else {
      this.currentSortField = selectedSortField;
      this.currentSortDirection = 'up';
    }

    if (this.currentSortField !== '') {
      this.users.sort((a, b) => {
        if ( a[this.currentSortField] < b[this.currentSortField] ) {
          return this.currentSortDirection === 'up' ? -1 : 1;
        }

        if ( a[this.currentSortField] > b[this.currentSortField] ) {
          return this.currentSortDirection === 'up' ? 1 : -1;
        }

        return 0;
      });
    } else {
      this.users = JSON.parse(JSON.stringify(this.unfilteredUsers));
    }
  }
}
