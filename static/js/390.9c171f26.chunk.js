"use strict";(self.webpackChunkschedule_management_system=self.webpackChunkschedule_management_system||[]).push([[390],{390:(e,t,s)=>{s.r(t),s.d(t,{default:()=>o});var a=s(43),r=s(216),n=s(107),i=s(579);const o=function(){const[e,t]=(0,a.useState)(""),[s,o]=(0,a.useState)(""),[l,c]=(0,a.useState)(""),[d,p]=(0,a.useState)(""),{setIsLoggedIn:u,setTeacherId:h,setToken:m,setExpirationDate:g}=(0,n.J)(),f=(0,r.Zp)();return(0,i.jsx)("div",{className:"login-register-wrapper",children:(0,i.jsxs)("form",{onSubmit:async t=>{t.preventDefault();try{const t=await fetch("https://backend-azure-sqlite-appservice.azurewebsites.net/Main/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:e,password:s,title:l})}),a=await t.json();if(t.ok){const t=await fetch("https://backend-azure-sqlite-appservice.azurewebsites.net/Main/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:e,password:s})}),a=await t.json();if(t.ok){u(!0),h(a.teacherId),m(a.token);const e=new Date(a.expiration.split("/").reverse().join("-")).toISOString();g(e),f("/")}else p(a.message||"Login failed")}else p(a.message||"Registration failed")}catch(a){p("An error occurred. Please try again.")}},className:"login-register-form",children:[(0,i.jsx)("h2",{children:"Register"}),(0,i.jsx)("div",{className:"form-element",children:(0,i.jsx)("input",{type:"text",value:e,onChange:e=>t(e.target.value),placeholder:"Username",required:!0})}),(0,i.jsx)("div",{className:"form-element",children:(0,i.jsx)("input",{type:"password",value:s,onChange:e=>o(e.target.value),placeholder:"Password",required:!0})}),(0,i.jsx)("div",{className:"form-element",children:(0,i.jsx)("input",{type:"text",value:l,onChange:e=>c(e.target.value),placeholder:"Title",required:!0})}),d&&(0,i.jsx)("p",{style:{color:"red"},children:d}),(0,i.jsx)("button",{type:"submit",children:"Register"})]})})}}}]);
//# sourceMappingURL=390.9c171f26.chunk.js.map