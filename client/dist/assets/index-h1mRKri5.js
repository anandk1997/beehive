import{e as p,d as n,j as o}from"./index-f9tINDKs.js";import{r as J,d as M,L as T,o as u}from"./chart-DqjXtJ1z.js";import{s as a}from"./index-9zJ0Jxpp.js";J();const F=()=>{const{id:e}=p(),[x,b]=n.useState(M()),[h,S]=n.useState(""),[j,B]=n.useState("");console.log("id",e);const[i,C]=n.useState({label:"",timestamp:""});return console.log("tooltipData",i),a.emit("send_message",e==null?void 0:e.toString()),a.on("receive_message",t=>{console.log(";;;;;;;;;;;;;",t)}),a.on("testingroom",t=>{console.log("............testingroom........",t)}),a.on("liveBeacon",t=>{const E=JSON.parse(t);console.log("newData",JSON.parse(t));const{xMP:f,yMP:w,time:c,beaconsData:L}=E;S(c),B(L),C({label:"Beacon",timestamp:c}),b(s=>{var l,m,r,d,g;const N=[...s==null?void 0:s.labels,f],O=[...(m=(l=s==null?void 0:s.datasets)==null?void 0:l[0])==null?void 0:m.data,w],P=[...(d=(r=s==null?void 0:s.datasets)==null?void 0:r[0])==null?void 0:d.timestamps,c];return{labels:N,datasets:[{...(g=s==null?void 0:s.datasets)==null?void 0:g[0],data:O,timestamps:P}]}})}),o.jsxs(o.Fragment,{children:[o.jsx(T,{options:u(),data:x,tooltip:i}),o.jsxs("div",{children:["Current Event : ",h]}),o.jsxs("div",{className:"",children:["Beacons Data : ",j]})]})},R=u;export{F as Beacon,R as chartOptionsWithCasting,F as default};