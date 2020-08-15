import { Component, OnInit,ViewChild ,Inject} from '@angular/core';
import { Dish } from '../shared/dish';
import {DishService} from '../services/dish.service';
import {Params,ActivatedRoute} from '@angular/router';
import { switchMap } from 'rxjs/operators';
import {Location} from '@angular/common';
import { Comment } from '../shared/comment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider'
import { DISHES } from '../shared/dishes';
import { visibility, flyInOut,expand } from '../animations/app.animation';





@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  host:{
    '[@flyInOut]':'true',
    'style':'display:block'
  },
  animations: [
    visibility(),
    flyInOut(),
    expand()
]

})
export class DishdetailComponent implements OnInit {
 
  @ViewChild('cform') commentFormDirective;
  commentForm: FormGroup;
  comment:Comment;
  
  errMess: string;
  dish: Dish;
  dishIds:string[];
  prev:string;
  next:string;
  dishcopy:Dish;

  visibility='shown';

  formErrors = {
    'author': '',
    'rating':5,
    'comment': ''
  };

  validationMessages = {
    'author': {
      'required':      ' Name is required.',
      'minlength':     ' Name must be at least 2 characters long.',
      'maxlength':     ' Name cannot be more than 25 characters long.'
    },
    'comment': {
      'required':      'comment is required.',
    },
  }

  constructor(private dishservice:DishService,private route:ActivatedRoute,
    private location:Location,private fb:FormBuilder,@Inject('BaseURL') private BaseURL) {
       this.createForm();
      }

  ngOnInit() {
    this.createForm();
    /*const id=this.route.snapshot.params['id'];
    this.dishservice.getDish(id)
    .subscribe(dish => this.dish=dish,
      errMess=>this.errMess=<any>errMess); 
      
      https://github.com/jcarlosj/Front-End-JavaScript-Frameworks-Angular-C-HKUST
      
      */
    this.dishservice.getDishIds()
    .subscribe(dishIds => this.dishIds = dishIds);
    this.route.params
    .pipe(switchMap((params: Params) =>{this.visibility='hidden'; return this.dishservice.getDish(params['id'])}))
    .subscribe(dish => { this.dish = dish; this.dishcopy=dish;this.setPrevNext(dish.id);this.visibility='shown';
       errmess=>this.errMess=<any>errmess 
  })
}
  goBack():void{
    this.location.back();
  }
  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  createForm(): void{
    this.commentForm=this.fb.group({
      author:['',[Validators.required, Validators.minLength(2),Validators.maxLength(25)]],
      rating:5,
      comment:['',[Validators.required]]

    });
    this.commentForm.valueChanges.subscribe(data=>this.onValueChanged(data));
    this.onValueChanged();
  }
 
  onSubmit() {
		this.comment = this.commentForm.value;
		this.comment.date = new Date().toISOString();
    this.dish.comments.push(this.comment);
    this.dishcopy.comments.push(this.comment);
    this.dishservice.putDish(this.dishcopy).subscribe(dish=>{this.dish=dish; this.dishcopy=dish;},
    errmess=>{this.dish=null;this.dishcopy=null;this.errMess=<any>errmess})
		this.commentForm.reset({
			author: '',
			rating: 5,
			comment: ''
    });
    this.commentFormDirective.resetForm();
	}



  onValueChanged(data?: any) {
    if (!this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }
}
