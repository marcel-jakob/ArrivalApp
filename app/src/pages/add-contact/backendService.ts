import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class BackendService {
  private checkUserUrl = 'http://localhost:3000/checkUser/';

  constructor(private http: Http) {
  }

  getCheckUser(id: any) {
    return this.http.get(this.checkUserUrl+id).map(res => res.json())
  }
}
