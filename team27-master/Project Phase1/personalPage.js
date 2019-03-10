"use strict";
const log=console.log;

// -------------Variable Defination------------------------------
window.pageTitle=document.querySelector('title').innerText;

let currentUser=undefined; //teh currentUser variable is used to store the information of current-logged-in user

let registeredUserList=[]; //store user object
let registeredUserIndexList={}; //store username and its array index in 'registeredUserList'

let stockList=[]; //store stock object
let stockIndexList={}; //store stockID and its array index in 'stockList'

let postList=[]; //store post object

let notifyList=[]; //store notify object

let orderList=[];

let userNum=0;
let stockNum=0;
let postNum=0;
let notifyNum=0;
let orderNum=0;


if(pageTitle==='Personal Page'){
	selectElementsPersonalPage();
}


// -------------Class Defination------------------------------

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
		this.currentPrice=174.33;
		this.lastPrice=174.33;
		this.change=0.1;
		this.changePercent=0.06;
		this.previousClose=174.23;
		this.open=173.71;
		this.marketCap=822.015;
		this.peRatio=14.38;
		this.post=[];
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
		postNum++;
		this.commentUser=[];
		this.commentContent=[];
		this.ReplyTo=[];
	}
}

class Notify{
	constructor(to,from,subject,content){
		this.to=to;
		this.from=from;
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


// -------------Backend Function Defination------------------------------
// -------------Element Defination------------------------------

function selectElementsPersonalPage(){
	window.addBalanceButton=document.querySelector('#addBalanceButton');
	window.changePasswordButtons=document.querySelectorAll('#changePasswordButton');
	window.buyStockButtons=document.querySelectorAll('.buyStockButton');
	window.sellStockButtons=document.querySelectorAll('.sellStockButton');
	window.removeStockButtons=document.querySelectorAll('.removeStockButton');
	window.deletePostButtons=document.querySelectorAll('.deletePostButton');
	window.homeButton=document.querySelector('#homeButton');
	window.homeButton=document.querySelector('#homeButton'); 
	// window.registerButton=document.querySelector('#registerButton');
	// window.loginButton=document.querySelector('#loginButton');
	// window.logoffButton=document.querySelector('#logoffButton');
	window.comments=document.querySelectorAll('.comment');
	window.replies=document.querySelectorAll('.reply');
	window.sendButton=document.querySelector('.sendButton');
	window.unfollowButtons=document.querySelectorAll('.unfollowButton');
	window.sendMailButtons=document.querySelectorAll('.sendMailButton');
	window.userNames=document.querySelectorAll('.userName');

}


function addEventPersonalPage(){
	// if(loginButton!==null){
	// 	loginButton.addEventListener('click',login);
	// }

	// if(logoffButton!==null){
	// 	logoffButton.addEventListener('click',logoff);
	// }

	// if(registerButton!==null){
	// 	registerButton.addEventListener('click',register);
	// }

	addBalanceButton.addEventListener('click',addBalance);
	
	changePasswordButton.addEventListener('click',changePassword);

	sendButton.addEventListener('click',sendMailToAdmin);

	for(let i=0; i<buyStockButtons.length; i++){
		let buyStockButton=buyStockButtons[i];
		buyStockButton.addEventListener('click',userBuyStock);
	}

	for(let i=0; i<sellStockButtons.length; i++){
		let sellStockButton=sellStockButtons[i];
		sellStockButton.addEventListener('click',userSellStock);
	}

	for(let i=0; i<buyStockButtons.length; i++){
		let removeStockButton=removeStockButtons[i];
		removeStockButton.addEventListener('click',userRemoveStock);
	}

	for(let i=0; i<deletePostButtons.length; i++){
		let deletePostButton=deletePostButtons[i];
		deletePostButton.addEventListener('click',userDeletePost);
	}

	for(let i=0; i<comments.length; i++){
		let comment=comments[i];
		comment.addEventListener('click',addComment);
	}

	for(let i=0; i<unfollowButtons.length; i++){
		let unfollowButton=unfollowButtons[i];
		unfollowButton.addEventListener('click',unfollow);
	}

	for(let i=0; i<sendMailButtons.length; i++){
		let sendMailButton=sendMailButtons[i];
		sendMailButton.addEventListener('click',sendMail);
	}

	for(let i=0; i<userNames.length; i++){
		let userName=userNames[i];
		userName.addEventListener('click',visitingOtherUserPage);
	}
	
}

function selectElementsAdminPage(){
	window.changePasswordButtons=document.querySelectorAll('#changePasswordButton');
	window.sendMailButtons=document.querySelectorAll('.sendMailButton');
	window.freezeAccountButtons=document.querySelectorAll('.freezeAccountButton');
	window.defreezeButtons=document.querySelectorAll('.defreezeButton');
	window.viewOrderButtons=document.querySelectorAll('.viewOrderButton');
	window.closeSectionButtons=document.querySelectorAll('.closeSectionButton');
	window.viewPostButtons=document.querySelectorAll('.viewPostButton');
	window.deletePostButtons=document.querySelectorAll('.deletePostButton');
	window.userNames=document.querySelectorAll('.userName');
}

function addEventAdminPage(){
	changePasswordButton.addEventListener('click',changePassword);

	for(let i=0; i<sendMailButtons.length; i++){
		let sendMailButton=sendMailButtons[i];
		sendMailButton.addEventListener('click',sendMail);
	}

	for(let i=0; i<freezeAccountButtons.length; i++){
		let freezeAccountButton=freezeAccountButtons[i];
		freezeAccountButton.addEventListener('click',freezeAccount);
	}

	for(let i=0; i<defreezeButtons.length; i++){
		let defreezeButton=defreezeButtons[i];
		defreezeButton.addEventListener('click',defreezeAccount);
	}

	for(let i=0; i<viewOrderButtons.length; i++){
		let viewOrderButton=viewOrderButtons[i];
		viewOrderButton.addEventListener('click',viewOrderDetail);
	}

	for(let i=0; i<closeSectionButtons.length; i++){
		let closeSectionButton=closeSectionButtons[i];
		closeSectionButton.addEventListener('click',closeSection);
	}

	for(let i=0; i<viewPostButtons.length; i++){
		let viewPostButton=viewPostButtons[i];
		viewPostButton.addEventListener('click',viewPostDetail);
	}

	for(let i=0; i<deletePostButtons.length; i++){
		let deletePostButton=deletePostButtons[i];
		deletePostButton.addEventListener('click',adminDeletePost);
	}

	for(let i=0; i<userNames.length; i++){
		let userName=userNames[i];
		userName.addEventListener('click',visitingOtherUserPage);
	}
}


// page update function-----------------------------------

function updatePage(){
	//The updatePage function will retrieve data from server to update the page. In phase1, it retrieves data from 
	//arrays or objects defined at the top
	if(pageTitle==='Personal Page' && currentUser.username!=='admin'){
		// updateHeader();
		updatePersonalInfo();
		updateMyPortfolio();
		updateMyPostReply(currentUser);
		updateNotify(currentUser);
		updateMyFollows();
	}
	else if(pageTitle==='Admin Page' && currentUser.username==='admin'){
		updateAdminHeader();
		updateUserManagement();
		updateNotify(currentUser);
	}
}

// regular user update--------------------------------------------------
function updateHeader(){
	if(currentUser!==undefined){
		homeButton.setAttribute('class','');

		registerButton.innerText=currentUser.username;
		registerButton.setAttribute('href','index.html');
		registerButton.setAttribute('class','red');
		registerButton.setAttribute('id','userPage');

		loginButton.innerText='Logoff';
		loginButton.setAttribute('href',''); //redirect to home page
		loginButton.setAttribute('id','logoffButton');
	}
}

function updatePersonalInfo(){
	let userTypeHeader=document.querySelector('#userTypeHeader');
	userTypeHeader.innerText=currentUser.level+' user: ';

	let userNameHeader=document.querySelector('#userNameHeader');
	userNameHeader.innerText=currentUser.username;

	let passwordDisplay=document.querySelector('#passwordDisplay');
	let displayPattern='';
	for(let i=0; i<currentUser.password.length; i++){
		displayPattern+='*';
	}
	passwordDisplay.innerText=displayPattern;

	let balanceDisplay=document.querySelector('#balanceDisplay');
	balanceDisplay.innerText=currentUser.balance.toFixed(2);

	let numFollowDisplay=document.querySelector('#numFollowDisplay');
	numFollowDisplay.innerText=currentUser.follow.length;

	let numFollowerDisplay=document.querySelector('#numFollowerDisplay');
	numFollowerDisplay.innerText=currentUser.follower.length;
}

function updateMyPortfolio(){
	let block=document.querySelectorAll('.block')[1];
	clearChildElements(block,'My Portfolio');
	if(Object.keys(currentUser.stockOwned).length===0){
		let content="NO STOCK IN YOUR PORTFOLIO";
		let nullMessageContainer=createNullMessage(content);
		block.appendChild(nullMessageContainer);
	}
	else{
		let ownedStockNum=Object.keys(currentUser.stockOwned).length;
		let table=createTable(ownedStockNum,5);
		let thead=table.children[0];
		let th1=thead.children[0];
		th1.innerText='Company';
		let th2=thead.children[1];
		th2.innerText='Stock ID';
		let th3=thead.children[2];
		th3.innerText='Last Price';
		let th4=thead.children[3];
		th4.innerText='Change';
		let th5=thead.children[4];
		th5.innerText='Owned Units';
		
		for(let i=0; i<ownedStockNum; i++){
			let tr=table.children[i+1];
			let stockIDList=Object.keys(currentUser.stockOwned);
			let stockID=stockIDList[i];
			let stockUnits=currentUser.stockOwned[stockID];
			let stock=stockList[stockIndexList[stockID]];
			for(let j=0; j<5; j++){
				let td=tr.children[j];
				switch(j){
					case 0:
						td.innerHTML="<span class='cellText'>"+stock.company+"</span>";
						break;
					case 1:
						td.innerHTML="<span class='hashTag' class='cellText'>"+stock.id+"</span>";
						break;
					case 2:
						td.innerHTML="<span class='cellText'>"+stock.lastPrice+"</span>";
						break;
					case 3:
						td.innerHTML="<span class='cellText'>"+stock.change+"</span>";
						break;
					case 4:
						td.innerHTML="<span class='cellText'>"+stockUnits+"</span>";
						let button1=document.createElement('button');
						button1.setAttribute('type','button');
						button1.setAttribute('class','buyStockButton');
						button1.innerText='buy';

						let button2=document.createElement('button');
						button2.setAttribute('type','button');
						button2.setAttribute('class','sellStockButton');
						button2.innerText='sell';

						let button3=document.createElement('button');
						button3.setAttribute('type','button');
						button3.setAttribute('class','removeStockButton');
						button3.innerText='remove';

						td.appendChild(button1);
						td.appendChild(button2);
						td.appendChild(button3);
						break;
				}
			}

		}
		
		block.appendChild(table);
	}
}

function updateMyPostReply(userObj){
	if(userObj===currentUser){
		var block=document.querySelectorAll('.block')[2];
		clearChildElements(block,'My Posts & Replies');
	}
	else{
		var block=document.createElement('div');
		block.setAttribute('class','block');
	}

	if(userObj.post.length===0 && userObj.username!=='admin'){
		let nullMessage=createNullMessage("YOU CURRENTLY DON'T HAVE ANY POST");
		block.appendChild(nullMessage);
		return '';
	}
	else{
		let postCount=userObj.post.length;
		for(let i=0; i<postCount; i++){
			let post=userObj.post[i];
			var postContainer=document.createElement('div');
			postContainer.setAttribute('class','postContainer');
			
			block.appendChild(postContainer);

			let ul=document.createElement('ul');
			ul.setAttribute('class','whoPost');
			postContainer.appendChild(ul);

			let li1=document.createElement('li');
			li1.innerHTML="<img src='http://m.xiayiqu.com/uploads/allimg/150817/12_150817162124_1.jpg' class='profilePic' id='postPic'>";
			ul.appendChild(li1);

			let li2=document.createElement('li');
			let li2Content="<span class='userName'>"+post.who+"</span>";

			li2Content+=" posted under: <span class='hashTag'>"+post.underStock+"</span>";
			li2Content+="<br>";
			li2Content+="<span class='dateTime'>"+post.time+"</span>"
			li2.innerHTML=li2Content;
			ul.appendChild(li2);

			let postContent=document.createElement('div');
			postContent.setAttribute('class','postContent');
			postContainer.appendChild(postContent);

			let postContentText=post.content;
			postContentText+="<span><button class='deletePostButton'>delete</button></span>";
			postContent.innerHTML=postContentText;

			let commentCount=post.commentUser.length;

			if(commentCount!==0){
				let commentReply=document.createElement('div');
				commentReply.setAttribute('class','commentReply');
				postContainer.appendChild(commentReply);

				for(let i=0; i<commentCount; i++){

					let commentRegion=document.createElement('div');
					commentRegion.setAttribute('class','comment');
					commentRegion.innerHTML="<span class='userName'>"+post.commentUser[i]+"</span>"+" ";
					if(post.ReplyTo[i]!==''){
						commentRegion.innerHTML+="replied to <span class='userName'>"+post.ReplyTo[i]+"</span>"+" ";
					}
					commentRegion.innerHTML+="<span class='commentContent'>"+": "+post.commentContent[i]+"</span>";
					commentReply.appendChild(commentRegion);
				}
				
			}
		}
		return block;
	}

}

function updateNotify(userObj){
	if(userObj.username!=='admin'){
		var blocks=document.querySelectorAll('.block');
		var notifyContainer=blocks[3];
		clearChildElements(notifyContainer,'Notification');
	}
	else{
		var container=document.querySelector('.container');
		var notifyContainer=document.createElement('div');
		notifyContainer.setAttribute('class','block');
		container.appendChild(notifyContainer);

		let header=document.createElement('h2');
		header.setAttribute('class','secTitle');
		header.innerText='My Notification'
		notifyContainer.appendChild(header);
	}

	let notifyCount=userObj.notify.length;
	
	if(notifyCount===0){
		let nullMessageContainer=createNullMessage("YOU CURRENTLY DON'T HAVE Notification");
		notifyContainer.appendChild(nullMessageContainer);
	}
	else{
		for(let i=notifyCount-1; i>=0; i--){
			let notify=userObj.notify[i];
			let postContainer=document.createElement('div');
			postContainer.setAttribute('class','postContainer');
			notifyContainer.appendChild(postContainer);

			let post=document.createElement('div');
			post.setAttribute('class','post');
			postContainer.appendChild(post);

			let ul=document.createElement('ul');
			ul.setAttribute('class','whoPost');
			postContainer.appendChild(ul);

			let li1=document.createElement('li');
			li1.innerHTML="<img src='http://www.vstou.com/upload/image/261/201601/1453353996921537.jpg' class='profilePic' id='postPic'>";
			ul.appendChild(li1);

			let li2=document.createElement('li');
			let li2Content="<span class='userName'>"+notify.from+"</span>"+"<br>";

			li2Content+="<span class='dateTime'>"+notify.time+"</span>"
			li2.innerHTML=li2Content;
			ul.appendChild(li2);

			let subject=document.createElement('div');
			subject.setAttribute('class','subject');
			subject.innerHTML="Subject: <span class='subjectContent'>"+notify.subject+"</span>";
			postContainer.appendChild(subject);

			let newLineBreaker=document.createElement('br');
			postContainer.appendChild(newLineBreaker);

			let mailBody=document.createElement('mailBody');
			mailBody.innerText=notify.content;
			postContainer.appendChild(mailBody);

		}
	}
	
	if(userObj.username!=='admin'){
		let postContainer=document.createElement('div');
		postContainer.setAttribute('class','mailContainer');
		notifyContainer.appendChild(postContainer);

		let header=document.createElement('span');
		header.setAttribute('class','mailHeader');
		header.innerText='Send a mail to admin';
		postContainer.appendChild(header);

		let sendButton=document.createElement('button');
		sendButton.setAttribute('class','sendButton');
		sendButton.innerText='send mail';
		postContainer.appendChild(sendButton);

		let bewLineBreaker=document.createElement('br');
		postContainer.appendChild(bewLineBreaker);

		let subjectTextBox=document.createElement('input');
		subjectTextBox.setAttribute('type','text');
		subjectTextBox.setAttribute('class','subjectTextBox');
		subjectTextBox.setAttribute('placeholder','subject');
		postContainer.appendChild(subjectTextBox);

		let contentTextBox=document.createElement('textarea');
		contentTextBox.setAttribute('class','contentTextBox');
		contentTextBox.setAttribute('placeholder','mail content');
		postContainer.appendChild(contentTextBox);
	}
}

function updateMyFollows(){
	let follow=currentUser.follow;
	let followCount=follow.length;
	let blocks=document.querySelectorAll('.block');
	let block=blocks[4];
	clearChildElements(block,'My Follows');
	let table=createTable(followCount,3);
	block.appendChild(table);

	let thead=table.children[0];
	let th1=thead.children[0];
	th1.innerText='User Name';
	let th2=thead.children[1];
	th2.innerText='User Type';
	let th3=thead.children[2];
	th3.innerText='Manage';
	

	for(let i=0; i<followCount; i++){
		let followUsername=currentUser.follow[i];
		let followUser=registeredUserList[registeredUserIndexList[followUsername]];
		let row=table.children[i+1];
		let td1=row.children[0];
		td1.innerHTML="<span class='userName'>"+followUser.username+"</span>";

		let td2=row.children[1];
		td2.innerText=followUser.level;

		let td3=row.children[2];
		td3.innerHTML="<button type='button' class='unfollowButton'>Unfollow</button>";
		td3.innerHTML+="<button type='button' class='sendMailButton'>Send Mail</button>";

		if(followUser.username==='admin'){
			let unfollowButton=document.querySelector('.unfollowButton');
			unfollowButton.setAttribute('disabled','');
		}
	}
}


// admin update functions--------------------------------------------
function updateAdminHeader(){
	let passwordDisplay=document.querySelector('#passwordDisplay');
	let displayPattern='';
	for(let i=0; i<currentUser.password.length; i++){
		displayPattern+='*';
	}
	passwordDisplay.innerText=displayPattern;
	let numFollowDisplay=document.querySelector('#numFollowDisplay');
	numFollowDisplay.innerText=currentUser.follow.length;

	let numFollowerDisplay=document.querySelector('#numFollowerDisplay');
	numFollowerDisplay.innerText=currentUser.follower.length;

}

function updateUserManagement(){

	let targetUsers=currentUser.follow;
	let userCount=currentUser.follow.length;
	let blocks=document.querySelectorAll('.block');
	let block=blocks[1];
	let originalTable=block.children[1];
	block.removeChild(originalTable);

	if(userCount===0){
		let nullMessage=createNullMessage('NO USER AT PRESENT');
		block.appendChild(nullMessage);
	}
	else{
		let table=createTable(userCount,4);
		block.appendChild(table);
		let thead=table.children[0];
		let th1=thead.children[0];
		let th2=thead.children[1];
		let th3=thead.children[2];
		let th4=thead.children[3];

		th1.innerText='Account Username';
		th2.innerText='Account Status';
		th3.innerText='Order Number';
		th4.innerText='Post Number';

		for(let i=0; i<userCount; i++){
			let targetUsername=targetUsers[i];
			let targetUser=registeredUserList[registeredUserIndexList[targetUsername]];
			let row=table.children[i+1];
			row.children[0].innerHTML="<span class='userName' id='normalUsername'>"+targetUser.username+"</span>";
			row.children[0].innerHTML+="<button class='sendMailButton'>Send Mail</button>";

			row.children[1].innerHTML="<span class='cellText'>"+targetUser.status+"</span>";
			row.children[1].innerHTML+="<button class='freezeAccountButton'>Freeze Account</button>";

			row.children[2].innerHTML="<span class='cellText'>"+targetUser.order.length+"</span>";
			row.children[2].innerHTML+="<button class='viewOrderButton'>View Detail</button>";

			row.children[3].innerHTML="<span class='userPostCount'>"+targetUser.post.length+"</span>";
			row.children[3].innerHTML+="<button class='viewPostButton'>View Detail</button>";
		}

		selectElementsAdminPage();
		addEventAdminPage();
	}
}


// constructor update--------------------------------------------
function userConstruct(username,password){
	if(username in registeredUserIndexList===true){
		log('user already exist');
	}
	else{
		registeredUserIndexList[username]=userNum;
		userNum++;
		let newUser=new User(username,password);
		registeredUserList.push(newUser);
		return newUser;
	}
}

function stockConstruct(id){
	if(id in stockIndexList===true){
		log('stock already exist');
	}
	else{
		stockIndexList[id]=stockNum;
		stockNum++;
		stockList.push(new Stock(id));
	}
}

function postConstructor(who,underStock,content){
	let userID=registeredUserIndexList[who];
	let user=registeredUserList[userID];
	let newPost = new Post(who,underStock,content);
	let stock=stockList[stockIndexList[underStock]];
	postList.push(newPost);
	user.post.push(newPost);
	stock.post.push(newPost);
}

function commentConstructor(postId,commentUser,commentContent,commentReplyTo){
	let post=postList[postId];
	post.commentUser.push(commentUser);
	post.commentContent.push(commentContent);
	if(commentReplyTo===undefined){
		post.ReplyTo.push('');
	}
	else{
		post.ReplyTo.push(commentReplyTo);
	}

}

function notifyConstructor(to,from,subject,content){
	let newNotify=new Notify(to,from,subject,content);
	notifyList.push(newNotify);
	let user=registeredUserList[registeredUserIndexList[to]];
	user.notify.push(newNotify);
}

function orderConstructor(username,stockId,unit,type){
	let newOrder=new Order(username,stockId,unit,type);
	orderList.push(newOrder);
	let user=registeredUserList[registeredUserIndexList[username]];
	user.order.push(newOrder);
	return newOrder;
}


function userLogin(username,password){
	//This function is used here to create fake users for testing purpose
	//In home and stock pages, this function is used for user registration and logging in

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


function popUp(title,content,type,boxNum,placeHolder){
	//This function will create a popUp page
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

function createNullMessage(content){
	let messageContainer=document.createElement('div');
	messageContainer.setAttribute('class','nullMessage');
	messageContainer.innerText=content;
	return messageContainer;
}

function createTable(rowNum,colNum){
	let table=document.createElement('table');
	let thead=document.createElement('thead');
	
	for(let j=0; j<colNum; j++){
		let th=document.createElement('th');
		thead.appendChild(th);
	}

	table.appendChild(thead);

	for(let i=0; i<rowNum; i++){
		let tr=document.createElement('tr');
		for(let j=0; j<colNum; j++){
			let td=document.createElement('td');
			tr.appendChild(td);
		}
		table.appendChild(tr);
	}

	return table;
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

function getChildIndex(parent,child){
	let childrenCount=parent.children.length;
	for(let i=0; i<childrenCount; i++){
		let testChild=parent.children[i];
		if(testChild===child){
			return i;
		}
	}
}

// -------------Event Function Defination------------------------------

//The log-in, log-off, register functions will never be used at personal page, they can be used in home and personal page
// function login(e){
// 	e.preventDefault();
// 	let choice=popUp('Login','Please enter your username & password','text',2,['username','password']);
// 	let popUpPage=choice[0];
// 	let continueButton=choice[1];
// 	let cancelButton=choice[2];
// 	let popUpTextBoxs=document.querySelectorAll('.popUpTextBox');
// 	let usernameBox=popUpTextBoxs[0];
// 	let passwordBox=popUpTextBoxs[1];

// 	continueButton.onclick=function(){
// 		let username=usernameBox.value;
// 		let password=passwordBox.value;
// 		currentUser=userLogin(username,password);
// 		popUpPage.style.display='none';
// 		document.body.removeChild(popUpPage);

// 		if(currentUser!==undefined){
// 			updateHeader();
// 		}
// 	}

// 	cancelButton.onclick=function(){
// 		popUpPage.style.display='none';
// 		document.body.removeChild(popUpPage);
// 	}
// }

// function logoff(e){
// 	e.preventDefault();
// 	currentUser=undefined;
// 	window.location.replace('Mainpage.html');
// }

// function register(e){
// 	e.preventDefault();
// 	let choice=popUp('Register','Please enter your username & password','text',2,['username','password']);
// 	let popUpPage=choice[0];
// 	let continueButton=choice[1];
// 	let cancelButton=choice[2];
// 	let popUpTextBoxs=document.querySelectorAll('.popUpTextBox');
// 	let usernameBox=popUpTextBoxs[0];
// 	let passwordBox=popUpTextBoxs[1];

// 	continueButton.onclick=function(){
// 		let username=usernameBox.value;
// 		let password=passwordBox.value;
// 		let newUser=userConstruct(username,password);
// 		currentUser=newUser;
// 		popUpPage.style.display='none';
// 		document.body.removeChild(popUpPage);
// 		balanceDisplay.innerText=currentUser.balance.toFixed(2);

// 		if(currentUser!==undefined){
// 			updateHeader();
// 		}
// 	}

// 	cancelButton.onclick=function(){
// 		popUpPage.style.display='none';
// 		document.body.removeChild(popUpPage);
// 	}
// }

function addBalance(e){
	e.preventDefault();
	let choice=popUp('Add Your balance','Please enter how much you want to add to your account','number',1,['add balance']);
	let popUpPage=choice[0];
	let continueButton=choice[1];
	let cancelButton=choice[2];
	let balanceDisplay=document.querySelector('#balanceDisplay');

	continueButton.onclick=function(){
		let enterValue=document.querySelector('.popUpTextBox').value;
		currentUser.balance+=Number(enterValue);
		popUpPage.style.display='none';
		

		let notifyContent="Dear "+currentUser.username+":\n";
		notifyContent+="This is a confirmation of successfully adding $"+enterValue+" to your balance. ";
		notifyContent+="Your current balance is $"+currentUser.balance+".\n";
		notifyContent+="Thank you for your purchase!"+"\n";
		notifyContent+="Admin";
		notifyConstructor(currentUser.username,'admin','Balance Added Confirmation',notifyContent);

		document.body.removeChild(popUpPage);
		balanceDisplay.innerText=currentUser.balance.toFixed(2);

		updateNotify(currentUser);
		selectElementsPersonalPage();
		addEventPersonalPage();
		
	}

	cancelButton.onclick=function(){
		popUpPage.style.display='none';
		document.body.removeChild(popUpPage);
	}
}

function changePassword(e){
	e.preventDefault();
	let choice=popUp('Change Your Password','Please enter your new password at here','text',1,['new password']);
	let popUpPage=choice[0];
	let continueButton=choice[1];
	let cancelButton=choice[2];
	let passwordDisplay=document.querySelector('#passwordDisplay');

	continueButton.onclick=function(){
		let enterValue=document.querySelector('.popUpTextBox').value;
		currentUser.password=enterValue;
		popUpPage.style.display='none';
		document.body.removeChild(popUpPage);
		let pwDisplay='';
		for(let i=0; i<currentUser.password.length; i++){
			pwDisplay+='*';
		}
		passwordDisplay.innerText=pwDisplay;
	}

	cancelButton.onclick=function(){
		popUpPage.style.display='none';
		document.body.removeChild(popUpPage);
	}
}


function userBuyStock(e){
	e.preventDefault();
	let choice=popUp('Buy Stock','How many units would you like to purchase','number',1,['purchase unit']);
	let popUpPage=choice[0];
	let continueButton=choice[1];
	let cancelButton=choice[2];

	let row=e.target.parentElement.parentElement;
	let id=row.children[1].firstElementChild.innerText;
	let stockIndex=stockIndexList[id];
	let stock=stockList[stockIndex];
	let stockPrice=stock.currentPrice;
	let ownedUnits=row.children[4].children[0];
	let balanceDisplay=document.querySelector('#balanceDisplay');

	continueButton.onclick=function(){
		let enterValue=Number(document.querySelector('.popUpTextBox').value);
		let cost=stockPrice*enterValue;
		if(cost>currentUser.balance){
			alert('no enough money');
		}
		else if(currentUser.status==='frozen'){
			alert('Your account has been frozen, please contact admin');
			return;
		}
		else{
			currentUser.stockOwned[id]+=enterValue;
			currentUser.balance-=cost;
			popUpPage.style.display='none';
			document.body.removeChild(popUpPage);
			ownedUnits.innerText=currentUser.stockOwned[id];
			balanceDisplay.innerText=currentUser.balance.toFixed(2);
			let newOrder=orderConstructor(currentUser.username,stock.id,enterValue,'buy');

			let notifyContent="Dear "+currentUser.username+":\n";
			notifyContent+="This is a confirmation of successfully purchasing "+enterValue+" units of stock ";
			notifyContent+=stock.id+" to your account.\n";
			notifyContent+="You now have "+currentUser.stockOwned[stock.id]+" units of this stock.\n"
			notifyContent+="Your current balance is $"+currentUser.balance.toFixed(2)+".\n";
			notifyContent+="Thank you for your purchase!"+"\n";
			notifyContent+="Admin";
			notifyConstructor(currentUser.username,'admin','Order Confirmation (orderId '+newOrder.orderId+')',notifyContent);

			updateNotify(currentUser);
			selectElementsPersonalPage();
			addEventPersonalPage();

		}
	}

	cancelButton.onclick=function(){
		popUpPage.style.display='none';
		document.body.removeChild(popUpPage);
	}

}

function userSellStock(e){
	e.preventDefault();
	let choice=popUp('Sell Stock','How many units would you like to sell','number',1,['sell unit']);
	let popUpPage=choice[0];
	let continueButton=choice[1];
	let cancelButton=choice[2];

	let row=e.target.parentElement.parentElement;
	let id=row.children[1].firstElementChild.innerText;
	let stockIndex=stockIndexList[id];
	let stock=stockList[stockIndex];
	let stockPrice=stock.currentPrice;
	let ownedNumber=currentUser.stockOwned[id];
	let ownedUnits=row.children[4].children[0];
	let balanceDisplay=document.querySelector('#balanceDisplay');

	continueButton.onclick=function(){
		let enterValue=document.querySelector('.popUpTextBox').value;
		enterValue=Number(enterValue);

		if(ownedNumber<enterValue){
			alert('No enough stock');
		}
		else if(currentUser.status==='frozen'){
			alert('Your account has been frozen, please contact admin');
			return;
		}
		else{
			currentUser.stockOwned[id]-=enterValue;
			let revenue=enterValue*stockPrice;
			currentUser.balance+=revenue;
			ownedUnits.innerText=currentUser.stockOwned[id];
			balanceDisplay.innerText=currentUser.balance.toFixed(2);

			let newOrder=orderConstructor(currentUser.username,stock.id,enterValue,'sell');

			let notifyContent="Dear "+currentUser.username+":\n";
			notifyContent+="This is a confirmation of successfully selling "+enterValue+" units of stock ";
			notifyContent+=stock.id+" from your account.\n";
			notifyContent+="You now have "+currentUser.stockOwned[stock.id]+" units of this stock.\n"
			notifyContent+="Your current balance is $"+currentUser.balance.toFixed(2)+".\n";
			notifyContent+="Thank you for your trade!"+"\n";
			notifyContent+="Admin";
			notifyConstructor(currentUser.username,'admin','Order Confirmation (orderId '+newOrder.orderId+')',notifyContent);

			updateNotify(currentUser);
			selectElementsPersonalPage();
			addEventPersonalPage();

			popUpPage.style.display='none';
			document.body.removeChild(popUpPage);
		}
	}

	cancelButton.onclick=function(){
		popUpPage.style.display='none';
		document.body.removeChild(popUpPage);
	}

}


function userRemoveStock(e){
	let row=e.target.parentElement.parentElement;
	let id=row.children[1].firstElementChild.innerText;
	let ownedNumber=currentUser.stockOwned[id];
	let stockIndex=stockIndexList[id];
	let stock=stockList[stockIndex];
	let stockPrice=stock.currentPrice;
	let balanceDisplay=document.querySelector('#balanceDisplay');

	if(ownedNumber>0){
		let popUpContent='You now own '+ownedNumber+' '+id+' unit stock. If you choose to remove them from portfolio, you need to sell them at first.';
		popUpContent+='\nClick continue if you would like to sell all of them.';
		let choice=popUp('Remove Alert',popUpContent,'none',0,[]);
		let popUpPage=choice[0];
		let continueButton=choice[1];
		let cancelButton=choice[2];


		continueButton.onclick=function(){
			if(currentUser.status==='frozen'){
				alert('Your account has been frozen, please contact admin');
				return;
			}
			delete currentUser.stockOwned[id];
			let revenue=ownedNumber*stockPrice;
			currentUser.balance+=revenue;
			balanceDisplay.innerText=currentUser.balance.toFixed(2);

			let newOrder=orderConstructor(currentUser.username,stock.id,ownedNumber,'sell');

			let notifyContent="Dear "+currentUser.username+":\n";
			notifyContent+="This is a confirmation of successfully selling and removing "+ownedNumber+" units of stock ";
			notifyContent+=stock.id+" from your account.\n";
			notifyContent+="Your current balance is $"+currentUser.balance.toFixed(2)+".\n";
			notifyContent+="Thank you for your trade!"+"\n";
			notifyContent+="Admin";
			notifyConstructor(currentUser.username,'admin','Order Confirmation (orderId '+newOrder.orderId+')',notifyContent);

			updateMyPortfolio();
			updateNotify(currentUser);
			selectElementsPersonalPage();
			addEventPersonalPage();
			popUpPage.style.display='none';
			document.body.removeChild(popUpPage);
		}
		
		cancelButton.onclick=function(){
			popUpPage.style.display='none';
			document.body.removeChild(popUpPage);
		}
	}
	else{
		delete currentUser.stockOwned[id];
		updateMyPortfolio();
		selectElementsPersonalPage();
		addEventPersonalPage();
	}
}

function userDeletePost(e){
	e.preventDefault();
	let postContainer=e.target.parentElement.parentElement.parentElement;
	let block=postContainer.parentElement;
	let postIndex=getChildIndex(block,postContainer)-1;
	let postInUser=currentUser.post[postIndex];
	
	let stockIds=document.querySelectorAll('.hashTag');
	let stockId=stockIds[postIndex].innerText;
	let stock=stockList[stockIndexList[stockId]];

	for(let i=0; i<stock.post.length; i++){
		if(stock.post[i]===postInUser){
			stock.post.splice(i,1);
			break;
		}
	}

	for(let i=0; i<postList.length; i++){
		if(postList[i]===postInUser){
			postList.splice(i,1);
			break;
		}
	}
	
	currentUser.post.splice(postIndex, 1);

	updateMyPostReply(currentUser);
	selectElementsPersonalPage();
	addEventPersonalPage();
}

function addComment(e){
	if(e.target.classList.contains('comment')){
		let comment=e.target;
		let targetUser=comment.children[0].innerText;
		let choice=popUp('Make your comment','Please enter your comment below','textarea',1,'comment');
		let popUpPage=choice[0];
		let continueButton=choice[1];
		let cancelButton=choice[2];

		continueButton.onclick=function(){
			let enterValue=document.querySelector('.popUpTextBox').value;
			if(targetUser!==currentUser.username){
				let postContainer=e.target.parentElement.parentElement;
				let block=postContainer.parentElement;
				let postIndex=getChildIndex(block,postContainer)-1;
				let postInUser=currentUser.post[postIndex];
				postInUser.commentUser.push(currentUser.username);
				postInUser.commentContent.push(enterValue);
				postInUser.ReplyTo.push(targetUser);

			}
			else if(currentUser.status==='frozen'){
				alert('Your account has been frozen, please contact admin');
				return;
			}
			else{
				let postContainer=e.target.parentElement.parentElement;
				let block=postContainer.parentElement;
				let postIndex=getChildIndex(block,postContainer)-1;
				let postInUser=currentUser.post[postIndex];
				postInUser.commentUser.push(currentUser.username);
				postInUser.commentContent.push(enterValue);
				postInUser.ReplyTo.push('');
	
				let stockIds=document.querySelectorAll('.hashTag');
				let stockId=stockIds[postIndex].innerText;
				let stock=stockList[stockIndexList[stockId]];

			}
			updateMyPostReply(currentUser);
			selectElementsPersonalPage();
			addEventPersonalPage();
			popUpPage.style.display='none';
			document.body.removeChild(popUpPage);
		}
		
		cancelButton.onclick=function(){
			popUpPage.style.display='none';
			document.body.removeChild(popUpPage);
		}
	}
	
}

function sendMailToAdmin(e){
	let subjectTextBox=document.querySelector('.subjectTextBox');
	let contentTextBox=document.querySelector('.contentTextBox');

	let subjectText=subjectTextBox.value;
	let contentText=contentTextBox.value;
	if(subjectText===''||contentText===''){
		alert('please enter your subject and mail content');
	}
	else{
		notifyConstructor('admin',currentUser.username,subjectText,contentText);
		subjectTextBox.value='';
		contentTextBox.value='';
		alert('your mail has been sent');
	}
}

function unfollow(e){
	let row=e.target.parentElements.parentElement;
	let followUsername=row.children[0].innerText;
	let followUserIndex=registeredUserIndexList[followUsername];
	let followUser=registeredUserList[followUserIndex];

	if(followUsername==='admin'){
		alert('unable to unfollow admin');
	}
	else{
		for(let i=0; i<currentUser.follow.length; i++){
			if(currentUser.follow[i]===followUsername){
				currentUser.follow.splice(i,1);
				break;
			}
		}

		for(let i=0; i<followUser.follower.length; i++){
			if(followUser.follower[i]===currentUser.username){
				followUser.follower.splice(i,1);
				break;
			}
		}
	}


	updateMyFollows();
	selectElementsPersonalPage();
	addEventPersonalPage();
}


function sendMail(e){
	let row=e.target.parentElement.parentElement;

	if(currentUser.username==='admin'){
		let span=row.children[0].children[0];
		var followUsername=span.innerText;
	}
	else{
		var followUsername=row.children[0].innerText;
	}

	let followUser=registeredUserList[registeredUserIndexList[followUsername]];

	let choice=popUp('Send Mail','Please enter the email subject and content below','textarea',2,['subject','content']);
	let popUpPage=choice[0];
	let continueButton=choice[1];
	let cancelButton=choice[2];

	continueButton.onclick=function(){
			let textBoxes=document.querySelectorAll('.popUpTextBox');
			let subjectTextBox=textBoxes[0];
			let contentTextBox=textBoxes[1];

			let subjectText=subjectTextBox.value;
			let contentText=contentTextBox.value;

			if(subjectText===''||contentText===''){
				alert('please enter your subject and mail content');
			}

			else{
				notifyConstructor(followUsername,currentUser.username,subjectText,contentText);
				subjectTextBox.value='';
				contentTextBox.value='';
				alert('your mail has been sent');
			}
			popUpPage.style.display='none';
			document.body.removeChild(popUpPage);
	}
		
	cancelButton.onclick=function(){
			popUpPage.style.display='none';
			document.body.removeChild(popUpPage);
	}
}

function visitingOtherUserPage(e){
	//This function is called when a user clicked any other username. 
	let visitedUsername=e.target.innerText;
	let visitedUser=registeredUserList[registeredUserIndexList[visitedUsername]];
	if(visitedUsername==='admin' && currentUser.username!=='admin'){
		alert("You don't have permission to vist admin's page");
	}
	else if(visitedUsername==='admin' && currentUser.username==='admin'){
		window.location.href ='adminPage.html';
	}
	else if(visitedUsername!==currentUser.username){
		let body=document.querySelector('body');
		let originalContainer=document.querySelector('.container');
		body.removeChild(originalContainer);

		let originalFooter=document.querySelector('.footer');
		body.removeChild(originalFooter);

		let newContainer=document.createElement('div');
		newContainer.setAttribute('class','container');
		body.appendChild(newContainer);

		// update visited profile informatin-----------------------------
		let block1=document.createElement('div');
		block1.setAttribute('class','block');
		newContainer.appendChild(block1);

		let ul11=document.createElement('ul');
		ul11.setAttribute('id','userProileHeader');
		block1.appendChild(ul11);

		let li11=document.createElement('li');
		li11.innerHTML="<span class='secTitle'><span id='userTypeHeader'>Normal User: </span>"+"<span id='userNameHeader'>"+visitedUsername+"</span></span></li>";
		ul11.appendChild(li11);

		let li12=document.createElement('li');
		//load user image from server
		li12.innerHTML="<img src='https://wx3.sinaimg.cn/thumb180/0066S10Qly1fhytdxc9xjj30id0idx60.jpg' class='profilePic' id='headerPic'>";
		ul11.appendChild(li12);

		let profileTable=createTable(1,3);
		block1.appendChild(profileTable);
		let profileTableHeader=profileTable.children[0];

		profileTableHeader.children[0].innerText='Follow';
		profileTableHeader.children[1].innerText='Follower';
		profileTableHeader.children[2].innerText='Manage';
		let profileTableRow=profileTable.children[1];
		profileTableRow.children[0].innerHTML="<span class='cellText' id='numFollowDisplay'>"+visitedUser.follow.length+"</span>";
		profileTableRow.children[1].innerHTML="<span class='cellText' id='numFollowDisplay'>"+visitedUser.follower.length+"</span>";
		profileTableRow.children[2].innerHTML="<span class='cellText'><button id='followButton'>Follow</button></span>";
		let followButton=document.querySelector('#followButton');
		let index=currentUser.follow.indexOf(visitedUser.username);
		if(index!==-1){
			followButton.setAttribute('disabled','');
		}
		followButton.addEventListener('click',function(e){
			visitedUser.follower.push(currentUser.username);
			currentUser.follow.push(visitedUser.username);
			alert('You have followed this user');
			followButton.setAttribute('disabled',' ');
		});

		// update portfolio informatin-----------------------------
		let block2=document.createElement('div');
		block2.setAttribute('class','block');
		newContainer.appendChild(block2);

		let portfolioH2=document.createElement('h2');
		portfolioH2.setAttribute('class','secTitle');
		portfolioH2.innerText=visitedUser.username+"'s Portfolio";
		block2.appendChild(portfolioH2);
		let visitedUserStock=Object.keys(visitedUser.stockOwned);
		let visitedUserStockCount=visitedUserStock.length;

		if(visitedUserStockCount===0){
			let portfolioNullMessageContainer=createNullMessage("THIS USER DOESN'T HAVE STOCK IN HIS/HER PORTFOLIO");
			block2.appendChild(portfolioNullMessageContainer);
		}
		else{
			let portfolioTable=createTable(visitedUserStockCount,4);
			block2.appendChild(portfolioTable);
			let portfolioTableHeader=portfolioTable.children[0];
			portfolioTableHeader.children[0].innerText='Company';
			portfolioTableHeader.children[1].innerText='Stock ID';
			portfolioTableHeader.children[2].innerText='Last Price';
			portfolioTableHeader.children[3].innerText='Change';

			for(let i=0; i<visitedUserStockCount; i++){
				let stockIndex=stockIndexList[visitedUserStock[i]];
				let stock=stockList[stockIndex];
				let portfolioTableRow=portfolioTable.children[i+1];
				portfolioTableRow.children[0].innerHTML="<span class='cellText'>"+stock.company+"</span>";
				portfolioTableRow.children[1].innerHTML="<span class='cellText'>"+stock.id+"</span>";
				portfolioTableRow.children[2].innerHTML="<span class='cellText'>"+stock.currentPrice+"</span>";
				portfolioTableRow.children[3].innerHTML="<span class='cellText'>"+stock.change+"</span>";
			}
		}

		// update profile informatin-----------------------------
		let block3=document.createElement('div');
		block3.setAttribute('class','block');
		newContainer.appendChild(block3);

		if(visitedUser.post.length===0){
			let nullMessage=createNullMessage("YOU CURRENTLY DON'T HAVE ANY POST");
			block3.appendChild(nullMessage);
		}
		else{
			
			let postCount=visitedUser.post.length;
			for(let i=0; i<postCount; i++){
				let post=visitedUser.post[i];

				let postH2=document.createElement('h2');
				postH2.innerHTML="<h2 class='secTitle'>"+visitedUser.username+"'s Posts & Replies"+"</h2>";
				block3.appendChild(postH2);

				let postContainer=document.createElement('div');
				postContainer.setAttribute('class','postContainer');
				block3.appendChild(postContainer);

				let ul=document.createElement('ul');
				ul.setAttribute('class','whoPost');
				postContainer.appendChild(ul);

				let li1=document.createElement('li');
				li1.innerHTML="<img src='https://wx3.sinaimg.cn/thumb180/0066S10Qly1fhytdxc9xjj30id0idx60.jpg' class='profilePic' id='postPic'>";
				ul.appendChild(li1);

				let li2=document.createElement('li');
				let li2Content="<span class='userName'>"+post.who+"</span>";

				li2Content+=" posted under: <span class='hashTag'>"+post.underStock+"</span>";
				li2Content+="<br>";
				li2Content+="<span class='dateTime'>"+post.time+"</span>"
				li2.innerHTML=li2Content;
				ul.appendChild(li2);

				let postContent=document.createElement('div');
				postContent.setAttribute('class','postContent');
				postContainer.appendChild(postContent);

				let postContentText=post.content;
				postContent.innerHTML=postContentText;

				let commentCount=post.commentUser.length;

				if(commentCount!==0){
					let commentReply=document.createElement('div');
					commentReply.setAttribute('class','commentReply');
					postContainer.appendChild(commentReply);

					for(let i=0; i<commentCount; i++){

						let commentRegion=document.createElement('div');
						commentRegion.setAttribute('class','comment');
						commentRegion.innerHTML="<span class='userName'>"+post.commentUser[i]+"</span>"+" ";
						if(post.ReplyTo[i]!==''){
							commentRegion.innerHTML+="replied to <span class='userName'>"+post.ReplyTo[i]+"</span>"+" ";
						}
						commentRegion.innerHTML+="<span class='commentContent'>"+": "+post.commentContent[i]+"</span>";
						commentReply.appendChild(commentRegion);
					}
				
				}
			}
		}

		// update follow informatin-----------------------------
		let follow=visitedUser.follow;
		let followCount=follow.length;
		let block4=document.createElement('div');
		block4.setAttribute('class','block');
		newContainer.appendChild(block4);

		let followH2=document.createElement('h2');
		followH2.setAttribute('class','secTitle');
		followH2.innerText=visitedUser.username+"'s Follows";
		block4.appendChild(followH2);

		let table=createTable(followCount,3);
		block4.appendChild(table);

		let thead=table.children[0];
		let th1=thead.children[0];
		th1.innerText='User Name';
		let th2=thead.children[1];
		th2.innerText='User Type';
	

		for(let i=0; i<followCount; i++){
			let followUsername=currentUser.follow[i];
			let followUser=registeredUserList[registeredUserIndexList[followUsername]];
			let row=table.children[i+1];
			let td1=row.children[0];
			td1.innerHTML="<span class='userName'>"+followUser.username+"</span>";

			let td2=row.children[1];
			td2.innerText=followUser.level;
		}

		let newFooter=document.createElement('div');
		newFooter.setAttribute('class','footer');
		let newFooterContainer=document.createElement('p');
		newFooterContainer.innerText='copyright @Pharos Stock 2019';
		newFooter.appendChild(newFooterContainer);
		body.appendChild(newFooter);
		

	}
	let userNamesInternal=document.querySelectorAll('.userName');
	for(let i=0; i<userNamesInternal.length; i++){
		let userNameInternal=userNamesInternal[i];
		userNameInternal.addEventListener('click',visitingOtherUserPage);
	}
}

function freezeAccount(e){
	let freezeButton=e.target;
	let row=e.target.parentElement.parentElement;
	let span=row.children[0].children[0];
	let targetUsername=span.innerText;
	let user=registeredUserList[registeredUserIndexList[targetUsername]];
	user.status='frozen';
	notifyConstructor(targetUsername,'admin','Your Account Has Been Frozen','Your account is frozen, please contact admin');
	alert('This account has been frozen');

	let parentElement=e.target.parentElement;
	parentElement.removeChild(e.target);

	let defreezeButton=document.createElement('button');
	defreezeButton.setAttribute('class','defreezeButton');
	defreezeButton.innerText='Defreeze';
	parentElement.appendChild(defreezeButton);
	selectElementsAdminPage();
	addEventAdminPage();

}

function defreezeAccount(e){
	let defreezeButton=e.target;
	let row=e.target.parentElement.parentElement;
	let span=row.children[0].children[0];
	let targetUsername=span.innerText;
	let user=registeredUserList[registeredUserIndexList[targetUsername]];
	user.status='legal';
	notifyConstructor(targetUsername,'admin','Your Account Has Been defrozen','Your account is defrozen, you can use this account as usual.');
	alert('This account has been defrozen');

	let parentElement=e.target.parentElement;
	parentElement.removeChild(e.target);

	let freezeButton=document.createElement('button');
	freezeButton.setAttribute('class','freezeAccountButton');
	freezeButton.innerText='Freeze Account';
	parentElement.appendChild(freezeButton);
	selectElementsAdminPage();
	addEventAdminPage();
}

function closeSection(e){
	let block=e.target.parentElement.parentElement;
	let container=block.parentElement;
	container.removeChild(block);
}

function viewOrderDetail(e){
	let row=e.target.parentElement.parentElement;
	let span=row.children[0].children[0];
	let targetUsername=span.innerText;
	let targetUser=registeredUserList[registeredUserIndexList[targetUsername]];

	let container=document.querySelector('.container');

	let newBlock=document.createElement('div');
	newBlock.setAttribute('class','block');
	container.appendChild(newBlock);

	let h2=document.createElement('h2');
	h2.setAttribute('class','secTitle');
	h2.innerHTML=targetUser.username+"'s Order Information"
	newBlock.appendChild(h2);

	let orders=targetUser.order;

	if(orders.length===0){
		let nullmessage=createNullMessage("THIS USER CURRENTLY DON'T HAVE ANY ORDER");
	}

	let orderTable=createTable(orders.length,5);
	orderTable.setAttribute('class','orderTable');
	newBlock.appendChild(orderTable);
	let thead=orderTable.children[0];
	let th1=thead.children[0];
	let th2=thead.children[1];
	let th3=thead.children[2];
	let th4=thead.children[3];
	let th5=thead.children[4];

	th1.innerText='Stock Id';
	th2.innerText='Type';
	th3.innerText='Trade Unit';
	th4.innerText='Time';
	th5.innerText='Order Id';

	for(let i=0; i<orders.length; i++){
		let order=orders[i];
		let row=orderTable.children[i+1];
		row.children[0].innerText=order.stockId;
		row.children[1].innerText=order.type;
		row.children[2].innerText=order.unit;
		row.children[3].innerText=order.time;
		row.children[4].innerText=order.orderId;
	}

	let closeOrderButtonContainer=document.createElement('div');
	closeOrderButtonContainer.setAttribute('class','closeOrderButtonContainer');
	newBlock.appendChild(closeOrderButtonContainer);

	let closeOrderButton=document.createElement('button');
	closeOrderButton.setAttribute('class','closeSectionButton');
	closeOrderButtonContainer.appendChild(closeOrderButton);
	closeOrderButton.innerText='close order informatin';

	selectElementsAdminPage();
	addEventAdminPage();
}

function viewPostDetail(e){
	let row=e.target.parentElement.parentElement;
	let span=row.children[0].children[0];
	let targetUsername=span.innerText;
	let targetUser=registeredUserList[registeredUserIndexList[targetUsername]];

	let container=document.querySelector('.container');

	let newBlock=document.createElement('div');
	newBlock.setAttribute('class','block');
	container.appendChild(newBlock);

	let h2=document.createElement('h2');
	h2.setAttribute('class','secTitle');
	h2.innerHTML=targetUser.username+"'s Post Information"
	newBlock.appendChild(h2);

	let postInformation=updateMyPostReply(targetUser);
	if(postInformation!==''){
		postInformation.setAttribute('class','postInformation');
		newBlock.appendChild(postInformation);
	}

	let closePostButtonContainer=document.createElement('div');
	closePostButtonContainer.setAttribute('class','closeOrderButtonContainer');
	newBlock.appendChild(closePostButtonContainer);

	let closePostButton=document.createElement('button');
	closePostButton.setAttribute('class','closeSectionButton');
	closePostButtonContainer.appendChild(closePostButton);
	closePostButton.innerText='close Post informatin';

	selectElementsAdminPage();
	addEventAdminPage();
}

function adminDeletePost(e){
	e.preventDefault();
	let postContainer=e.target.parentElement.parentElement.parentElement;
	let block=postContainer.parentElement;
	let target=postContainer.children[0].children[1].children[0];
	let targetUsername=target.innerText;
	let targetUserIndex=registeredUserIndexList[targetUsername];
	let targetUser=registeredUserList[targetUserIndex];
	let postIndex=getChildIndex(block,postContainer);
	let postInUser=targetUser.post[postIndex];
	
	let stockIds=document.querySelectorAll('.hashTag');
	let stockId=stockIds[postIndex].innerText;
	let stock=stockList[stockIndexList[stockId]];

	for(let i=0; i<stock.post.length; i++){
		if(stock.post[i]===postInUser){
			stock.post.splice(i,1);
			break;
		}
	}

	for(let i=0; i<postList.length; i++){
		if(postList[i]===postInUser){
			postList.splice(i,1);
			break;
		}
	}
	
	targetUser.post.splice(postIndex, 1);
	let targetTexts=document.querySelectorAll('.userPostCount');
	let normalUsernames=document.querySelectorAll('#normalUsername');
	log(targetTexts);


	for(let i=0; i<normalUsernames.length; i++){
		let normalUsername=normalUsernames[i].innerText;
		log(normalUsername);
		if(targetUsername===normalUsername){
			let targetText=targetTexts[i];
			log(targetText);
			targetText.innerText=targetUser.post.length;
		}
	}

	
	block.removeChild(postContainer);
	selectElementsAdminPage();
	addEventAdminPage();

}

// -------------Test Run------------------------------
//Create some fake users, posts, stocks etc. for testing
userConstruct('user','user');
userConstruct('user2','user2');
userConstruct('admin','admin');
stockConstruct('AAPL');
stockConstruct('CCTV');
postConstructor('user','AAPL','I justed made money from the stock!');
postConstructor('user','CCTV','I made money again!');
postConstructor('user2','CCTV','I made money too!');
commentConstructor(0,'user2','congrat!',undefined);
commentConstructor(0,'user','thank you!','admin');
commentConstructor(1,'admin','congrat again!',undefined);
commentConstructor(1,'user','thank you again!','admin');
commentConstructor(2,'admin','congrat to you!',undefined);
notifyConstructor('user','admin','Welcome new user!','Hello new user! This is admin. Please contact me if you have any question.');
notifyConstructor('user','admin','Welcome new user! Again!','Hello new user again!');
notifyConstructor('admin','user','Hello admin','Hello admin, This is user, nice to meet you');
orderConstructor('user','AAPL',20,'buy');
orderConstructor('user','CCTV',30,'buy');
orderConstructor('user2','AAPL',10,'buy');

registeredUserList[0].stockOwned['AAPL']=20;
registeredUserList[0].stockOwned['CCTV']=30;
registeredUserList[0].balance=1000;
registeredUserList[2].stockOwned['AAPL']=20;

if(pageTitle==='Personal Page'){
	//force the currentUser to be 'user' or 'admin' and update the information correspondingly
	currentUser=userLogin('user','user');
	updatePage();
	selectElementsPersonalPage();
	addEventPersonalPage();
}
else if(pageTitle==='Admin Page'){
	currentUser=userLogin('admin','admin');
	updatePage();
	selectElementsAdminPage();
	addEventAdminPage();
}
