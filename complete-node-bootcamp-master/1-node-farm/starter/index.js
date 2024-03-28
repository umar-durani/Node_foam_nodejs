//------Core Modules ------
const fs = require("fs");
const http = require("http");
const url = require("url");
const slugify = require("slugify");
const info = require("./dev-data/data.json");
// const replaceTemplate = require("./modules/replaceTemplate");

//----------------- Myself Prectise ---------------------------------

/////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

//------- Blocking Synchronous Way ----------------
const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
console.log(textIn);
const textOut = `Aesop was one of the great Greek words Stories, that have a moral. ${textIn} \n Created On ${Date.now()}`;
fs.writeFileSync("./txt/output.txt", textOut);
console.log("Files Written!");

// ------- Non-Blocking ASynchronous Way ----------------

fs.readFile("./txt/start.txt", "utf-8", (err, data) => {
  if (err) return console.log("Error! 😢");
  fs.readFile(`./txt/${data}`, "utf-8", (err, data2) => {
    console.log(data2);
    fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
      console.log(data3);
      fs.writeFile("./txt/final.txt", `${data}\n${data3}`, "utf-8", (err) => {
        console.log("You code will b save in FinalTxt");
      });
    });
  });
});

//---------Server -----------------------

//---------Export file ---------=---------
const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  return output;
};

//---------Read Filesync JSON -----------
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);
const slugs = dataObj.map((el) => slugify(el.description, { lower: true }));
console.log(slugs);

console.log("Create a simple Web Sever");
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true); // ture means querry parameters are true
  //------ Overview ----------
  if (pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });
    const cardsHtml = dataObj.map((el) => {
      replaceTemplate(tempCard, el).join("");
      const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
      res.end(output);
    });
  }
  //----------- product -----------
  else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  }
  //--------- Json api -----------
  else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "Application/json" });
    res.end(data);
  }
  //--------- Page not Found ---------------
  else {
    res.writeHead("404", {
      "Content-type": "text/html",
      "my-own-header": "Hello World",
    });
    res.end("<h1>Page Not found</h1>");
  }
});

// starts a simple http server locally on port 3000
server.listen(3000, "127.0.0.1", () => {
  console.log("Listening on 127.0.0.1:3000");
});
