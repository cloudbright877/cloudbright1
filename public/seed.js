// Run this in browser console: fetch("/seed.js").then(r=>r.text()).then(eval)
var uid="user_1";
localStorage.setItem("currentUserId",uid);
var user={id:uid,username:"demo",displayName:"DemoUser",email:"demo@test.com",referralCode:"DEMO123",referredBy:null,referralPath:"/"+uid,createdAt:Date.now()};
localStorage.setItem("currentUser",JSON.stringify(user));
localStorage.setItem("users",JSON.stringify([user]));
localStorage.setItem("balances",JSON.stringify([{id:uid,userId:uid,currency:"USDT",frozen:0,available:50000,updatedAt:Date.now()}]));
console.log("Done! User created + 50000 USDT");
location.reload();
