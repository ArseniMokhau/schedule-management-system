"use strict";(self.webpackChunkschedule_management_system=self.webpackChunkschedule_management_system||[]).push([[380],{615:(e,s,a)=>{a.d(s,{A:()=>y});var r=a(43),c=a(620),t=a(849),l=a(316);function n(e,s){const a=(0,t.q)(),r=s?.weekStartsOn??s?.locale?.options?.weekStartsOn??a.weekStartsOn??a.locale?.options?.weekStartsOn??0,c=(0,l.a)(e,s?.in),n=c.getDay(),o=6+(n<r?-7:0)-(n-r);return c.setDate(c.getDate()+o),c.setHours(23,59,59,999),c}var o=a(653),i=a(563),d=a(440);function m(e,s,a){const r=(0,l.a)(e,a?.in);return isNaN(s)?(0,d.w)(a?.in||e,NaN):s?(r.setDate(r.getDate()+s),r):r}function h(e,s,a){return m(e,7*s,a)}var u=a(35),p=a(799),g=a(107),w=a(579);const y=function(e){let{id:s,scheduleType:a,refreshTrigger:t}=e;const[l,d]=(0,r.useState)([]),{isLoggedIn:m,teacherId:y,token:k}=(0,g.J)(),[N,f]=(0,r.useState)(null),[T,x]=(0,r.useState)(new Date,"Europe/Warsaw"),j=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],b=(0,r.useCallback)((async()=>{let e;switch(a){case p.u.TEACHER:e=`https://backend-azure-sqlite-appservice.azurewebsites.net/Main/${s}/room/all`;break;case p.u.ROOM:e=`https://backend-azure-sqlite-appservice.azurewebsites.net/Main/classes/${s}/id`;break;default:throw new Error("Invalid schedule type")}try{const s=await fetch(e);if(!s.ok)throw new Error(`Error fetching classes: ${s.statusText}`);const a=await s.json();d(a),f(null)}catch(r){console.error("Error fetching classes:",r),f("Failed to load class data. Please try again later.")}}),[s,a]);(0,r.useEffect)((()=>{b()}),[b,t]);const C=(()=>{const e=(0,c.k)(T,{weekStartsOn:1}),s=n(T,{weekStartsOn:1}),a=e=>"1.00:00:00"===e?"24:00:00":e,r=e=>(0,o.H)(`2000-01-01T${a(e)}`),t=(e=>{const s=new Date(2024,0,1),a=Math.floor((e-s)/864e5);return(Math.floor(a/7)+1)%2===0?"even":"odd"})(T),d=j.map((()=>[])),m=e=>0===e?6:e-1;return l.forEach((r=>{r.recurringClasses.forEach((c=>{const l=c.canceledDates.some((a=>{const r=(e=>{const[s,a,r]=e.split("/");return new Date(`${r}-${s}-${a}`).toISOString()})(a),c=(0,o.H)(r);return(0,i.v)(c,{start:e,end:s})}));(c.isEveryWeek||c.isEven&&"even"===t||!c.isEven&&"odd"===t)&&d[m(c.recurrenceDay)].push({...r,recurrenceStartTime:a(c.recurrenceStartTime),recurrenceEndTime:a(c.recurrenceEndTime),teacherId:r.teacherId,teacherName:r.teacherName,teacherTitle:r.teacherTitle,roomNumber:r.roomNumber,roomId:r.roomId,isEveryWeek:c.isEveryWeek,isEven:c.isEven,isCanceled:l,recurrenceDay:c.recurrenceDay,classType:"Recurring"})})),r.oneTimeClasses&&r.oneTimeClasses.length>0&&r.oneTimeClasses.forEach((c=>{const t=(e=>{const[s,a,r]=e.split("/");return new Date(`${r}-${s}-${a}`).toISOString()})(c.oneTimeClassFullDate),l=(0,o.H)(t);if(console.log(t),console.log(l),(0,i.v)(l,{start:e,end:s})){const e=m(l.getDay());d[e].push({...r,date:l,recurrenceStartTime:a(c.oneTimeClassStartTime),recurrenceEndTime:a(c.oneTimeClassEndTime),teacherId:r.teacherId,teacherName:r.teacherName,teacherTitle:r.teacherTitle,roomNumber:r.roomNumber,roomId:r.roomId,isCanceled:r.isCanceled,classType:"One-Time"})}}))})),d.forEach((e=>{e.sort(((e,s)=>r(e.recurrenceStartTime)-r(s.recurrenceStartTime)))})),console.log(l),console.log(d),d})(),v=e=>x((s=>h(s,e)));return(0,w.jsxs)("div",{className:"weekly-schedule-container",children:[N&&(0,w.jsx)("div",{className:"weekly-schedule-error-message",children:N}),(0,w.jsxs)("div",{className:"weekly-schedule-week-selector",children:[(0,w.jsx)("button",{className:"weekly-schedule-button",onClick:()=>v(-1),children:"Previous Week"}),(0,w.jsxs)("span",{className:"weekly-schedule-date-range",children:[(0,u.GP)((0,c.k)(T,{weekStartsOn:1}),"MMM d")," -"," ",(0,u.GP)(n(T,{weekStartsOn:1}),"MMM d")]}),(0,w.jsx)("button",{className:"weekly-schedule-button",onClick:()=>v(1),children:"Next Week"})]}),(0,w.jsx)("div",{className:"weekly-schedule-week",children:j.map(((e,s)=>(0,w.jsxs)("div",{className:"weekly-schedule-day-column",children:[(0,w.jsx)("h3",{className:"weekly-schedule-day-title",children:e}),C[s].length>0?C[s].map(((e,s)=>(0,w.jsxs)("div",{className:`weekly-schedule-class-card weekly-schedule-${e.classType.toLowerCase()}`,children:[(0,w.jsx)("h4",{className:"weekly-schedule-class-title",children:e.classTitle}),(0,w.jsx)("a",{href:`/classroom/${e.campusName}/${e.roomNumber}/${e.roomId}`,className:"classroom-number",children:e.roomNumber}),(0,w.jsxs)("p",{className:"weekly-schedule-class-time",children:[(0,u.GP)((0,o.H)(`2000-01-01T${e.recurrenceStartTime}`),"HH:mm")," -"," ",(0,u.GP)((0,o.H)(`2000-01-01T${e.recurrenceEndTime}`),"HH:mm")]}),e.isCanceled&&(0,w.jsx)("span",{className:"",children:"Cancelled"}),(0,w.jsxs)("a",{href:`/teacher/${e.teacherName}/${e.teacherTitle}/${e.teacherId}`,className:"weekly-schedule-class-teacher",children:[e.teacherTitle||"No title","   ",e.teacherName]}),(0,w.jsxs)("div",{className:"class-card-buttons",children:[m&&y===e.teacherId&&"One-Time"===e.classType&&(0,w.jsx)("button",{className:"cancel-meeting-button",onClick:()=>(async e=>{const{classId:s,classType:a,isCanceled:r}=e;let c="",t=null;try{"One-Time"===a&&(c=`https://backend-azure-sqlite-appservice.azurewebsites.net/Main/cancelOrRestoreClassOneTime/${s}?teacherId=${y}&teacherToken=${k}`,t=null);const e=await fetch(c,{method:"POST",headers:{"Content-Type":"application/json"},body:t?JSON.stringify(t):null});if(!e.ok)throw new Error(`Failed to update class: ${e.statusText}`);if("successfully."!==(await e.json()).message)throw new Error("Unexpected response message");{const e=l.map((e=>e.classId===s?{...e,isCanceled:!r}:e));d(e),alert(`Class ${r?"restored":"canceled"} successfully.`)}}catch(n){console.error("Error updating class:",n),alert("An error occurred while updating the class. Please try again.")}})(e),children:e.isCanceled?"Restore Meeting":"Cancel Meeting"}),m&&y===e.teacherId&&(0,w.jsx)("button",{className:"delete-meeting-button",onClick:()=>(async e=>{try{if(!y||!k)return void alert("Authentication details are missing. Please log in again.");const s=`https://backend-azure-sqlite-appservice.azurewebsites.net/Main/deleteClass/${e.classId}?teacherId=${y}&teacherToken=${k}`,a=await fetch(s,{method:"DELETE",headers:{"Content-Type":"application/json"}});if(!a.ok)throw new Error("Unexpected server response");if("Class and all related data deleted successfully."!==(await a.json()).message)throw new Error("Unexpected server response");{const s=l.filter((s=>s.classId!==e.classId));d(s),alert(`Class ${e.classTitle} has been deleted successfully`)}}catch(s){console.error("Error deleting class:",s),alert("An error occurred while deleting the class. Please try again.")}})(e),children:"Delete Meeting"})]})]},s))):(0,w.jsx)("p",{className:"weekly-schedule-no-classes",children:"No classes"})]},s)))})]})}},799:(e,s,a)=>{a.d(s,{u:()=>r});const r={TEACHER:"TEACHER",ROOM:"ROOM"}},622:(e,s,a)=>{a.r(s),a.d(s,{default:()=>o});a(43);var r=a(216),c=a(615),t=a(799);const l={MS:{fullName:"Wydzia\u0142 Matematyki Stosowanej",mapsEmbedSrc:"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2549.043926603353!2d18.677463113142103!3d50.29110789870408!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47113101aa29eacb%3A0xb264c95270614eda!2sPolitechnika%20%C5%9Al%C4%85ska%2C%20Wydzia%C5%82%20Matematyki%20Stosowanej!5e0!3m2!1sen!2spl!4v1733085254800!5m2!1sen!2spl",imageSrc:a.p+"static/media/wydzial-rms-slide.f401748cc346648833d1.jpg"}};var n=a(579);const o=function(){const{campus:e,number:s,id:o}=(0,r.g)(),i=l[e];return(0,n.jsxs)("div",{className:"classroom-page-container",children:[(0,n.jsxs)("div",{className:"classroom-page-header",children:[(0,n.jsx)("h2",{className:"classroom-page-title",children:i.fullName}),(0,n.jsx)("div",{className:"classroom-page-info",children:(0,n.jsx)("h1",{className:"classroom-page-classroom-number",children:s})})]}),(0,n.jsxs)("div",{className:"classroom-page-schedule-section",children:[(0,n.jsx)("h2",{className:"classroom-page-schedule-title",children:"Classroom Weekly Schedule"}),(0,n.jsx)(c.A,{id:o,scheduleType:t.u.ROOM})]}),(0,n.jsxs)("div",{className:"classroom-page-campus-info-section",children:[(0,n.jsxs)("div",{className:"classroom-page-google-maps",children:[(0,n.jsx)("h3",{className:"classroom-page-google-maps-title",children:"Campus Location"}),(0,n.jsx)("iframe",{src:i.mapsEmbedSrc,width:"600",height:"450",style:{border:"0"},allowFullScreen:"",loading:"lazy",referrerPolicy:"no-referrer-when-downgrade",title:`Google Maps embed showing the location of ${e}`})]}),(0,n.jsxs)("div",{className:"classroom-page-campus-image",children:[(0,n.jsx)("h3",{className:"classroom-page-campus-image-title",children:"Campus Image"}),(0,n.jsx)("img",{src:i.imageSrc,alt:`${e} campus`})]})]}),(0,n.jsxs)("div",{className:"classroom-page-maphelper-section",children:[(0,n.jsx)("h3",{className:"classroom-page-maphelper-title",children:"Get MapHelper App"}),(0,n.jsx)("a",{href:"https://arsenimokhau.github.io/Map-Helper/",target:"_blank",rel:"noopener noreferrer",children:(0,n.jsx)("img",{src:a(402),alt:"QR Code for MapHelper",className:"classroom-page-maphelper-qr",style:{width:"200px",height:"200px"}})}),(0,n.jsx)("p",{children:"Scan the QR code or click it to open the MapHelper application."})]})]})}},402:(e,s,a)=>{e.exports=a.p+"static/media/qr.a3e5c59d148691b73a45.png"}}]);
//# sourceMappingURL=380.e79ff50a.chunk.js.map