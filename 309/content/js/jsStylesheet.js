var log=console.log;
if (document.getElementById('myChart')!= null){
    var ctx = document.getElementById('myChart').getContext('2d');
}

var registerButton=document.querySelector('#registerButton');
var loginButton=document.querySelector('#loginButton');
var logoffButton=document.querySelector('#logoffButton');
var homeButton=document.querySelector('#homeButton');
var logoffButton=document.querySelector('#logoffButton');


var stockList=[];
var postList=[];
var top6Recommanded = [];
var postNum = 0;
var currentStock;
var chart1CurrentCompany;
var firstSearch=0;

let currentUser=undefined;

let registeredUserList=[]; //store user object
let registeredUserIndexList={}; //store username and its array index in 'registeredUserList'


let stockIndexList={}; //store stockID and its array index in 'stockList'


let notifyList=[]; //store notify object

let orderList=[];

let userNum=0;
let stockNum=0;
let notifyNum=0;
let orderNum=0;

class User{
    constructor(username,password){
        this.username=username;
        this.password=password;
        this.balance=0;
        if(username==='admin'){
            this.level='admin';
            this.follow=['user','user2'];
            this.follower=['user','user2'];
        }
        else{
            this.level='normal';
            this.follow=['admin'];
            this.follower=['admin'];
        }
        this.status='legal'
        this.stockOwned={}; //stockId and owned units
        this.post=[];
        this.notify=[];
        this.order=[];
    }
}

class Stock{
    constructor(id){
        this.id=id;
        // ------get these informatin from server-------
        this.company='Apple Inc.';
        this.currentPrice=78.58;
        this.lastPrice=78.48;
        this.change=0.1;
        this.changePercent=0.06;
        this.previousClose=174.23;
        this.open=173.71;
        this.marketCap=822.015;
        this.peRatio=14.38;
        //record 
        //the following array has max capacity of 12 elements
        this.yearPriceHistory=[];
        this.monthlyPriceHistory=[];
        this.dailyPriceHistory=[];
        this.postedBy = [];
        this.postContent = [];
        this.replyTo = [];
        this.replyBy = [];
        this.replyContent = [];
        this.posttime = [];
        //------------------------------
    }

    update(){
        // ------get these informatin from server-------
        this.company='Apple Inc.';
        this.currentPrice=174.33;
        this.change=0.1;
        this.changePercent=0.06;
        this.previousClose=174.23;
        this.open=173.71;
        this.marketCap=822.015;
        this.peRatio=14.38;
        //------------------------------
    }
}


class Post{
    constructor(who,underStock,content){
        this.who=who;
        this.underStock=underStock;
        this.time=Date(Date.now()).slice(4,21);
        this.content=content;
        this.postId=postNum;
        this.commentUser=[];
        this.commentContent=[];
        this.commentReplyTo=[];
        
        postNum++;
    }
}

class Notify{
    constructor(to,subject,content){
        this.to=to;
        this.time=Date(Date.now()).slice(4,21);
        this.subject=subject;
        this.content=content;
        this.notifyId=notifyNum;
        notifyNum++;
    }
}

class Order{
    constructor(username,stockId,unit,type){
        this.username=username;
        this.stockId=stockId;
        this.unit=unit;
        this.type=type;
        this.time=Date(Date.now()).slice(4,21);
        this.orderId=orderNum;
        orderNum++;
    }
}

//hard code data into js
var apple = new Stock("AAPL");
apple.company='Apple Inc.';
apple.yearPriceHistory=[51,53,56,57,52,68,68,72,75,77,77,78];
apple.monthlyPriceHistory=[77,77.9,78,79,75,76,77,79,78,78,79,78.5];
apple.dailyPriceHistory=[78.51,78.53,78.52,78.59,78.58,78.57,78.56,78.55,78.54,78.55,78.59,78.58];
apple.postedBy = ["kevin","Jane"];
apple.posttime = ["Feb2 2019","Feb4 2019"];
apple.postContent = ["This company is awsome!", "Worth it!"];
apple.replyTo = [["kevin", "John"],["Jane","bob"]];
apple.replyBy = [["John", "josh"],["bob","jessie"]];
apple.replyContent = [["no kidding it is", "I bought it too"],["yeah","sure"]];
stockList.push(apple);
top6Recommanded.push(apple);

var ms = new Stock("MSFT");
ms.company='MicroSoft Inc.';
ms.currentPrice=174.33;
ms.lastPrice=174.33;
ms.change=0.1;
ms.changePercent=0.06;
ms.previousClose=174.23;
ms.open=173.71;
ms.marketCap=822.015;
ms.peRatio=14.38;
ms.yearPriceHistory=[164,163,167,164,165,166,167,172,173,174,174.5,174.33];
ms.monthlyPriceHistory=[174.5,173.5,173.5,173.6,173.7,173.8,173.9,173.2,173.3,173.5,174.1,174.5];
ms.dailyPriceHistory=[174.1,174.1,174.1,174.2,174.1,174.2,174.1,174.3,174.4,174.5,174.4,174.5];
stockList.push(ms);
top6Recommanded.push(ms);

var google = new Stock("GOOG");
google.company='Google Inc.';
google.currentPrice=98.58;
google.yearPriceHistory=[81,83,86,87,82,88,88,82,85,87,87,98];
google.monthlyPriceHistory=[87,87.9,88,89,85,86,92,89,95,98,99,98.5];
google.dailyPriceHistory=[98.51,98.53,98.52,98.59,98.58,98.57,98.56,98.55,98.54,98.55,98.59,98.58];
stockList.push(google);
top6Recommanded.push(google);

var ubisoft = new Stock("UBI");
ubisoft.currentPrice=123.58;
ubisoft.company='Ubisoft Inc.';
ubisoft.yearPriceHistory=[101,103,101,103,108,110,112,114,119,121,123,123];
ubisoft.monthlyPriceHistory=[123,123.9,123,123,85,123,92,123,123,123,99,98.5];
ubisoft.dailyPriceHistory=[122.51,122.53,122.52,122.59,123.58,123.57,123.56,123.55,123.54,123.55,98.59,123.58];
stockList.push(ubisoft);
top6Recommanded.push(ubisoft);

var ea = new Stock("EA");
ea.company='EA Inc.';
ea.yearPriceHistory=[81,83,86,87,82,88,88,82,85,87,87,98];
ea.monthlyPriceHistory=[87,87.9,88,89,85,86,92,89,95,98,99,98.5];
ea.dailyPriceHistory=[98.51,98.53,98.52,98.59,98.58,98.57,98.56,98.55,98.54,98.55,98.59,98.58];
stockList.push(ea);
top6Recommanded.push(ea);
top6Recommanded.push(google);

currentStock = stockList[0];





//set recommanded stock default

if (document.getElementById("title").innerText == "Pharo Stockpage"){
    update_monthly_line_chart_by_stockid("myChart",currentStock,"monthly");
}
else if(document.getElementById("title").innerText == "Pharos Home"){
    update_monthly_line_chart_by_stockid("myChart",currentStock,"monthly");
}

updateStockPosts();

function updateStockPosts() {

    if (document.getElementById("title").innerText == "Pharo Stockpage"){
    let block=document.querySelector('#postsReply');
    for(let i=0; i<currentStock.postedBy.length;i++){
        postContainer = document.createElement("div");
        block.appendChild(postContainer);
        postContainer.className = "postContainer";
        post = document.createElement("div");
        post.className = "post";
        whopost = document.createElement("ul");
        whopost.className = "whoPost";
        li = document.createElement("li");
        img = document.createElement("img");
        img.className = "profilePic";
        img.id = "postPic";
        img.src = "content/images/logo.png";
        li.appendChild(img);
        whopost.appendChild(li);
        li1 = document.createElement("li");
        user = document.createElement("span");
        user.className = "userName";
        user.innerText = currentStock.postedBy[i];
        time = document.createElement("span");
        time.className = "dateTime";
        time.innerText = currentStock.posttime[i];
        br = document.createElement("br");
        li1.appendChild(user);
        li1.appendChild(br);
        li1.appendChild(time);
        whopost.appendChild(li1);
        post.appendChild(whopost);

        postContentDiv = document.createElement("div");
        postContentDiv.className = "postContent";
        conSpan = document.createElement("span");
        conSpan.innerText = currentStock.postContent[i];
        postContentDiv.appendChild(conSpan);
        post.appendChild(postContentDiv);

        if(currentStock.replyContent != null){
        commentReply = document.createElement("div");
        commentReply.className = "commentReply";
            for(let j=0; j<currentStock.postedBy.length;j++){
                reply = document.createElement("div");
                reply.className = "comment";
                spanr1 = document.createElement("span");
                spanr2 = document.createElement("span");
                spanr3 = document.createElement("span");
                spanr1.className = "userName";
                spanr2.className = "userName";
                spanr3.className = "commentContent";
                spanr1.innerText = currentStock.replyBy[i][j] + " reply to ";
                spanr2.innerText = currentStock.replyTo[i][j] + ":  ";
                spanr3.innerText = currentStock.replyContent[i][j];
                reply.appendChild(spanr1);
                reply.appendChild(spanr2);
                reply.appendChild(spanr3);
                commentReply.appendChild(reply);
                post.appendChild(commentReply);
            }
        }

        postContainer.appendChild(post)
        var containerpost = document.getElementById("postsReply");
        containerpost.insertBefore(postContainer,containerpost[0]);

    }

  }
}

function makeNewPost(postcon){
    // let postContent=document.createElement('div');
    // let postsReply=document.querySelector('.#postsReply');
        postContainer = document.createElement("div");
        let block=document.querySelector('#postsReply');
        block.appendChild(postContainer);
        postContainer.className = "postContainer";
        post = document.createElement("div");
        post.className = "post";
        whopost = document.createElement("ul");
        whopost.className = "whoPost";
        li = document.createElement("li");
        img = document.createElement("img");
        img.className = "profilePic";
        img.id = "postPic";
        img.src = "content/images/logo.png";
        li.appendChild(img);
        whopost.appendChild(li);
        li1 = document.createElement("li");
        user = document.createElement("span");
        user.className = "userName";
        user.innerText = 'you';
        time = document.createElement("span");
        time.className = "dateTime";
        time.innerText = Date(Date.now()).slice(4,21);
        br = document.createElement("br");
        li1.appendChild(user);
        li1.appendChild(br);
        li1.appendChild(time);
        whopost.appendChild(li1);
        post.appendChild(whopost);

        postContentDiv = document.createElement("div");
        postContentDiv.className = "postContent";
        conSpan = document.createElement("span");
        conSpan.innerText = postcon;
        postContentDiv.appendChild(conSpan);
        post.appendChild(postContentDiv);

        postContainer.appendChild(post)
        var containerpost = document.getElementById("postsReply");
        containerpost.insertBefore(postContainer,containerpost[0]);

}




//set main page stock info top 6 recommanded default

if (document.getElementById("title").innerText == "Pharos Home" ){
    //recommanded 1st
    document.getElementById("recommandComp1Name").innerText = top6Recommanded[0].company;
    document.getElementById("recommandComp1Num").innerText = top6Recommanded[0].id;
    document.getElementById("recommandComp1Current").innerText = top6Recommanded[0].currentPrice;
    document.getElementById("recommandComp1Change").innerText = top6Recommanded[0].change;
    //recommanded 2st
    document.getElementById("recommandComp2Name").innerText = top6Recommanded[1].company;
    document.getElementById("recommandComp2Num").innerText = top6Recommanded[1].id;
    document.getElementById("recommandComp2Current").innerText = top6Recommanded[1].currentPrice;
    document.getElementById("recommandComp2Change").innerText = top6Recommanded[1].change;
    //recommanded 3st
    document.getElementById("recommandComp3Name").innerText = top6Recommanded[2].company;
    document.getElementById("recommandComp3Num").innerText = top6Recommanded[2].id;
    document.getElementById("recommandComp3Current").innerText = top6Recommanded[2].currentPrice;
    document.getElementById("recommandComp3Change").innerText = top6Recommanded[2].change;
    //recommanded 4st
    document.getElementById("recommandComp4Name").innerText = top6Recommanded[3].company;
    document.getElementById("recommandComp4Num").innerText = top6Recommanded[3].id;
    document.getElementById("recommandComp4Current").innerText = top6Recommanded[3].currentPrice;
    document.getElementById("recommandComp4Change").innerText = top6Recommanded[3].change;
    //recommanded 5st
    document.getElementById("recommandComp5Name").innerText = top6Recommanded[4].company;
    document.getElementById("recommandComp5Num").innerText = top6Recommanded[4].id;
    document.getElementById("recommandComp5Current").innerText = top6Recommanded[4].currentPrice;
    document.getElementById("recommandComp5Change").innerText = top6Recommanded[4].change;
    //recommanded 6st
    document.getElementById("recommandComp6Name").innerText = top6Recommanded[5].company;
    document.getElementById("recommandComp6Num").innerText = top6Recommanded[5].id;
    document.getElementById("recommandComp6Current").innerText = top6Recommanded[5].currentPrice;
    document.getElementById("recommandComp6Change").innerText = top6Recommanded[5].change;
}


//chart Top 6 recommanded Companies
if (document.getElementById("myChart1")) {
    var ctx1 = document.getElementById("myChart1").getContext('2d');
    var myChart1 = new Chart(ctx1, {
    type: 'bar',
        data: {
            labels: [top6Recommanded[0].company,top6Recommanded[1].company,top6Recommanded[2].company,top6Recommanded[3].company,top6Recommanded[4].company,top6Recommanded[5].company],
            datasets: [{
            label: 'current price $',
            data: [top6Recommanded[0].currentPrice,top6Recommanded[1].currentPrice,top6Recommanded[2].currentPrice,top6Recommanded[3].currentPrice,top6Recommanded[4].currentPrice,top6Recommanded[5].currentPrice],
            backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
           ],
            borderColor: [
               'rgba(255,99,132,1)',
               'rgba(54, 162, 235, 1)',
               'rgba(255, 206, 86, 1)',
               'rgba(75, 192, 192, 1)',
               'rgba(153, 102, 255, 1)',
               'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });
}

if(loginButton!==null){
    loginButton.addEventListener('click',login);
}

if(logoffButton!==null){
    logoffButton.addEventListener('click',logoff);
}

 if(registerButton!==null){
    registerButton.addEventListener('click',register);
}

function clearChildElements(parent,secTitle){
    //This function clear all child elements inside a block-class element but remains the title
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
    let h2=document.createElement('h2');
    h2.setAttribute('class','secTitle');
    h2.innerText=secTitle;
    parent.appendChild(h2);
}

function userLogin(username,password){

    if(username in registeredUserIndexList ===false){
        alert('unregistered username');
        return;
    }
    else{
        let loggingUser=registeredUserList[registeredUserIndexList[username]];

        if(password !== loggingUser.password){
            alert('uncorrect password');
            return;
        }

        else{
            return loggingUser;
        }
    }
}

function userConstruct(username,password){
    if(username in registeredUserIndexList===true){
        alert('user already exist');
    }
    else{
        registeredUserIndexList[username]=userNum;
        userNum++;
        let newUser=new User(username,password);
        registeredUserList.push(newUser);
        return newUser;
    }
}

function updateHeader(){
    if(currentUser!==undefined){
        let headerOption=document.querySelector('#headerOption');
        let registerButton=document.querySelector('#registerButton');
        let loginButton=document.querySelector('#loginButton');

        headerOption.removeChild(registerButton.parentElement);
        headerOption.removeChild(loginButton.parentElement);

        let userPage=document.createElement('a');
        let userPageLi=document.createElement('li');
        if(currentUser.username==='admin'){
            userPage.setAttribute('href','adminPage.html');
            userPage.innerText="admin's Page";
        }
        else{
            userPage.setAttribute('href','userPage.html');
            userPage.innerText=currentUser.username+"'s Page";
        }
        userPageLi.appendChild(userPage);
        headerOption.appendChild(userPageLi);

        let logoffLi=document.createElement('li');
        let logoffButton=document.createElement('a');
        logoffButton.setAttribute('class','logoffButton');
        logoffButton.innerText='Logoff';
        logoffButton.setAttribute('href','Mainpage.html');
        logoffLi.appendChild(logoffButton);
        headerOption.appendChild(logoffLi);
    }
   
}

function login(e){
    e.preventDefault();
    let choice=popUp('Login','Please enter your username & password','text',2,['username','password']);
    let popUpPage=choice[0];
    let continueButton=choice[1];
    let cancelButton=choice[2];
    let popUpTextBoxs=document.querySelectorAll('.popUpTextBox');
    let usernameBox=popUpTextBoxs[0];
    let passwordBox=popUpTextBoxs[1];

    continueButton.onclick=function(){
        let username=usernameBox.value;
        let password=passwordBox.value;
        if(username==="" || password===""){
            alert('please provide your username and password');
        }
        else{
            currentUser=userLogin(username,password);
            popUpPage.style.display='none';
            document.body.removeChild(popUpPage);

            if(currentUser!==undefined){
                updateHeader();
            }
        }
        
    }

    cancelButton.onclick=function(){
        popUpPage.style.display='none';
        document.body.removeChild(popUpPage);
    }
}

function logoff(e){
    e.preventDefault();
    currentUser=undefined;
    window.location.replace('Mainpage.html');
}

function register(e){
    e.preventDefault();
    let choice=popUp('Register','Please enter your username & password','text',2,['username','password']);
    let popUpPage=choice[0];
    let continueButton=choice[1];
    let cancelButton=choice[2];
    let popUpTextBoxs=document.querySelectorAll('.popUpTextBox');
    let usernameBox=popUpTextBoxs[0];
    let passwordBox=popUpTextBoxs[1];

    continueButton.onclick=function(){
        let username=usernameBox.value;
        let password=passwordBox.value;
        if(username==="" || password===""){
            alert('please provide your username and password');
        }
        else{
            let newUser=userConstruct(username,password);
            currentUser=newUser;
            popUpPage.style.display='none';
            document.body.removeChild(popUpPage);

            if(currentUser!==undefined){
                updateHeader();
            }
        }
    }

    cancelButton.onclick=function(){
        popUpPage.style.display='none';
        document.body.removeChild(popUpPage);
    }
}

function popUp(title,content,type,boxNum,placeHolder){
    let popUpPage=document.createElement('div');
    popUpPage.setAttribute('class','popUpPage');

    let popUpRegion=document.createElement('div');
    popUpRegion.setAttribute('class','popUpRegion');

    let popUpTitle=document.createElement('h2');
    popUpTitle.setAttribute('class','popUpTitle');
    popUpTitle.innerHTML=title;

    let popUpContent=document.createElement('div');
    popUpContent.setAttribute('class','popUpContent');
    popUpContent.innerHTML=content;

    popUpRegion.appendChild(popUpTitle);
    popUpRegion.appendChild(popUpContent);
    popUpPage.appendChild(popUpRegion);

    if(type!=='none'){
        if(type!=='textarea'){

            for(let i=0; i<boxNum; i++){
                let thisPlaceholder=placeHolder[i];
                let textBoxContainer=document.createElement('div');
                let textBox=document.createElement('input');
                textBox.setAttribute('class','popUpTextBox');
                textBox.setAttribute('placeholder',thisPlaceholder);
                textBoxContainer.appendChild(textBox);
                popUpRegion.appendChild(textBoxContainer);
    
                if(type==='text'){
                    textBox.setAttribute('type','text');
                }
                else if(type==='number'){
                    textBox.setAttribute('type','number');
                }
            }
        }
        else{
            for(let i=0; i<boxNum; i++){
                let thisPlaceholder=placeHolder[i];
                let textBoxContainer=document.createElement('div');
                let textBox=document.createElement('textarea');
                textBox.setAttribute('class','popUpTextBox');
                textBox.setAttribute('placeholder',thisPlaceholder);
                textBoxContainer.appendChild(textBox);
                popUpRegion.appendChild(textBoxContainer);
            }
        }
    }
    

    let continueButton=document.createElement('button');
    let cancelButton=document.createElement('button');
    continueButton.setAttribute('class','continueButton');
    cancelButton.setAttribute('class','cancelButton');
    continueButton.innerHTML='Continue';
    cancelButton.innerHTML='Cancel';
    popUpRegion.appendChild(continueButton);
    popUpRegion.appendChild(cancelButton);

    document.body.appendChild(popUpPage);

    return [popUpPage,continueButton,cancelButton];
}

function update_monthly_line_chart_by_stockid(chartname,stock,interval){
    var ctx = document.getElementById(chartname).getContext('2d');

    
    var companyNameTemp = stock.company;
    
    


    if (interval == "yearly"){
        var tempData = stock.yearPriceHistory;
        var chartname = new Chart(ctx, {
        type: 'line',

        // The data for our dataset
        data: {
            labels: ["2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015","2016","2017","2018"],
            datasets: [{
                label: companyNameTemp + " past 12 years performance",
                
                borderColor: 'rgb(255, 99, 132)',
                data: tempData,
            }]
        },

        // Configuration options go here
        options: {}
        });
    }

    //graph data monthly
    if (interval == "monthly"){
        var tempData = stock.monthlyPriceHistory;
        var chartname = new Chart(ctx, {
        type: 'line',

        // The data for our dataset
        data: {
            labels: ["Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec","Jan","Feb","Mar"],
            datasets: [{
                label: companyNameTemp + " past 12 months performance",
                
                borderColor: 'rgb(255, 99, 132)',
                data: tempData,
            }]
        },

        // Configuration options go here
        options: {}
        });
    }

    if (interval == "daily"){
        var tempData = stock.dailyPriceHistory;
        var chartname = new Chart(ctx, {
        type: 'line',

        // The data for our dataset
        data: {
            labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9","10","11","12"],
            datasets: [{
                label: companyNameTemp + " past 12 months performance",
                
                borderColor: 'rgb(255, 99, 132)',
                data: tempData,
            }]
        },

        // Configuration options go here
        options: {}
        });
    }

        



        //update portfolio
        //if not on main page (in this case on stock page)
        if (document.getElementById("title").innerText != "Pharos Home" ){
            document.getElementById("stockPagePortfolio1").innerText = stock.company;
            document.getElementById("stockPagePortfolio2").innerText = stock.id;
            document.getElementById("stockPagePortfolio3").innerText = "Current: $" +stock.currentPrice;
            document.getElementById("stockPagePortfolio4").innerText = "change: $" + stock.change;
        }
        
        //if a serch is performed, the header becomes the name of the searched company
        if (firstSearch != 0){
            document.getElementById("stockPageHeader1").innerText = stock.company;
        }
       
    

}




function searchByStockID(stockid,interval) {
    var stockflag = 0; 
    var tempStock;
    var inputStockNum
    //when click search button
    if (stockid == ""){
        inputStockNum = document.querySelector('#inputStock').value;
    }
    //when click recommended button
    else{
        inputStockNum = stockid;  
    }
    //id search input is not empty
    if (inputStockNum != ""){
        //check if stock id valid
        for (let i=0; i<stockList.length;i++){
            if (stockList[i].id == inputStockNum){
                tempStock = stockList[i];
                //found stock, set flag to 1
                stockflag = 1;
            }
        }

        //check if stock is found
        if (stockflag == 1){
            //update current stock

            currentStock = tempStock;


            //made first search, the header changes
            firstSearch = 1;
            //update line chart
            if (interval == ""){
                update_monthly_line_chart_by_stockid("myChart",currentStock,"monthly");
            }
            else{
                update_monthly_line_chart_by_stockid("myChart",currentStock,interval);
            }
            
            //set flag back to 0
            stockflag = 0;
            //empty input box
            
        }
        //stock not found
        else {
            //empty input box
            document.querySelector('#inputStock').value = "";
            //update placeholder
            document.querySelector('#inputStock').placeholder = "Stock ID invalid";
        }
    }
    //search input empty
    else {
        document.querySelector('#inputStock').placeholder = "input empty"
        if (interval != ""){
                update_monthly_line_chart_by_stockid("myChart",currentStock,interval);
            }
    }

}

function makeSelfPost() {
    const tempText = document.getElementById("selfPost").value;
    if (tempText ==  "") {
        document.getElementById("selfPost").placeholder = "Post can not be empty"
    }
    else {
        var postcon = document.getElementById("selfPost").value;
        //find stock
        for (let i=0; i<stockList.length;i++){
            if (stockList[i] == currentStock){
                stockList[i].postContent.push(postcon);
                stockList[i].postedBy.push("You");
                stockList[i].posttime.push("now");


            }
        }

       makeNewPost(postcon);

        document.getElementById("selfPost").placeholder = "Successfully posted !"
        //make input box empty
        document.getElementById("selfPost").value = "";
        //push content to database
        //write here


        //get current postid
    }
}



function Introduction(){
    document.getElementById("coverH1").innerText = "Pharos Trader Provides all Stock info";
    document.getElementById("coverP").innerText = "Pharos is a website that provides real time stock trading information, with discussions and recommandations made by professional stock traders. The Pharos Smart AI will automatically record and analyse your stock of interested and provided various aid for you."
    document.getElementById("coverP").style.fontSize = "20px";
    document.getElementById("coverP").style.textAlign = "left";
    document.getElementById("indexbtn").className = "none";
    document.getElementById("introbtn").className = "red";
    document.getElementById("infobtn").className = "none";
}


function coverAboutUs(){
    document.getElementById("coverH1").innerText = "TEAM 27";
    document.getElementById("coverP").innerText = "Muyi Chen,   Kaiwen Ying,   Chang Liu,   Chunwei Cai "
    document.getElementById("coverP").style.textAlign = "center";
    document.getElementById("coverP").style.fontSize = "20px";
    document.getElementById("indexbtn").className = "none";
    document.getElementById("introbtn").className = "none";
    document.getElementById("infobtn").className = "red";
}

function resetCover(){
    document.getElementById("coverH1").innerText = "Pharos Trader Provides all Stock info";
    document.getElementById("coverP").innerText = "Designed specificly for you "
    document.getElementById("coverP").style.textAlign = "center";
    document.getElementById("coverP").style.fontSize = "30px";
    document.getElementById("indexbtn").className = "red";
    document.getElementById("introbtn").className = "none";
    document.getElementById("infobtn").className = "none";
}

function redHome(){
    document.getElementById("indexbtn").className = "red";
    document.getElementById("introbtn").className = "none";
    document.getElementById("infobtn").className = "none";
}


function redRegister(){
    document.getElementById("registerButton").className = "red";
    document.getElementById("mainHomebtn").className = "none";
    document.getElementById("stockHomebtn").className = "none";
    document.getElementById("loginButton").className = "none";
}

function redLogin(){
    document.getElementById("loginButton").className = "red";
    document.getElementById("stockHomebtn").className = "none";
    document.getElementById("registerButton").className = "none";
    document.getElementById("mainHomebtn").className = "none";
}

function redMain(){
    document.getElementById("mainHomebtn").className = "red";
    document.getElementById("loginButton").className = "none";
    document.getElementById("stockHomebtn").className = "none";
    document.getElementById("registerButton").className = "none";
}


// hardcode some user
userConstruct('user','user');
userConstruct('user2','user2');
userConstruct('admin','admin');











//functions to be done in phase 2

//gets info from search bar and do something
function searchBarSearch(){
    //get input content 
    const input = document.querySelector('#inputSearchBar').value;

    if (input == ""){
        document.getElementById("inputSearchBar").placeholder = "Empty input";
    }
    else{

        //find if iput content is a stock number, if so, search by calling function:     searchByStockID()


        //else
    }

    

}


//once the like button on stockpage is pressed
function likeBtnPressed(){

    //first check if user already liked this post before


    try{
            document.getElementById("likebtn").innerText = "Liked"
            document.getElementById("likebtn").id = "likedbtn";
        
    }
    catch(err){
            document.getElementById("likedbtn").innerText = "Like"
            document.getElementById("likedbtn").id = "likebtn";

    }
    //if not yet liked
    



    
}



