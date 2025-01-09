"use strict";(self.webpackChunkschedule_management_system=self.webpackChunkschedule_management_system||[]).push([[662],{615:(e,s,a)=>{a.d(s,{A:()=>p});var r=a(43),t=a(475),c=a(620),A=a(849),n=a(316);function l(e,s){const a=(0,A.q)(),r=s?.weekStartsOn??s?.locale?.options?.weekStartsOn??a.weekStartsOn??a.locale?.options?.weekStartsOn??0,t=(0,n.a)(e,s?.in),c=t.getDay(),l=6+(c<r?-7:0)-(c-r);return t.setDate(t.getDate()+l),t.setHours(23,59,59,999),t}var o=a(653),i=a(563),d=a(440);function h(e,s,a){const r=(0,n.a)(e,a?.in);return isNaN(s)?(0,d.w)(a?.in||e,NaN):s?(r.setDate(r.getDate()+s),r):r}function u(e,s,a){return h(e,7*s,a)}var m=a(35),k=a(799),y=a(107),j=a(579);const p=function(e){let{id:s,scheduleType:a,refreshTrigger:A}=e;const[n,d]=(0,r.useState)([]),{isLoggedIn:h,teacherId:p,token:g}=(0,y.J)(),[I,T]=(0,r.useState)(null),[w,E]=(0,r.useState)(new Date,"Europe/Warsaw"),M=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],N=(0,r.useCallback)((async()=>{let e;switch(a){case k.u.TEACHER:e=`https://backend-azure-sqlite-appservice.azurewebsites.net/Main/${s}/room/all`;break;case k.u.ROOM:e=`https://backend-azure-sqlite-appservice.azurewebsites.net/Main/classes/${s}/id`;break;default:throw new Error("Invalid schedule type")}try{const s=await fetch(e);if(!s.ok)throw new Error(`Error fetching classes: ${s.statusText}`);const a=await s.json();d(a),T(null)}catch(r){console.error("Error fetching classes:",r),T("Failed to load class data. Please try again later.")}}),[s,a]);(0,r.useEffect)((()=>{N()}),[N,A]);const C=(()=>{const e=(0,c.k)(w,{weekStartsOn:1}),s=l(w,{weekStartsOn:1}),a=e=>"1.00:00:00"===e?"24:00:00":e,r=e=>(0,o.H)(`2000-01-01T${a(e)}`),t=(e=>{const s=new Date(2024,0,1),a=Math.floor((e-s)/864e5);return(Math.floor(a/7)+1)%2===0?"even":"odd"})(w),A=M.map((()=>[])),d=e=>0===e?6:e-1;return n.forEach((r=>{r.recurringClasses.forEach((c=>{const n=c.canceledDates.some((a=>{const r=(e=>{const[s,a,r]=e.split("/");return new Date(`${r}-${s}-${a}`).toISOString()})(a),t=(0,o.H)(r);return(0,i.v)(t,{start:e,end:s})}));(c.isEveryWeek||c.isEven&&"even"===t||!c.isEven&&"odd"===t)&&A[d(c.recurrenceDay)].push({...r,recurrenceStartTime:a(c.recurrenceStartTime),recurrenceEndTime:a(c.recurrenceEndTime),teacherId:r.teacherId,teacherName:r.teacherName,teacherTitle:r.teacherTitle,roomNumber:r.roomNumber,roomId:r.roomId,isEveryWeek:c.isEveryWeek,isEven:c.isEven,isCanceled:n,recurrenceDay:c.recurrenceDay,classType:"Recurring"})})),r.oneTimeClasses&&r.oneTimeClasses.length>0&&r.oneTimeClasses.forEach((t=>{const c=(e=>{const[s,a,r]=e.split("/");return new Date(`${r}-${s}-${a}`).toISOString()})(t.oneTimeClassFullDate),n=(0,o.H)(c);if(console.log(c),console.log(n),(0,i.v)(n,{start:e,end:s})){const e=d(n.getDay());A[e].push({...r,date:n,recurrenceStartTime:a(t.oneTimeClassStartTime),recurrenceEndTime:a(t.oneTimeClassEndTime),teacherId:r.teacherId,teacherName:r.teacherName,teacherTitle:r.teacherTitle,roomNumber:r.roomNumber,roomId:r.roomId,isCanceled:r.isCanceled,classType:"One-Time"})}}))})),A.forEach((e=>{e.sort(((e,s)=>r(e.recurrenceStartTime)-r(s.recurrenceStartTime)))})),console.log(n),console.log(A),A})(),x=e=>E((s=>u(s,e)));return(0,j.jsxs)("div",{className:"weekly-schedule-container",children:[I&&(0,j.jsx)("div",{className:"weekly-schedule-error-message",children:I}),(0,j.jsxs)("div",{className:"weekly-schedule-week-selector",children:[(0,j.jsx)("button",{className:"weekly-schedule-button",onClick:()=>x(-1),children:"Previous Week"}),(0,j.jsxs)("span",{className:"weekly-schedule-date-range",children:[(0,m.GP)((0,c.k)(w,{weekStartsOn:1}),"MMM d")," -"," ",(0,m.GP)(l(w,{weekStartsOn:1}),"MMM d")]}),(0,j.jsx)("button",{className:"weekly-schedule-button",onClick:()=>x(1),children:"Next Week"})]}),(0,j.jsx)("div",{className:"weekly-schedule-week",children:M.map(((e,s)=>(0,j.jsxs)("div",{className:"weekly-schedule-day-column",children:[(0,j.jsx)("h3",{className:"weekly-schedule-day-title",children:e}),C[s].length>0?C[s].map(((e,s)=>(0,j.jsxs)("div",{className:`weekly-schedule-class-card weekly-schedule-${e.classType.toLowerCase()}`,children:[(0,j.jsx)("h4",{className:"weekly-schedule-class-title",children:e.classTitle}),(0,j.jsx)(t.N_,{to:`/classroom/${e.campusName}/${e.roomNumber}/${e.roomId}`,className:"classroom-number",children:e.roomNumber}),(0,j.jsxs)("p",{className:"weekly-schedule-class-time",children:[(0,m.GP)((0,o.H)(`2000-01-01T${e.recurrenceStartTime}`),"HH:mm")," -"," ",(0,m.GP)((0,o.H)(`2000-01-01T${e.recurrenceEndTime}`),"HH:mm")]}),e.isCanceled&&(0,j.jsx)("span",{className:"",children:"Cancelled"}),(0,j.jsx)(t.N_,{to:`/teacher/${e.teacherName}/${e.teacherTitle}/${e.teacherId}`,className:"weekly-schedule-class-teacher",children:e.teacherName}),(0,j.jsxs)("div",{className:"class-card-buttons",children:[h&&p===e.teacherId&&"One-Time"===e.classType&&(0,j.jsx)("button",{className:"cancel-meeting-button",onClick:()=>(async e=>{const{classId:s,classType:a,isCanceled:r}=e;let t="",c=null;try{"One-Time"===a&&(t=`https://backend-azure-sqlite-appservice.azurewebsites.net/Main/cancelOrRestoreClassOneTime/${s}?teacherId=${p}&teacherToken=${g}`,c=null);const e=await fetch(t,{method:"POST",headers:{"Content-Type":"application/json"},body:c?JSON.stringify(c):null});if(!e.ok)throw new Error(`Failed to update class: ${e.statusText}`);if("successfully."!==(await e.json()).message)throw new Error("Unexpected response message");{const e=n.map((e=>e.classId===s?{...e,isCanceled:!r}:e));d(e),alert(`Class ${r?"restored":"canceled"} successfully.`)}}catch(A){console.error("Error updating class:",A),alert("An error occurred while updating the class. Please try again.")}})(e),children:e.isCanceled?"Restore Meeting":"Cancel Meeting"}),h&&p===e.teacherId&&(0,j.jsx)("button",{className:"delete-meeting-button",onClick:()=>(async e=>{try{if(!p||!g)return void alert("Authentication details are missing. Please log in again.");const s=`https://backend-azure-sqlite-appservice.azurewebsites.net/Main/deleteClass/${e.classId}?teacherId=${p}&teacherToken=${g}`,a=await fetch(s,{method:"DELETE",headers:{"Content-Type":"application/json"}});if(!a.ok)throw new Error("Unexpected server response");if("Class and all related data deleted successfully."!==(await a.json()).message)throw new Error("Unexpected server response");{const s=n.filter((s=>s.classId!==e.classId));d(s),alert(`Class ${e.classTitle} has been deleted successfully`)}}catch(s){console.error("Error deleting class:",s),alert("An error occurred while deleting the class. Please try again.")}})(e),children:"Delete Meeting"})]})]},s))):(0,j.jsx)("p",{className:"weekly-schedule-no-classes",children:"No classes"})]},s)))})]})}},799:(e,s,a)=>{a.d(s,{u:()=>r});const r={TEACHER:"TEACHER",ROOM:"ROOM"}},662:(e,s,a)=>{a.r(s),a.d(s,{default:()=>i});a(43);var r=a(216),t=a(615),c=a(799);const A="data:image/jpeg;base64,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",n={Arseni:A,Default:A},l={"In\u017cynier":"In\u017c.",Doktor:"Dr.",Profesor:"Prof.",Magister:"Mgr."};var o=a(579);const i=function(){const{name:e,title:s,id:a}=(0,r.g)(),A=l[s]||s;return(0,o.jsxs)("div",{className:"teacher-page",children:[(0,o.jsxs)("div",{className:"teacher-info",children:[(0,o.jsx)("img",{src:n[e]||n.Default,alt:e,className:"teacher-photo"}),(0,o.jsx)("div",{className:"teacher-details",children:(0,o.jsxs)("h1",{children:[e," ",(0,o.jsx)("span",{className:"teacher-title",children:A})]})})]}),(0,o.jsxs)("div",{className:"schedule-section",children:[(0,o.jsx)("h1",{children:"Weekly Schedule"}),(0,o.jsx)(t.A,{id:a,scheduleType:c.u.TEACHER})]})]})}}}]);
//# sourceMappingURL=662.201da706.chunk.js.map