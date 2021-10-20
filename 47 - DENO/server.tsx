// @deno-types="https://deno.land/x/servest@v1.3.1/types/react/index.d.ts"
import React from "https://dev.jspm.io/react/index.js";
// @deno-types="https://deno.land/x/servest@v1.3.1/types/react-dom/server/index.d.ts"
import ReactDOMServer from "https://dev.jspm.io/react-dom/server.js";
import { createApp } from "https://deno.land/x/servest@v1.3.1/mod.ts";

const app = createApp();
let colores = ['blue ', 'yellow ', 'red ']



app.handle("/", async (req) => {
  await req.respond({
    status: 200,
    headers: new Headers({
      "content-type": "text/html; charset=UTF-8",
    }),
    body: ReactDOMServer.renderToString(
      <html>
        <head>
          <meta charSet="utf-8" />
          <title>servest</title>
        </head>
        <body>
          <h1 style={{color:'blue'}}>INGRESA UN COLOR</h1>
          <form action="/colores" method="post">
         color: <input type="text" name="colorIgresado"/>
         <button>enviar</button>
         </form>
          <h2 style={{color:'brown'}}>colores ya ingresados: {colores}</h2>
          <h3 style={{color:'purple'}}>FyH: {new Date().toLocaleString()}</h3>
        </body>
      </html>
    ),
  });
});

let color;

app.post("/colores", async (req) => {
    
  let color = await req.text();
  color = Object.values(color).splice(14).join("") + " ";
  colores.push(color);
  req.redirect("/"); 
});
app.listen({ port: 8080 });