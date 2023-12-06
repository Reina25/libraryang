import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject, throwError } from "rxjs";
import { map, catchError} from 'rxjs/operators';
import { Products } from '../model/products';

@Injectable({providedIn: "root"})
export class ProductService{
    error = new Subject<string>();
    constructor(private http: HttpClient){

    }

    //Create library in database
    createProduct(products: {libname: string, building: string, floor: string, fromtime:string, totime:string}){
        console.log(products);
        const headers = new HttpHeaders({'myHeader': 'procademy'});
        this.http.post<{name: string}>(
            'https://library-eff58-default-rtdb.firebaseio.com/products.json', 
            products, {headers: headers})
            .subscribe((res) => {
                console.log(res);
            }, (err) => {
                this.error.next(err.message);
            });
          
    }

    //fetch libraries from database
    fetchProduct(){
        const header = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Access-Control-Allow-Origin', '*')

        const params = new HttpParams()
        .set('print', 'pretty').set('pageNum', 1);
        return this.http.get<{[key: string]: Products}>('https://library-eff58-default-rtdb.firebaseio.com/products.json', 
                                                    {'headers' : header, params: params})
        .pipe(map((res) => {
            const products = [];
            for(const key in res){
                if(res.hasOwnProperty(key)){
                products.push({...res[key], id: key})
                }
            }
            return products;
        }), catchError((err) => {
            //write the logic for logging error
            return throwError(err);
        }))
       
    }

    //delete a library from database
    deleteProduct(id: string){
        let header = new HttpHeaders();
        header = header.append('myHeader1', 'Value1');
        header = header.append('myHeader2', 'Value2');
        this.http.delete('https://library-eff58-default-rtdb.firebaseio.com/products/'+id+'.json', {headers: header})
        .subscribe();
    }

    //delete all libraries from database
    deleteAllProducts(){
        this.http.delete('https://library-eff58-default-rtdb.firebaseio.com/products.json')
        .subscribe();
    }

    updateProduct(id: string, value: Products){
        this.http.put('https://library-eff58-default-rtdb.firebaseio.com/products/'+id+'.json', value)
        .subscribe();
    
    }
}