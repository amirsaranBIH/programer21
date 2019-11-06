import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { QuillModule } from 'ngx-quill';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { AuthenticationService } from './services/authentication.service';
import { AuthGuardService } from './services/auth-guard.service';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { NewModuleComponent } from './admin-panel/new-module/new-module.component';
import { NewLectureComponent } from './admin-panel/new-lecture/new-lecture.component';
import { NewCourseComponent } from './admin-panel/new-course/new-course.component';
import { AllCoursesResolverService } from './resolvers/all-courses-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'admin-panel',
    resolve: {
      courses: AllCoursesResolverService
    },
    canActivate: [AuthGuardService],
    children: [
      { path: '', component: AdminPanelComponent },
      { path: 'new-course', component: NewCourseComponent },
      { path: 'new-module/:course_id', component: NewModuleComponent },
      { path: 'new-lecture/:course_id/:module_id', component: NewLectureComponent },
    ]
   },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuardService]
  },
];

@NgModule({
  declarations: [
    AppComponent,
    AdminPanelComponent,
    DashboardComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    NewModuleComponent,
    NewLectureComponent,
    NewCourseComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    QuillModule.forRoot()
  ],
  providers: [
    AuthenticationService,
    AuthGuardService,
    AllCoursesResolverService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
