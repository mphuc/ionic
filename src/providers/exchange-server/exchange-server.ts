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
export class ExchangeServerProvider {

  	constructor(public http: Http) {
    	//console.log('Hello DepositServerProvider Provider');
  	}

  	ExchangeSubmit(customer_id: string,form: string, to : string, amount: number){
      let body = {customer_id: customer_id,form: form, to: to, amount : amount  };
      return this.http.post(MyConfig.data.url+'/api/exchange/submit',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }
       
    GetHisroryExchange(customer_id: string,start : number, limit : number){
      let body = {customer_id: customer_id, start: start,  limit: limit};
      return this.http.post(MyConfig.data.url+'/api/exchange/get-history',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }

    GetListNotification(customer_id: string,start : number, limit : number){
      let body = {customer_id: customer_id, start: start,  limit: limit};
      return this.http.post(MyConfig.data.url+'/api/exchange/get-notification',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }

    LoadPrice(){
      let body = {};
      return this.http.post(MyConfig.data.url+'/api/exchange/load-price',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }

    InvestmentSubmit(customer_id: string,currency : string, amount : number){
      let body = {customer_id: customer_id, currency: currency,  amount: amount};
      return this.http.post(MyConfig.data.url+'/api/investment/active-package',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }

    WithdrawSubmit(customer_id: string,currency : string, amount : number,wallet : string){
      let body = {customer_id: customer_id, currency: currency,  amount: amount, wallet : wallet};
      return this.http.post(MyConfig.data.url+'/api/investment/withdraw-submit',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }

    GetHisroryInvestment(customer_id: string,start : number, limit : number){
      let body = {customer_id: customer_id, start: start,  limit: limit};
      return this.http.post(MyConfig.data.url+'/api/investment/get-history',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }
    
    GetHisroryWithdraw(customer_id: string,start : number, limit : number){
      let body = {customer_id: customer_id, start: start,  limit: limit};
      return this.http.post(MyConfig.data.url+'/api/investment/get-history-withdraw',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }
    
    LoadDetailWithdraw(_id: string){
      let body = {_id: _id};
      return this.http.post(MyConfig.data.url+'/api/investment/get-detail-withdraw',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }

    GetHisroryTransaction(customer_id: string,start : number, limit : number){
      let body = {customer_id: customer_id, start: start,  limit: limit};
      return this.http.post(MyConfig.data.url+'/api/exchange/get-history-transaction',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }

    GetHisroryProfit(customer_id: string,types : string,start : number, limit : number){
      let body = {customer_id: customer_id,types : types, start: start,  limit: limit};
      return this.http.post(MyConfig.data.url+'/api/exchange/get-history-profit',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }

    SupportSubmit(customer_id: string,title : string, content : string){
      let body = {customer_id: customer_id, title: title,  content: content};
      return this.http.post(MyConfig.data.url+'/api/exchange/submit-support',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }


    SupportSubmitReply(customer_id: string,_id: string, content : string){
      let body = {customer_id: customer_id, _id: _id, content: content};
      return this.http.post(MyConfig.data.url+'/api/exchange/submit-support-reply',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }
    

    GetHisrorySupport(customer_id: string,start : number, limit : number){
      let body = {customer_id: customer_id, start: start,  limit: limit};
      return this.http.post(MyConfig.data.url+'/api/exchange/get-history-support',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }

    GetHisrorySupportID(_id: string){
      let body = {_id: _id};
      return this.http.post(MyConfig.data.url+'/api/exchange/get-support-id',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }
    GetNotificationID(_id: string){
      let body = {_id: _id};
      return this.http.post(MyConfig.data.url+'/api/exchange/get-notification-id',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }
    
    
    GetHisroryDialing(customer_id: string,start : number, limit : number){
      let body = {customer_id: customer_id, start: start,  limit: limit};
      return this.http.post(MyConfig.data.url+'/api/exchange/get-history-dialing',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }

    GetNumberDialing(customer_id: string){
      let body = {customer_id: customer_id};
      return this.http.post(MyConfig.data.url+'/api/exchange/get-number-dialing',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }

    UpdateDialing(customer_id: string,number_random: number){
      let body = {customer_id: customer_id,number_random:number_random};
      return this.http.post(MyConfig.data.url+'/api/exchange/update-number-dialing',body)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError)
    }

    CountNotification(customer_id: string){
      let body = {customer_id: customer_id};
      return this.http.post(MyConfig.data.url+'/api/exchange/count-notification',body)
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
