
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ModuleService } from '../services/module.service';

@Injectable()
export class OneModuleResolverService implements Resolve<any> {

  constructor(private moduleService: ModuleService) { }

  resolve(route: ActivatedRouteSnapshot) {
    return this.moduleService.getModuleById(route.paramMap.get('module_id'));
  }

}
