import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class BackendService {
  private backendUrl = 'https://arrivalapp.christophwalter.net/api/';
  private jwt: string;
  private headers = new Headers({'Content-Type': 'application/json'});
  private options = new RequestOptions({headers: this.headers});

  constructor(private http: Http) {

  }

  public saveJWT(jwt){
    this.jwt = jwt;
    this.headers = new Headers({'Content-Type': 'application/json', "jwt": this.jwt});
    this.options = new RequestOptions({headers: this.headers});
  };

  /* =====================================
   PUBLIC ROUTES
   ===================================== */
  public postNewUser(username: string, password: string) {
    let body = {username: username, password: password};
    return this.http.post(this.backendUrl + "newUser/", body, this.options).map(this.extractData);
  }

  public getCheckUser(id: any) {
    return this.http.get(this.backendUrl + "checkUser/" + id, this.options).map(this.extractStatusCode);
  }

  public postLoginUser(username: string, password: string) {
    let body = {username: username, password: password};
    return this.http.post(this.backendUrl + "loginUser/", body, this.options).map(this.extractData);
  }

  /* =====================================
   PRIVATE ROUTE
   ===================================== */
  public giveAccessTo(forId: string) {
    return this.http.get(this.backendUrl + "giveAccessTo/" + forId, this.options);
  }

  public removeAccess() {
    return this.http.get(this.backendUrl + "removeAccess/", this.options);
  }

  public uploadLocation(coords){
    let body = {coordinates: coords};
    return this.http.post(this.backendUrl + "uploadLocation/", body, this.options);
  }

  public getLocations(){
    return this.http.get(this.backendUrl + "getLocations/", this.options).map(this.extractData);
  }

  public getWhoDidIShare(){
    return this.http.get(this.backendUrl + "whoDidIShare/", this.options).map(this.extractData);
  }

  /* =====================================
   HELPER FUNCTIONS
   ===================================== */

  private extractData(res: Response) {
    let body;
    if (res['_body']) {
      body = res.json();
      return body || {};
    }
    else {
      return {};
    }
  }

  private extractStatusCode(res: Response) {
    if (res.status === 210) {
      return 210;
    }
    else if (res.status === 220) {
      return 220;
    }
    else {
      //status code does not match pattern
      console.log("wrong status code");
      console.log("res");
      return 404
    }
  }
}
