import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';

import *  as MyConfig from '../../providers/myConfig'
/*
  Generated class for the WithdrawServerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class WithdrawServerProvider {

  	constructor(public http: Http) {
    	console.log('Hello WithdrawServerProvider Provider');
  	}

  	GetUsers(username: string,password: string){
      let body = {email: username,password: password };
      return this.http.post(MyConfig.data.url+'/api/register',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }

   
    
    private catchError(error : Response){
		console.log(error);
		return Observable.throw(error.json().error || "server login error");
	}

  	private logResponse(res : Response){
  		console.log(res);
  	}

  	private extractData(res : Response){
  		
  		return res.json();
  	}
}
