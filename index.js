var express = require('express'); //引入express這個module框架
var mysql = require('mysql'); //引入mysql這個框架
var app = express();

var total = 0;
var products = [];
var id = [];
var price = [];
var finalnumber=0;
// 顯示版本號
app.get('/', (req, res) => {
res.send(require('./package.json').version);
})

// 掃描商品
app.get('/select', function (request, res) {
try {
// 1. get product id
var productId = request.query.productId; //輸入productid 輸入的寫法要寫/select?productId=10101 // 乙
var terminalId = request.query.terminalId; // 2. connect db

var connection = mysql.createConnection({
host: '35.236.134.196',
user: 'root',
password: 'ben88427',
database: 'mydatabase',
port: '3306',
});
connection.connect(); // 3. select data

connection.query(
`SELECT * from market_table where id = ${productId} `, //這裡有個逗號，所以你要知道下面那個function是connection.query()的第二個引數所以說下面那個function一定會被執行 // 3.5 取得結果
//&{變數}這個是用在字串裡面的把變數的值變成字串 否則就要 "字串"+變數+"字串"
function (error, results, fields) {
//看起來連到以後他會給這個function error,result,field三個引數
if (error) {
console.log(error);
res.send('no data'); //顯示nodata
} else {
total += Number.parseInt(results[0].price); // number.parseInt()把它的型態轉成數字
finalnumber+=1;
products.push(results[0].product); //result是一個陣列 result[0]是物件(object)大陸翻譯對象 然後java腳本的陣列可以放字串
id.push(results[0].id); //id也是一個陣列 id.push()意思是把東西放進這個陣列裡面
price.push(results[0].price);
res.json(results); //顯示result result是陣列裡面放物件


}
}
); // close connect




connection.end(); //結束連線
} catch (error) {
console.log(error); //印出錯誤
res.send('no data'); // res.send意思是顯示
} //try{}catch(){}如果try裡面有錯誤，才會跑到catch
});







app.get('/getTotal', function (req, res) {
//這個function 也是會執行 app.get的用法可以去express看，這是很有名的module
var finalTotal = total;

var finalProducts = [...products];
var finalprice=[...price];
const showDetail = {}; //一個物件

finalProducts.forEach(function (finalProducts) {
// run 4 times
// product = a

if (!showDetail[finalProducts]) {
//如果沒有這個物件 showdetail.黑松茶花ㄒ就讓他的值是1 showDetail[product]這個key對應的對象是那個product的數量 因為product是變數所以用中括號
showDetail[finalProducts] = 1;
// showDetail.a = 1
} else {
showDetail[finalProducts] = showDetail[finalProducts] + 1;
}
});
let result = "";

while (finalProducts.length > 0) {
// 如果這個陣列不為空
result += `
<div class="row justify-content-md-center">
<div class="col-4">
${finalProducts[0]}
</div>
<div class="col-8">
<div class="row">
<div class="col">
${finalprice[0]} $
</div>
<div class="col">
* ${showDetail[finalProducts[0]]} =
</div>
<div class="col">
${showDetail[finalProducts[0]] * finalprice[0]} $
</div>
</div>
</div>
</div>
`
while (finalProducts.lastIndexOf(finalProducts[0]) != -1) {
//這個迴圈不一定只做一次，用while的原因是product[1]跟product[2]的值可能都是黑松茶花，而我拿到產品的名字以後會希望把陣列中所有一樣的產品名丟出去，如果不用break不是只有同名稱的product被清空，是整個陣列都會被清空所以要用break
//陣列.lastIndexOf(product[0])他會回傳 product[0]的值在這個陣列哪個位置,如果在這個陣列找不到會回傳負1
let i = finalProducts.lastIndexOf(finalProducts[0]); //let 宣告的變數只有在迴圈裡可以使用目的是不要汙染外部變數
finalProducts.splice(i, 1); //把他丟出去陣列
finalprice.splice(i, 1);
if (i == 0) break;
}
}

result += '<hr style="border-color: #000;">'
result += 
`<div class="row" >
<div style="color:transparent">
'hhh'
</div>
<div class="col-9" >

總數:${finalnumber}

</div>



<div class="col" >

總價: ${finalTotal} $

</div>

</div>`; //res.json 意思跟res.send和res.end很像都是顯示

res.send(`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">
</head>
<body style="height: calc(100vh - 40px);background: #ddd;margin: 20px;">
<div class="container" style="text-align:right;min-height: 50vh;    background: #fff;box-shadow: 12px 12px 7px rgba(0, 0, 0, 0.13);padding: 30px;">
${result}
<div>
</body>
</html>`);





});

app.get('/clear' , function (req, res) {
products.length = 0; //product是個陣列，讓他長度變0就是清空這個陣列的內容
id.length = 0;
total=0
price.length=0;
finalnumber=0;
res.send('清空了');



});

const PORT = process.env.PORT || 8080;
app.listen(PORT, function () {
console.log(`Example app listening on port ${PORT}!`);
}); //他運行在port3000 這樣的話就要寫localhost:3000
