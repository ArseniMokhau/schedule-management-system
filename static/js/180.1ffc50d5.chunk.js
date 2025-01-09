"use strict";(self.webpackChunkschedule_management_system=self.webpackChunkschedule_management_system||[]).push([[180],{746:(e,s,r)=>{r.d(s,{A:()=>x});var a=r(43),t=r(475),n=r(620),l=r(849),c=r(316);function i(e,s){const r=(0,l.q)(),a=s?.weekStartsOn??s?.locale?.options?.weekStartsOn??r.weekStartsOn??r.locale?.options?.weekStartsOn??0,t=(0,c.a)(e,s?.in),n=t.getDay(),i=6+(n<a?-7:0)-(n-a);return t.setDate(t.getDate()+i),t.setHours(23,59,59,999),t}var o=r(653),d=r(563),u=r(981);function h(e,s,r){return(0,u.f)(e,7*s,r)}var m=r(865),p=r(799),g=r(107),y=r(498),v=r(579);const x=function(e){let{id:s,scheduleType:r,refreshTrigger:l,onClassCancelled:c}=e;const[u,x]=(0,a.useState)(!0),[j,N]=(0,a.useState)([]),{isLoggedIn:C,teacherId:T,token:b}=(0,g.J)(),[k,w]=(0,a.useState)(null),[S,f]=(0,a.useState)(new Date,"Europe/Warsaw"),E=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],$=(0,a.useCallback)((async()=>{let e;switch(r){case p.u.TEACHER:e=`https://backend-azure-sqlite-appservice.azurewebsites.net/Main/${s}/room/all`;break;case p.u.ROOM:e=`https://backend-azure-sqlite-appservice.azurewebsites.net/Main/classes/${s}/id`;break;default:throw new Error("Invalid schedule type")}try{x(!0);const s=await fetch(e);if(!s.ok)throw new Error(`Error fetching classes: ${s.statusText}`);const r=await s.json();N(r),w(null),x(!1)}catch(a){console.error("Error fetching classes:",a),w("Failed to load class data. Please try again later."),x(!1)}}),[s,r]);(0,a.useEffect)((()=>{$()}),[$,l]);const D=(()=>{const e=(0,n.k)(S,{weekStartsOn:1}),s=i(S,{weekStartsOn:1}),r=e=>"1.00:00:00"===e?"24:00:00":e,a=e=>(0,o.H)(`2000-01-01T${r(e)}`),t=(e=>{const s=new Date(2024,0,1),r=Math.floor((e-s)/864e5);return(Math.floor(r/7)+1)%2===0?"even":"odd"})(S),l=E.map((()=>[])),c=e=>0===e?6:e-1;return j.forEach((a=>{a.recurringClasses.forEach((n=>{const i=n.canceledDates.some((r=>{const a=(e=>{const[s,r,a]=e.split("/");return new Date(`${a}-${s}-${r}`).toISOString()})(r),t=(0,o.H)(a);return(0,d.v)(t,{start:e,end:s})}));(n.isEveryWeek||n.isEven&&"even"===t||!n.isEven&&"odd"===t)&&l[c(n.recurrenceDay)].push({...a,recurrenceStartTime:r(n.recurrenceStartTime),recurrenceEndTime:r(n.recurrenceEndTime),teacherId:a.teacherId,teacherName:a.teacherName,teacherTitle:a.teacherTitle,roomNumber:a.roomNumber,roomId:a.roomId,isEveryWeek:n.isEveryWeek,isEven:n.isEven,isCanceled:i,recurrenceDay:n.recurrenceDay,classType:"Recurring"})})),a.oneTimeClasses&&a.oneTimeClasses.length>0&&a.oneTimeClasses.forEach((t=>{const n=(e=>{const[s,r,a]=e.split("/");return new Date(`${a}-${s}-${r}`).toISOString()})(t.oneTimeClassFullDate),i=(0,o.H)(n);if((0,d.v)(i,{start:e,end:s})){const e=c(i.getDay());l[e].push({...a,date:i,recurrenceStartTime:r(t.oneTimeClassStartTime),recurrenceEndTime:r(t.oneTimeClassEndTime),teacherId:a.teacherId,teacherName:a.teacherName,teacherTitle:a.teacherTitle,roomNumber:a.roomNumber,roomId:a.roomId,isCanceled:a.isCanceled,classType:"One-Time"})}}))})),l.forEach((e=>{e.sort(((e,s)=>a(e.recurrenceStartTime)-a(s.recurrenceStartTime)))})),l})(),I=e=>f((s=>h(s,e))),O=async e=>{const{classId:s,classType:r,isCanceled:a,recurrenceDay:t}=e,n="https://backend-azure-sqlite-appservice.azurewebsites.net/Main";let l="",i=null;try{if("One-Time"===r)l=`${n}/cancelOrRestoreClassOneTime/${s}?teacherId=${T}&teacherToken=${b}`,i=null;else{if("Recurring"!==r)throw new Error("Unknown class type");{const e=(()=>{const e=new Date(S),s=e.getDay(),r=(0===t?7:t)-s;return e.setDate(e.getDate()+r),r<=0&&e.setDate(e.getDate()),e})();a?(l=`${n}/restoreRecurringClass/${s}?teacherId=${T}&teacherToken=${b}`,i=(0,m.GP)(e,"yyyy-MM-dd")):(l=`${n}/cancelRecurringClass/${s}?teacherId=${T}&teacherToken=${b}`,i=(0,m.GP)(e,"yyyy-MM-dd"))}}const e=await fetch(l,{method:"POST",headers:{"Content-Type":"application/json"},body:i?JSON.stringify(i):null});if(!e.ok)throw new Error(`Failed to update class: ${e.statusText}`);if(!(await e.json()).message.includes("successfully"))throw new Error("Unexpected response message");alert(`Class ${a?"restored":"canceled"} successfully.`),c()}catch(o){console.error("Error updating class:",o),alert("An error occurred while updating the class. Please try again."),c()}};return u?(0,v.jsx)(y.A,{}):(0,v.jsxs)("div",{className:"weekly-schedule-container",children:[k&&(0,v.jsx)("div",{className:"weekly-schedule-error-message",children:k}),(0,v.jsxs)("div",{className:"weekly-schedule-week-selector",children:[(0,v.jsx)("button",{className:"weekly-schedule-button",onClick:()=>I(-1),children:"Previous Week"}),(0,v.jsxs)("span",{className:"weekly-schedule-date-range",children:[(0,m.GP)((0,n.k)(S,{weekStartsOn:1}),"MMM d")," -"," ",(0,m.GP)(i(S,{weekStartsOn:1}),"MMM d")]}),(0,v.jsx)("button",{className:"weekly-schedule-button",onClick:()=>I(1),children:"Next Week"})]}),(0,v.jsx)("div",{className:"weekly-schedule-week",children:E.map(((e,s)=>(0,v.jsxs)("div",{className:"weekly-schedule-day-column",children:[(0,v.jsx)("h3",{className:"weekly-schedule-day-title",children:e}),D[s].length>0?D[s].map(((e,s)=>(0,v.jsxs)("div",{className:`weekly-schedule-class-card weekly-schedule-${e.classType.toLowerCase()}`,children:[(0,v.jsx)("h4",{className:"weekly-schedule-class-title",children:e.classTitle}),(0,v.jsx)(t.N_,{to:`/classroom/${e.campusName}/${e.roomNumber}/${e.roomId}`,className:"classroom-number",children:e.roomNumber}),(0,v.jsxs)("p",{className:"weekly-schedule-class-time",children:[(0,m.GP)((0,o.H)(`2000-01-01T${e.recurrenceStartTime}`),"HH:mm")," -"," ",(0,m.GP)((0,o.H)(`2000-01-01T${e.recurrenceEndTime}`),"HH:mm")]}),e.isCanceled&&(0,v.jsx)("span",{className:"",children:"Cancelled"}),(0,v.jsx)(t.N_,{to:`/teacher/${e.teacherName}/${e.teacherTitle}/${e.teacherId}`,className:"weekly-schedule-class-teacher",children:e.teacherName}),(0,v.jsxs)("div",{className:"class-card-buttons",children:[C&&T===e.teacherId&&(0,v.jsx)("button",{className:"cancel-meeting-button",onClick:()=>O(e),children:e.isCanceled?"Restore Meeting":"Cancel Meeting"}),C&&T===e.teacherId&&(0,v.jsx)("button",{className:"delete-meeting-button",onClick:()=>(async e=>{try{if(!T||!b)return void alert("Authentication details are missing. Please log in again.");const s=`https://backend-azure-sqlite-appservice.azurewebsites.net/Main/deleteClass/${e.classId}?teacherId=${T}&teacherToken=${b}`,r=await fetch(s,{method:"DELETE",headers:{"Content-Type":"application/json"}});if(!r.ok)throw new Error("Unexpected server response");if("Class and all related data deleted successfully."!==(await r.json()).message)throw new Error("Unexpected server response");{const s=j.filter((s=>s.classId!==e.classId));N(s),alert(`Class ${e.classTitle} has been deleted successfully`)}}catch(s){console.error("Error deleting class:",s),alert("An error occurred while deleting the class. Please try again.")}})(e),children:"Delete Meeting"})]})]},s))):(0,v.jsx)("p",{className:"weekly-schedule-no-classes",children:"No classes"})]},s)))})]})}},799:(e,s,r)=>{r.d(s,{u:()=>a});const a={TEACHER:"TEACHER",ROOM:"ROOM"}},180:(e,s,r)=>{r.r(s),r.d(s,{default:()=>o});var a=r(43),t=r(107),n=r(579);const l=e=>{let{onClassCreated:s}=e;const{isLoggedIn:r,teacherId:l,token:c}=(0,t.J)(),[i,o]=(0,a.useState)(""),[d,u]=(0,a.useState)(""),[h,m]=(0,a.useState)(""),[p,g]=(0,a.useState)(""),[y,v]=(0,a.useState)(!1),[x,j]=(0,a.useState)(""),[N,C]=(0,a.useState)({hours:0,minutes:0,seconds:0}),[T,b]=(0,a.useState)({hours:0,minutes:0,seconds:0}),[k,w]=(0,a.useState)(!1),[S,f]=(0,a.useState)(!1),[E,$]=(0,a.useState)(0),[D,I]=(0,a.useState)({hours:0,minutes:0,seconds:0}),[O,M]=(0,a.useState)({hours:0,minutes:0,seconds:0}),[R,F]=(0,a.useState)([]),[q]=(0,a.useState)(["MS"]);(0,a.useEffect)((()=>{(async()=>{try{const e=await fetch("https://backend-azure-sqlite-appservice.azurewebsites.net/Main/room/all"),s=await e.json();if(e.ok){const e=s.sort(((e,s)=>e.RoomNumber-s.RoomNumber));F(e)}else console.error("Failed to fetch classrooms:",s.message)}catch(e){console.error("Error fetching classrooms:",e)}})()}),[]);return(0,n.jsxs)("div",{className:"create-class-container",children:[(0,n.jsx)("h2",{children:"Create New Class"}),(0,n.jsxs)("form",{onSubmit:async e=>{if(e.preventDefault(),!r||!l||!c)return void alert("User not logged in or missing credentials. Please log in again.");const a={roomNumber:i,title:d,description:h,campusName:p,isOneTimeClass:y,oneTimeClassFullDate:y?x:null,oneTimeClassStartTime:y?N:{hours:0,minutes:0,seconds:0},oneTimeClassEndTime:y?T:{hours:0,minutes:0,seconds:0},isEveryWeek:!y&&k,isEven:!y&&!k&&S,recurrenceDay:y?0:E,recurrenceStartTime:y?{hours:0,minutes:0,seconds:0}:D,recurrenceEndTime:y?{hours:0,minutes:0,seconds:0}:O};try{const e=await fetch(`https://backend-azure-sqlite-appservice.azurewebsites.net/Main/createClass?teacherId=${l}&teacherToken=${c}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)}),r=await e.json();e.ok?(alert("Class created successfully!"),s()):alert("Error creating class: "+r.message)}catch(t){console.error("Error:",t),alert("An error occurred while creating the class")}},className:"create-class-form",children:[(0,n.jsxs)("div",{className:"form-group",children:[(0,n.jsx)("label",{htmlFor:"campusName",children:"Campus"}),(0,n.jsxs)("select",{id:"campusName",value:p,onChange:e=>g(e.target.value),required:!0,children:[(0,n.jsx)("option",{value:"",children:"Select a campus"}),q.map((e=>(0,n.jsx)("option",{value:e,children:e},e)))]})]}),(0,n.jsxs)("div",{className:"form-group",children:[(0,n.jsx)("label",{htmlFor:"roomNumber",children:"Room Number"}),(0,n.jsxs)("select",{id:"roomNumber",value:i,onChange:e=>o(e.target.value),required:!0,children:[(0,n.jsx)("option",{value:"",children:"Select a room"}),R.map((e=>(0,n.jsx)("option",{value:e.RoomNumber,children:e.RoomNumber},e.RoomId)))]})]}),(0,n.jsxs)("div",{className:"form-group",children:[(0,n.jsx)("label",{htmlFor:"title",children:"Class Title"}),(0,n.jsx)("input",{type:"text",id:"title",value:d,onChange:e=>u(e.target.value),required:!0})]}),(0,n.jsxs)("div",{className:"form-group",children:[(0,n.jsx)("label",{htmlFor:"description",children:"Description"}),(0,n.jsx)("input",{type:"text",id:"description",value:h,onChange:e=>m(e.target.value),required:!0})]}),(0,n.jsxs)("div",{className:"form-group",children:[(0,n.jsx)("label",{htmlFor:"isOneTimeClass",children:"One-time Class"}),(0,n.jsx)("input",{type:"checkbox",id:"isOneTimeClass",checked:y,onChange:()=>v((e=>!e))})]}),y?(0,n.jsxs)(n.Fragment,{children:[(0,n.jsxs)("div",{className:"form-group",children:[(0,n.jsx)("label",{htmlFor:"oneTimeClassFullDate",children:"Class Date"}),(0,n.jsx)("input",{type:"date",id:"oneTimeClassFullDate",value:x,onChange:e=>j(e.target.value),required:!0})]}),(0,n.jsxs)("div",{className:"form-group",children:[(0,n.jsx)("label",{children:"Start Time"}),(0,n.jsx)("input",{type:"time",value:`${String(N.hours).padStart(2,"0")}:${String(N.minutes).padStart(2,"0")}`,onChange:e=>{const[s,r]=e.target.value.split(":");C({hours:Number(s),minutes:Number(r),seconds:0})},required:!0})]}),(0,n.jsxs)("div",{className:"form-group",children:[(0,n.jsx)("label",{children:"End Time"}),(0,n.jsx)("input",{type:"time",value:`${String(T.hours).padStart(2,"0")}:${String(T.minutes).padStart(2,"0")}`,onChange:e=>{const[s,r]=e.target.value.split(":");b({hours:Number(s),minutes:Number(r),seconds:0})},required:!0})]})]}):(0,n.jsxs)(n.Fragment,{children:[(0,n.jsxs)("div",{className:"form-group",children:[(0,n.jsx)("label",{htmlFor:"isEveryWeek",children:"Repeat Weekly"}),(0,n.jsx)("input",{type:"checkbox",id:"isEveryWeek",checked:k,onChange:()=>w((e=>!e))})]}),(0,n.jsxs)("div",{className:"form-group",children:[(0,n.jsx)("label",{htmlFor:"recurrenceDay",children:"Recurrence Day"}),(0,n.jsxs)("select",{id:"recurrenceDay",value:E,onChange:e=>$(Number(e.target.value)),children:[(0,n.jsx)("option",{value:1,children:"Monday"}),(0,n.jsx)("option",{value:2,children:"Tuesday"}),(0,n.jsx)("option",{value:3,children:"Wednesday"}),(0,n.jsx)("option",{value:4,children:"Thursday"}),(0,n.jsx)("option",{value:5,children:"Friday"}),(0,n.jsx)("option",{value:6,children:"Saturday"}),(0,n.jsx)("option",{value:0,children:"Sunday"})]})]}),(0,n.jsxs)("div",{className:"form-group",children:[(0,n.jsx)("label",{children:"Start Time"}),(0,n.jsx)("input",{type:"time",value:`${String(D.hours).padStart(2,"0")}:${String(D.minutes).padStart(2,"0")}`,onChange:e=>{const[s,r]=e.target.value.split(":");I({hours:Number(s),minutes:Number(r),seconds:0})},required:!0})]}),(0,n.jsxs)("div",{className:"form-group",children:[(0,n.jsx)("label",{children:"End Time"}),(0,n.jsx)("input",{type:"time",value:`${String(O.hours).padStart(2,"0")}:${String(O.minutes).padStart(2,"0")}`,onChange:e=>{const[s,r]=e.target.value.split(":");M({hours:Number(s),minutes:Number(r),seconds:0})},required:!0})]}),!k&&(0,n.jsxs)("div",{className:"form-group",children:[(0,n.jsx)("label",{htmlFor:"isEven",children:"Even Weeks"}),(0,n.jsx)("input",{type:"checkbox",id:"isEven",checked:S,onChange:()=>f((e=>!e))})]})]}),(0,n.jsx)("button",{type:"submit",children:"Create Class"})]})]})};var c=r(746),i=r(799);const o=function(){const{teacherId:e,isLoggedIn:s}=(0,t.J)(),[r,o]=(0,a.useState)(!1),d=()=>{o((e=>!e))};return(0,n.jsxs)("div",{className:"dashboard",onClassCreated:d,children:[s&&e?(0,n.jsx)(c.A,{id:e,scheduleType:i.u.TEACHER,refreshTrigger:r,onClassCancelled:()=>{o((e=>!e))}}):(0,n.jsx)("p",{className:"dashboard-no-schedule",children:"Please log in to view your schedule."}),(0,n.jsx)(l,{onClassCreated:d})]})}},981:(e,s,r)=>{r.d(s,{f:()=>n});var a=r(440),t=r(316);function n(e,s,r){const n=(0,t.a)(e,r?.in);return isNaN(s)?(0,a.w)(r?.in||e,NaN):s?(n.setDate(n.getDate()+s),n):n}}}]);
//# sourceMappingURL=180.1ffc50d5.chunk.js.map