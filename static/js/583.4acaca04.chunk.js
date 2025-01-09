"use strict";(self.webpackChunkschedule_management_system=self.webpackChunkschedule_management_system||[]).push([[583],{583:(e,a,s)=>{s.r(a),s.d(a,{default:()=>f});var t=s(43),r=s(475),c=s(173),l=s(865),n=s(653),o=s(563),i=s(944),d=s(582),u=s(498),m=s(579);const h=function(){var e;const[a,s]=(0,t.useState)(!0),[h,N]=(0,t.useState)(null),[f,v]=(0,t.useState)(null),[T,y]=(0,t.useState)([]),[p,j]=(0,t.useState)(null),[b,x]=(0,t.useState)(new Date),[g,w]=(0,t.useState)(new Date),[k,$]=(0,t.useState)([]),S=(0,t.useCallback)((async()=>{s(!0);try{var e;const a=await fetch("https://backend-azure-sqlite-appservice.azurewebsites.net/Main/room/all");if(!a.ok)throw new Error(`Error fetching rooms: ${a.statusText}`);const t=(await a.json()).reduce(((e,a)=>{const s=parseInt(a.RoomNumber.charAt(0),10);return e[s]||(e[s]=[]),e[s].push({number:a.RoomNumber,status:"empty",roomId:a.RoomId,campusName:"MS"}),e}),{}),r={name:"MS",fullName:"Wydzia\u0142 Matematyki Stosowanej",floors:Object.keys(t).map((e=>({floorNumber:parseInt(e,10),classrooms:t[e]}))).sort(((e,a)=>e.floorNumber-a.floorNumber))};N(r),v(r.floors[0]),y((null===(e=r.floors[0])||void 0===e?void 0:e.classrooms)||[]),j(null),s(!1)}catch(a){console.error("Error fetching room data:",a),j("Failed to fetch room data. Please try again later."),s(!1)}}),[]),E=(0,t.useCallback)((async()=>{s(!0);try{const e=(0,c.L_)(b,"Europe/Warsaw"),a=e.getDay()%7,t=await fetch(`https://backend-azure-sqlite-appservice.azurewebsites.net/Main/classes/day/dayOfWeek?dayOfWeek=${a}`);if(!t.ok)throw new Error(`Error fetching recurring classes: ${t.statusText}`);const r=await t.json(),n=await fetch(`https://backend-azure-sqlite-appservice.azurewebsites.net/Main/classes/date/OneTimeClass?date=${(0,l.GP)(e,"yyyy-MM-dd")}`);if(!n.ok)throw new Error(`Error fetching one-time classes: ${n.statusText}`);const o=await n.json(),i=[...r,...o].map((e=>("1.00:00:00"===e.recurrenceEndTime&&(e.recurrenceEndTime="24:00:00"),e)));$(i),j(null),s(!1)}catch(e){console.error("Error fetching class data:",e),j("Failed to fetch class data. Please try again later."),s(!1)}}),[b]),M=(0,t.useCallback)((()=>{const e={Sunday:0,Monday:1,Tuesday:2,Wednesday:3,Thursday:4,Friday:5,Saturday:6},a=(0,c.L_)(new Date(b.setHours(g.getHours(),g.getMinutes())),"Europe/Warsaw"),s=a.toISOString().split("T")[0],t=a.getDay()%7,r=[],i=(e=>{const a=new Date(2024,0,1),s=Math.floor((e-a)/864e5);return(Math.floor(s/7)+1)%2===0?"even":"odd"})(a);k.forEach((c=>{const{roomNumber:d,recurrenceStartTime:u,recurrenceEndTime:m,recurrenceDay:h,teacherName:N,teacherId:f,teacherTitle:v,classTitle:T,canceledDates:y,isEveryWeek:p,isEven:j,oneTimeClassFullDate:b,oneTimeClassStartTime:x,oneTimeClassEndTime:g,isCanceled:w}=c;if(b){if(b.includes(s)){const e=(0,n.H)(`${s}T${x[0]}`),t=(0,n.H)(`${s}T${g[0]}`);"False"===w?(0,o.v)(a,{start:e,end:t})&&r.push({roomNumber:d,teacherName:N,teacherId:f,teacherTitle:v,classTitle:T,status:"taken",canceledNotice:null}):(0,o.v)(a,{start:e,end:t})&&r.push({roomNumber:d,teacherName:N,teacherId:f,teacherTitle:v,classTitle:T,status:"canceled",canceledNotice:"Class is canceled"})}}else{if(e[h]===t){const e=(0,n.H)(`${s}T${u}`),t=(0,n.H)(`${s}T${m}`);if((0,o.v)(a,{start:e,end:t}))if("True"===p){const e=y.includes((0,l.GP)(a,"dd/MM/yyyy"));r.push({roomNumber:d,teacherName:N,teacherId:f,teacherTitle:v,classTitle:T,status:e?"canceled":"taken",canceledNotice:e?"Class is canceled today":null})}else if(i===("True"===j?"even":"odd")){const e=y.includes((0,l.GP)(a,"dd/MM/yyyy"));r.push({roomNumber:d,teacherName:N,teacherId:f,teacherTitle:v,classTitle:T,status:e?"canceled":"taken",canceledNotice:e?"Class is canceled today":null})}else r.push({roomNumber:d,teacherName:N,teacherId:f,teacherTitle:v,classTitle:T,status:"empty",canceledNotice:null})}}}));const d=f.classrooms.map((e=>{const a=r.find((a=>a.roomNumber===e.number));return{...e,status:a?a.status:"empty",teacherName:(null===a||void 0===a?void 0:a.teacherName)||null,teacherId:(null===a||void 0===a?void 0:a.teacherId)||null,teacherTitle:(null===a||void 0===a?void 0:a.teacherTitle)||null,classTitle:(null===a||void 0===a?void 0:a.classTitle)||null,canceledNotice:(null===a||void 0===a?void 0:a.canceledNotice)||null}}));y(d)}),[f,k,b,g]);return(0,t.useEffect)((()=>{S()}),[S]),(0,t.useEffect)((()=>{E()}),[E,b]),(0,t.useEffect)((()=>{f&&k.length&&M()}),[f,M,k.length,g]),a?(0,m.jsx)(u.A,{}):(0,m.jsxs)("div",{className:"map-container",children:[(0,m.jsx)("h2",{children:null===h||void 0===h?void 0:h.fullName}),p&&(0,m.jsx)("div",{className:"error-message",children:p}),(0,m.jsxs)("div",{className:"date-time-selector",children:[(0,m.jsxs)("label",{children:["Select Date:",(0,m.jsx)("input",{type:"date",onChange:e=>{const a=new Date(e.target.value);a.setHours(g.getHours(),g.getMinutes()),x(a)},value:(0,l.GP)(b,"yyyy-MM-dd")})]}),(0,m.jsxs)("div",{className:"time-slider",children:[(0,m.jsx)("label",{children:"Set Time:"}),(0,m.jsx)("input",{type:"range",min:0,max:1435,step:5,value:(I=g,60*I.getHours()+I.getMinutes()),onChange:e=>{const a=e.target.value,s=Math.floor(a/60),t=(0,i.g)((0,d.a)(g,s),a%60);w(t)}}),(0,m.jsx)("span",{children:(0,l.GP)(g,"HH:mm")})]})]}),(0,m.jsx)("div",{className:"floor-selector",children:null===h||void 0===h||null===(e=h.floors)||void 0===e?void 0:e.map((e=>(0,m.jsxs)("button",{onClick:()=>(e=>{const a=h.floors.find((a=>a.floorNumber===e));v(a)})(e.floorNumber),children:["Floor ",e.floorNumber]},e.floorNumber)))}),(0,m.jsx)("div",{className:"classrooms-list",children:T.map(((e,a)=>(0,m.jsxs)("div",{className:"classroom-container",children:[(0,m.jsxs)("div",{className:"classroom-header",children:[(0,m.jsx)(r.N_,{to:`/classroom/${e.campusName||"MS"}/${e.number}/${e.roomId}`,className:"classroom-number",children:e.number}),(0,m.jsx)("span",{className:"status-circle "+("taken"===e.status?"taken":"canceled"===e.status?"canceled":"empty")})]}),(0,m.jsx)("div",{className:"classroom-details",children:"taken"===e.status?(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(r.N_,{to:`/teacher/${e.teacherName}/${e.teacherTitle}/${e.teacherId}`,className:"teacher-name",children:e.teacherName||"No teacher"}),(0,m.jsx)("div",{className:"class-title",children:e.classTitle||"No subject"})]}):"canceled"===e.status?(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(r.N_,{to:`/teacher/${e.teacherName}/${e.teacherTitle}/${e.teacherId}`,className:"teacher-name",children:e.teacherName||"No teacher"}),(0,m.jsx)("div",{className:"class-title",children:e.classTitle||"No subject"}),(0,m.jsx)("span",{className:"canceled-notice",children:e.canceledNotice})]}):(0,m.jsx)("span",{className:"classroom-number",children:"Empty"})}),(0,m.jsxs)("div",{className:"classroom-time",children:[e.recurrenceStartTime," - ",e.recurrenceEndTime]})]},a)))})]});var I};const N=function(){const[e,a]=(0,t.useState)([]),[s,c]=(0,t.useState)(!1),[l,n]=(0,t.useState)(null);return(0,t.useEffect)((()=>{(async()=>{try{var e;const s=await fetch("https://backend-azure-sqlite-appservice.azurewebsites.net/Main/teacher/all");if(!s.ok||null!==(e=s.headers.get("content-type"))&&void 0!==e&&e.includes("text/html"))throw new Error("Failed to fetch teachers. Server might be redirecting or returning HTML.");const t=await s.json();a(t)}catch(s){console.error("Error fetching teachers:",s),n("Failed to load teacher data. Please try again later.")}})()}),[]),l?(0,m.jsx)("div",{className:"error-message",children:l}):(0,m.jsxs)("div",{className:"teacher-list-container",children:[(0,m.jsx)("button",{className:"toggle-button",onClick:()=>c((e=>!e)),children:s?"Hide Teacher List":"Show Teacher List"}),(0,m.jsx)("div",{className:"teacher-list "+(s?"expanded":""),children:0===e.length?(0,m.jsx)("div",{children:"Loading..."}):(0,m.jsx)("div",{className:"scrollable-teacher-list",children:e.map((e=>(0,m.jsx)("button",{className:"teacher-button",title:`${e.TeacherName} - ${e.TeacherTitle}`,children:(0,m.jsx)(r.N_,{to:`/teacher/${e.TeacherName}/${e.TeacherTitle}/${e.TeacherId}`,children:e.TeacherName})},e.TeacherId)))})})]})};const f=function(){return(0,m.jsx)("div",{className:"home-page",children:(0,m.jsxs)("div",{className:"content-container",children:[(0,m.jsx)(h,{}),(0,m.jsx)(N,{})]})})}}}]);
//# sourceMappingURL=583.4acaca04.chunk.js.map