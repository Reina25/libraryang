import { Component, OnDestroy, OnInit, ViewChild  } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ProductService } from './Service/products.service';
import { Product } from './model/products';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'libraryang';

  allProducts: Product[] = [];
  isFetching: boolean = false;
  editMode: boolean = false;
  currentProductId: string;
  errorMessage: string = null;
  errorSub: Subscription;
  submitted:boolean=false;
  

  rolestudent=false;

  topicHasError=true;
  floorHasError=true;

  selectmain=false;
  selecthariri=true;


  buildings = ['Main', 'Hariri'];
  mainfloors = ['1','2','3','4','5'];
  haririfloors = ['1','2','3','4','5','6','7','8','9','10','11'];




  @ViewChild('productsForm') form: NgForm;


  userModel = new Product(" "," "," "," "," ");

  constructor(private productService: ProductService){

  }

  selectmainfun(){
    this.selectmain=true;
    this.selecthariri=false;
  }

  selectharirifun(){
    this.selecthariri=true;
    this.selectmain=false;
  }


  ngOnInit(){
    this.fetchProducts();
    this.errorSub = this.productService.error.subscribe((message) => {
      this.errorMessage = message;
    })
  }

  onProductsFetch(){
    this.fetchProducts();
  }

  onProductCreate(products: {libname: string, building: string, floor: string, fromtime:string, totime:string}){
    this.submitted=true;
    if(!this.editMode){
        this.productService.createProduct(products);
        this.productService.fetchProduct();
        this.form.reset();
    }else{
      this.productService.updateProduct(this.currentProductId, products);
      this.form.reset();
    }
    
  }

  private fetchProducts(){
    this.isFetching = true;
    this.productService.fetchProduct().subscribe((products) => {
      this.allProducts = products;
      this.isFetching = false;
    }, (err) => {
      this.errorMessage = err.message;
    })
  }

  onDeleteProduct(id: string){
    this.productService.deleteProduct(id);
  }

  onDeleteAllProducts(){
    this.productService.deleteAllProducts();
  }

  onEditClicked(id: string){
    this.selectharirifun();
    this.currentProductId = id;
    //Get the product based on the id
    let currentProduct = this.allProducts.find((p) => {return p.id === id});
    //console.log(this.form);

    //Populate the form with the product details
    this.form.setValue({
      libname: currentProduct.libname,
      building: currentProduct.building,
      floor: currentProduct.floor,
      fromtime: currentProduct.fromtime,
      totime: currentProduct.totime,
    });

    //Change the button value to update product
    this.editMode = true;
    this.fetchProducts();
   
  }

  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
  }

  validateTopic(value: any){
    if(value === 'Main' ){
      this.topicHasError=false;
      this.selectmainfun();
    }else if(value === 'Hariri'){
      this.topicHasError=false;
      this.selectharirifun();
    }else{
      this.topicHasError=true;
    }
  }

  validateFloor(value:any){
    if(value === '1' || value === '2' || value === '3' || value === '4' || value === '5' || value === '6' || value === '7' || value === '8' || value === '9' || value === '10' || value === '11' ){
        this.floorHasError=false;
    }else{
      this.floorHasError=true;
    }
  }

  canceledit(){
    this.editMode=false;
    this.form.reset();
    this.selectharirifun();
   

  }

}
