fetch("https://my-app.shahdiya1162004.workers.dev/track",{
    method:"POST",
    headers:{
    "Content-Type": "application/json"
    },
     body: JSON.stringify({
    referrer: document.referrer
  })
}).then((res)=>console.log(res))
console.log(document.referrer);