
const express=require('express');
const app=express();
const path=require("path");
const bodyparser=require("body-parser");
const multer=require('multer');
const mongoose=require('mongoose');
app.set('view engine','ejs');

app.set('views',path.join(__dirname,'views'));
app.use(express.static('public'));
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.json());

const DB='mongodb+srv://abdullah:abd123@cluster0.34stq.mongodb.net/HayatApp?retryWrites=true&w=majority'

mongoose.connect(DB,{
    useNewUrlParser:true,

   
});

const db=mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {

    console.log("Connected");
});


let resultschema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    dob:{
        type:String,
        required:true
    },
    uid:{
        type:String,
        required:true,
        unique:true
        
        
    },
    fname:{
        type:String,
        required:true
    },
    mname:{
        type:String,
        required:true
    },
    cname:{
        type:String,
        required:true
    },
    iname:{
        type:String,
        required:true
    },
    cdur:{
        type:String,
        require:true
    },
    status:{
        type:String,
        required:true
    },
    image:{
        type:String
    },

   subjects:[
    {
        SubjectName:{
            type:String,
            required:true
        },
        SubjectNumber:{
            type:String,
            required:true
        }
    }
   ]
     


   
    
      
})
let Result=mongoose.model('Result',resultschema)


var Storage=multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,'./public/images/');
    },
    filename:(req,file,callback)=>{
        callback(null,file.fieldname+"_"+Date.now()+"_"+file.originalname);
    }
});
var upload=multer({
    storage:Storage
}).single('file');






app.get('/',(req,res)=>{
    res.render('home');

})

app.get('/result',(req,res)=>{
    res.render('query')
})
var name="";
var dob="";
var uid="";
var fname="";
var mname="";
var cname="";
var iname="";
var status="";
var cdur="";
var nosub=0;
var image="";
app.post('/subject',(req,res)=>{

    upload(req,res,(err)=>{
        if(err){
            console.log(err);
        }
        else{

     name=req.body.name;
     dob=String(req.body.dob);
     uid=req.body.userId;
     fname=req.body.fname;
     mname=req.body.mname;
     cname=req.body.cname;
     iname=req.body.iname;
     nosub=req.body.subjects;
     cdur=String(req.body.cdur);
     status=req.body.status;
     image=req.file.filename
     res.redirect('/subjects')
        }
    })
})
app.get('/subjects',(req,res)=>{
    res.render('subject',{sub:nosub});
})

app.post('/add',(req,res)=>{
  let x=JSON.stringify(req.body).split(",");
  
 let y=[];
 let a=0;
 x[0]=x[0].slice(1);
 x[x.length-1]=x[x.length-1].slice(0,x[x.length-1].length-1);

 for(let i=0;i<x.length;i++){
   y[a++]=x[i].split(":")[1].slice(1,x[i].split(":")[1].length-1);
  
 }
 let arr=[];
 for(let i=0;i<y.length-1;i=i+2){
    let sname=y[i];
    let marks=y[i+1];
    console.log(sname);
    console.log(marks)
let obj={ 
    SubjectName:sname,
    SubjectNumber:marks
}
arr.push(obj);

 }
let data={
    name:name,
    dob:dob,
    uid:uid,
    fname:fname,
    mname:mname,
    cname:cname,
    iname:iname,
    status:status,
    cdur:cdur,
    image:image,
    subjects:arr
}
Result.create(data)
.then(result=>{
    res.redirect('/')
}).catch(err=>{
    res.send("Unable to send data");
})

})
app.post('/getresult',(req,res)=>{
    let uid=req.body.uid;
    let dob=String(req.body.dob);
    Result.findOne({$and:[{uid:uid},{dob:dob}]})
    .then(result=>{
        res.render('result',{result:result});
    })
    .catch(err=>{
        res.send("Unable to fetch details. Student Data Not Available/Enter Correct Data")
    })
})
app.listen('3000',()=>{
    console.log("started");
})