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
export class DepositServerProvider {

  	constructor(public http: Http) {
    	//console.log('Hello DepositServerProvider Provider');
  	}

  	GetWalletAddress(customer_id: string,currency: string){
      let body = {customer_id: customer_id,currency: currency };
      return this.http.post(MyConfig.data.url+'/api/deposit/get-address',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }

    GetUser(customer_id: string){
      let body = {customer_id: customer_id };
      return this.http.post(MyConfig.data.url+'/api/deposit/get-user',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }


    GetHisroryDeposit(customer_id: string,start : number, limit : number){
      let body = {customer_id: customer_id, start: start,  limit: limit};
      return this.http.post(MyConfig.data.url+'/api/deposit/get-history',body)
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
