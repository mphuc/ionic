import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';

import *  as MyConfig from '../../providers/myConfig'
/*
  Generated class for the DepositServerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ReffralServerProvider {

  	constructor(public http: Http) {
    	//console.log('Hello DepositServerProvider Provider');
  	}
    GetMember(customer_id: string,start : number, limit : number){
      let body = {customer_id: customer_id, start: start,  limit: limit};
      return this.http.post(MyConfig.data.url+'/api/exchange/get-member',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }
    GetInfomationUser(customer_id: string){
      let body = {customer_id: customer_id};
      return this.http.post(MyConfig.data.url+'/api/exchange/get-infomation-user',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }

    UpdateImgProfile(customer_id: string, base64Image : string){
      let body = {customer_id: customer_id, base64Image : base64Image};
      return this.http.post(MyConfig.data.url+'/api/update-img-profile',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }

    GetVersionApp(){
      let body = {};
      return this.http.post(MyConfig.data.url+'/api/get-version-app',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }

    private catchError(error : Response){
		//console.log(error);
		return Observable.throw(error.json().error || "server login error");
	}

  	private logResponse(res : Response){
  		//console.log(res);
  	}

  	private extractData(res : Response){
  		
  		return res.json();
  	}
}
