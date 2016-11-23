import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class BackendService {
  private backendUrl = 'https://arrivalapp.christophwalter.net/api/';
  private jwt = "eyJhbGciOiJIUzI1NiJ9.and0NGFwaQ.dBp0RpkUjuJIHdm6Nsw0htmaT6xV1FsEQ0hzwC4bgfk";
  private headers = new Headers({'Content-Type': 'application/json', "jwt": this.jwt});
  private options = new RequestOptions({headers: this.headers});

  constructor(private http: Http) {
  }

  //creates new user
  public postNewUser(username: string, password: string) {
    let body = {username: username, password: password};
    return this.http.post(this.backendUrl + "newUser/", body, this.options).map(this.extractData);
  }

  private extractData(res: Response){
    let body;
    if(res['_body']) {
      body = res.json();
      return body || { };
    }
    else{
      return {};
    }

  }

  public getCheckUser(id: any) {
    return this.http.get(this.backendUrl + "checkUser/" + id, this.options).map(this.extractStatusCode);
  }

  private extractStatusCode(res: Response){
    if(res.status === 210){
      return 210;
    }
    else if(res.status === 220){
      return 220;
    }
    else{
      //status code does not match pattern
      console.log("wrong status code");
      console.log("res");
      return 404
    }
  }

  public postLoginUser(username:string,password:string){
    let body = {username: username, password: password};
    return this.http.post(this.backendUrl + "loginUser/", body, this.options).map(this.extractData);
  }
}
