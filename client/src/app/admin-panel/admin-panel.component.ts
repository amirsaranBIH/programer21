import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
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
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
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
      this.currentSortDirection = this.currentSortDirection === 'up' ? 'down' : 'up';
    } else {
      this.currentSortDirection = 'up';
      this.currentSortField = selectedSortField;
    }

    this.users.sort((a, b) => {
      if ( a[this.currentSortField] < b[this.currentSortField] ) {
        return this.currentSortDirection === 'up' ? -1 : 1;
      }

      if ( a[this.currentSortField] > b[this.currentSortField] ) {
        return this.currentSortDirection === 'up' ? 1 : -1;
      }

      return 0;
    });
  }
}
