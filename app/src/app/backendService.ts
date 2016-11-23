import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class BackendService {
  private checkUserUrl = 'http://localhost:3000/checkUser/';
  private newUserUrl = 'http://localhost:3000/newUser/';

  constructor(private http: Http) {
  }

  getCheckUser(id: any) {
    return this.http.get(this.checkUserUrl+id).map(res => res.json())
  };

  postNewUser(id: any) {
    let body: any = {id: id};
    return this.http.post(this.newUserUrl, body).map(res => res)
  }
}
