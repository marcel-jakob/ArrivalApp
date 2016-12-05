import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {Storage} from '@ionic/storage';

@Injectable()
export class BackendService {
  private backendUrl = 'https://arrivalapp.christophwalter.net/api/';
  private jwt: string;
  private headers = new Headers({'Content-Type': 'application/json'});
  private options = new RequestOptions({headers: this.headers});

  constructor(private http: Http, private storage: Storage) {
    this.updateJWT();
  }

  public updateJWT() {
    this.storage.get('jwt').then((jwt) => {
      if (jwt) {
        this.jwt = jwt;
        this.headers = new Headers({'Content-Type': 'application/json', "jwt": this.jwt});
        this.options = new RequestOptions({headers: this.headers});
        console.log("jwt stored in backendService");
      }
    });
  }

  //public routes
  public postNewUser(username: string, password: string) {
    let body = {username: username, password: password};
    return this.http.post(this.backendUrl + "newUser/", body, this.options).map(this.extractData);
  }

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

  public getCheckUser(id: any) {
    return this.http.get(this.backendUrl + "checkUser/" + id, this.options).map(this.extractStatusCode);
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

  public postLoginUser(username: string, password: string) {
    let body = {username: username, password: password};
    return this.http.post(this.backendUrl + "loginUser/", body, this.options).map(this.extractData);
  }

  //private routes
  public giveAccess(forId: string) {
    return this.http.get(this.backendUrl + "giveAccess/" + forId, this.options);
  }

  public uploadLocation(coords){
    let body = {coordinates: coords};
    return this.http.post(this.backendUrl + "uploadLocation/", body, this.options);
  }

  public getLocations(){
    return this.http.get(this.backendUrl + "getLocations/", this.options).map(this.extractData);
  }
}
