import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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
import { NewModuleComponent } from './admin-panel/new-module/new-module.component';
import { NewLectureComponent } from './admin-panel/new-lecture/new-lecture.component';
import { NewCourseComponent } from './admin-panel/new-course/new-course.component';
import { AllCoursesResolverService } from './resolvers/all-courses-resolver.service';
import { OneLectureResolverService } from './resolvers/one-lecture-resolver.service';
import { BackButtonComponent } from './includes/back-button/back-button.component';
import { EditLectureComponent } from './admin-panel/edit-lecture/edit-lecture.component';
import { EditModuleComponent } from './admin-panel/edit-module/edit-module.component';
import { EditCourseComponent } from './admin-panel/edit-course/edit-course.component';
import { OneCourseResolverService } from './resolvers/one-course-resolver.service';
import { OneModuleResolverService } from './resolvers/one-module-resolver.service';
import { FileUploadComponent } from './includes/file-upload/file-upload.component';
import { LectureComponent } from './lecture/lecture.component';
import { OneLectureBySlugResolverService } from './resolvers/one-lecture-by-slug-resolver.service';
import { TitleToSlugPipe } from './pipes/title-to-slug.pipe';
import { GetSummaryPipe } from './pipes/get-summary.pipe';
import { LectureHTMLContentResolverService } from './resolvers/lecture-html-content-by-slug-resolver.service';
import { UserResolverService } from './resolvers/user-resolver.service';
import { ToastrModule } from 'ngx-toastr';

const routes: Routes = [
  {
    path: '',
    resolve: {
      courses: AllCoursesResolverService
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
    path: 'admin-panel',
    canActivate: [AuthGuardService],
    children: [
      {
        path: '',
        component: AdminPanelComponent,
        resolve: {
          courses: AllCoursesResolverService
        }
      },
      { path: 'new-course', component: NewCourseComponent },
      { path: 'new-module/:course_id', component: NewModuleComponent },
      { path: 'new-lecture/:module_id', component: NewLectureComponent },
      { path: 'edit-course/:course_id',
        component: EditCourseComponent,
        resolve: {
          course: OneCourseResolverService
        }
      },
      { path: 'edit-module/:module_id',
        component: EditModuleComponent,
        resolve: {
          module: OneModuleResolverService
        }
      },
      { path: 'edit-lecture/:lecture_id',
        component: EditLectureComponent,
        resolve: {
          lecture: OneLectureResolverService
        }
      },
    ]
   },
  {
    path: 'dashboard',
    component: DashboardComponent,
    resolve: {
      user: UserResolverService
    },
    canActivate: [AuthGuardService]
  },
  {
    path: 'lecture/:slug',
    component: LectureComponent,
    resolve: {
      lecture: OneLectureBySlugResolverService,
      html_content: LectureHTMLContentResolverService
    },
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
    NewCourseComponent,
    EditLectureComponent,
    BackButtonComponent,
    EditModuleComponent,
    EditCourseComponent,
    FileUploadComponent,
    LectureComponent,
    TitleToSlugPipe,
    GetSummaryPipe
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
    AuthGuardService,
    AllCoursesResolverService,
    OneLectureResolverService,
    OneModuleResolverService,
    OneCourseResolverService,
    OneLectureBySlugResolverService,
    LectureHTMLContentResolverService,
    UserResolverService,
    TitleToSlugPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
