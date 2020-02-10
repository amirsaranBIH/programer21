import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { AuthenticationService } from './services/authentication.service';
import { AuthGuardService } from './services/auth-guard.service';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { NewLectureComponent } from './admin-panel/new-lecture/new-lecture.component';
import { NewCourseComponent } from './admin-panel/new-course/new-course.component';
import { AllCoursesResolverService } from './resolvers/all-courses-resolver.service';
import { OneLectureResolverService } from './resolvers/one-lecture-resolver.service';
import { BackButtonComponent } from './includes/back-button/back-button.component';
import { EditLectureComponent } from './admin-panel/edit-lecture/edit-lecture.component';
import { EditCourseComponent } from './admin-panel/edit-course/edit-course.component';
import { OneCourseResolverService } from './resolvers/one-course-resolver.service';
import { FileUploadComponent } from './includes/file-upload/file-upload.component';
import { LectureComponent } from './lecture/lecture.component';
import { OneLectureBySlugResolverService } from './resolvers/one-lecture-by-slug-resolver.service';
import { TitleToSlugPipe } from './pipes/title-to-slug.pipe';
import { GetSummaryPipe } from './pipes/get-summary.pipe';
import { LectureHTMLContentResolverService } from './resolvers/lecture-html-content-by-slug-resolver.service';
import { ToastrModule } from 'ngx-toastr';
import { SignupFormComponent } from './signup/signup-form/signup-form.component';
import { CoursesComponent } from './courses/courses.component';
import { CourseComponent } from './course/course.component';
import { UserCourseComponent } from './dashboard/user-course/user-course.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { EditUserComponent } from './admin-panel/edit-user/edit-user.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { NewPasswordComponent } from './new-password/new-password.component';
import { UserEnrolledCoursesResolverService } from './resolvers/user-enrolled-courses-resolver.service';
import { AllPublicCoursesResolverService } from './resolvers/all-public-courses-resolver.service';
import { AllUsersResolverService } from './resolvers/all-users-resolver.service';
import { CourseLecturesResolverService } from './resolvers/course-lectures-resolver.service';
import { UserResolverService } from './resolvers/user-resolver.service';
import { CourseActivityPercentageResolverService } from './resolvers/course-activity-percentage-resolver.service';
import { UserLatestLecturesResolverService } from './resolvers/user-latest-lectures-resolver.service';
import { UserMonthlyActivityResolverService } from './resolvers/user-monthly-activity-resolver.service';

const routes: Routes = [
  {
    path: '',
    resolve: {
      // courses: AllCoursesResolverService
    },
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
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'new-password',
    component: NewPasswordComponent
  },
  {
    path: 'admin-panel',
    canActivate: [AuthGuardService],
    children: [
      {
        path: '',
        component: AdminPanelComponent,
        resolve: {
          courses: AllCoursesResolverService,
          users: AllUsersResolverService
        }
      },
      { path: 'new-course', component: NewCourseComponent },
      {
        path: 'edit-user/:user_id',
        component: EditUserComponent,
        resolve: {
          user: UserResolverService
        }
      },
      {
        path: 'new-lecture/:course_id',
        component: NewLectureComponent,
        resolve: {
          course: OneCourseResolverService
        }
      },
      {
        path: 'edit-course/:course_id',
        component: EditCourseComponent,
        resolve: {
          course: OneCourseResolverService,
          courseLectures: CourseLecturesResolverService
        }
      },
      {
        path: 'edit-lecture/:lecture_id',
        component: EditLectureComponent,
        resolve: {
          lecture: OneLectureResolverService
        }
      },
    ]
   },
  {
    path: 'dashboard',
    canActivate: [AuthGuardService],
    resolve: {
      enrolledCourses: UserEnrolledCoursesResolverService,
      courseActivityPercentages: CourseActivityPercentageResolverService,
      latestLectures: UserLatestLecturesResolverService,
      monthlyActivity: UserMonthlyActivityResolverService
    },
    children: [
      {
        path: '',
        component: DashboardComponent
      },
      {
        path: 'course/:course_id',
        component: UserCourseComponent,
        resolve: {
        }
      },
    ]
    // canActivate: [AuthGuardService]
  },
  {
    path: 'settings/:user_id',
    component: UserSettingsComponent
  },
  {
    path: 'courses',
    component: CoursesComponent,
    resolve: {
      courses: AllPublicCoursesResolverService
    }
  },
  {
    path: 'course/:course_id',
    component: CourseComponent,
    resolve: {
    }
  },
  {
    path: 'lecture/:slug',
    component: LectureComponent,
    resolve: {
      // lecture: OneLectureBySlugResolverService,
      // html_content: LectureHTMLContentResolverService
    },
    canActivate: [AuthGuardService]
  },
];

export function fetchUserDataProviderFactory(provider: AuthenticationService) {
  return () => provider.fetchUserData();
}

@NgModule({
  declarations: [
    AppComponent,
    AdminPanelComponent,
    CoursesComponent,
    CourseComponent,
    DashboardComponent,
    LoginComponent,
    SignupComponent,
    SignupFormComponent,
    HomeComponent,
    NewLectureComponent,
    NewCourseComponent,
    EditLectureComponent,
    BackButtonComponent,
    EditCourseComponent,
    FileUploadComponent,
    LectureComponent,
    TitleToSlugPipe,
    GetSummaryPipe,
    UserCourseComponent,
    UserSettingsComponent,
    EditUserComponent,
    ForgotPasswordComponent,
    NewPasswordComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    ToastrModule.forRoot()
  ],
  providers: [
    AuthenticationService,
    {
      provide: APP_INITIALIZER,
      useFactory: fetchUserDataProviderFactory,
      deps: [AuthenticationService],
      multi: true
    },
    AuthGuardService,
    AllCoursesResolverService,
    AllUsersResolverService,
    AllPublicCoursesResolverService,
    UserResolverService,
    CourseLecturesResolverService,
    UserMonthlyActivityResolverService,
    CourseActivityPercentageResolverService,
    OneLectureResolverService,
    OneCourseResolverService,
    UserLatestLecturesResolverService,
    OneLectureBySlugResolverService,
    LectureHTMLContentResolverService,
    UserEnrolledCoursesResolverService,
    TitleToSlugPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
