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
import { OneLectureResolverService } from './resolvers/one-lecture-resolver.service';
import { BackButtonComponent } from './includes/back-button/back-button.component';
import { EditLectureComponent } from './admin-panel/edit-lecture/edit-lecture.component';
import { EditModuleComponent } from './admin-panel/edit-module/edit-module.component';
import { EditCourseComponent } from './admin-panel/edit-course/edit-course.component';
import { OneCourseResolverService } from './resolvers/one-course-resolver.service';
import { OneModuleResolverService } from './resolvers/one-module-resolver.service';
import { FileUploadComponent } from './includes/file-upload/file-upload.component';

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
    FileUploadComponent
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
    AllCoursesResolverService,
    OneLectureResolverService,
    OneModuleResolverService,
    OneCourseResolverService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
