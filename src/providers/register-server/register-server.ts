import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';

import *  as MyConfig from '../../providers/myConfig'
/*
  Generated class for the RegisterServerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RegisterServerProvider {

  	constructor(public http: Http) {
    	console.log('Hello RegisterServerProvider Provider');
  	}

  	Signup(username: string,password: string,p_node : string){
      let body = {email: username,password: password, p_node : p_node };
      return this.http.post(MyConfig.data.url+'/api/register',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }

    ActiveCode(code: string,customer_id: string){
      let body = {code: code,customer_id: customer_id };
      return this.http.post(MyConfig.data.url+'/api/active-code',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }

    Login(email: string,password: string){
      let body = {email: email,password: password };
      return this.http.post(MyConfig.data.url+'/api/login',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }

    ForgotPassword(email: string){
      let body = {email: email};
      return this.http.post(MyConfig.data.url+'/api/forgot-password',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }
    ChangePassword(customer_id: string, password_old: string,password_new: string){
      let body = {customer_id: customer_id, password_old: password_old, password_new: password_new};
      return this.http.post(MyConfig.data.url+'/api/change-password',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }

    ResendCode(customer_id: string){
      let body = {customer_id: customer_id};
      return this.http.post(MyConfig.data.url+'/api/resend-code',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }

    UpdateInfomation(customer_id: string, first_name: string,last_name: string,birth_day: string, address: string,telephone : string){
      let body = {customer_id: customer_id, first_name: first_name, last_name: last_name, birth_day : birth_day ,address : address, telephone: telephone };
      return this.http.post(MyConfig.data.url+'/api/update-infomation',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }

    
    private catchError(error : Response){
  		return Observable.throw(error.json().error || "server login error");
  	}

  	private logResponse(res : Response){
  		console.log(res);
  	}

  	private extractData(res : Response){
  		
  		return res.json();
  	}
}
