import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {

  constructor(private http: HttpClient, private authService: AuthenticationService) { }

  getAllModules() {
    return this.http.get('/api/module/get-all-modules');
  }

  getModuleById(moduleId) {
    return this.http.get(`/api/module/get-module/${moduleId}`);
  }

  createModule(courseId, data) {
    return this.http.post('/api/module/new/' + courseId, data, { headers: { Authorization: `Bearer ${this.authService.getToken}` }});
  }

  editModule(moduleId, data) {
    return this.http.post(`/api/module/edit/${moduleId}`, data,
      { headers: { Authorization: `Bearer ${this.authService.getToken}` }});
  }
}
