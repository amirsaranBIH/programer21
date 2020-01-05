
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ModuleService } from '../services/module.service';

@Injectable()
export class OneModuleBySlugResolverService implements Resolve<any> {

  constructor(private moduleService: ModuleService) { }

  resolve(route: ActivatedRouteSnapshot) {
    return this.moduleService.getModuleBySlug(route.paramMap.get('slug'));
  }

}
