import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class BackendService {
  private backendUrl = 'https://arrivalapp.christophwalter.net/api/';
  private jwt = "eyJhbGciOiJIUzI1NiJ9.and0NGFwaQ.dBp0RpkUjuJIHdm6Nsw0htmaT6xV1FsEQ0hzwC4bgfk";
  private headers = new Headers({ 'Content-Type': 'application/json', "jwt":this.jwt });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http) {
  }

  getCheckUser(id: any) {
    return this.http.get(this.backendUrl + "checkUser/" + id,this.options).map(res => res.json())
  }
}
