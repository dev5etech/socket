var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'mysql',
  database: 'pillivery'
});


app.get('/', function(req, res) {
   res.sendfile('index.html');
});

response = { 'success': 0, 'order_data': 'sasa' };

io.on('connection', function(socket) {

  socket.on('get_biker_order_connect', function(data) {
    
      connection.connect(function () {

        var sql = "SELECT tbl_user.id as user_id,	tbl_user.address,		tbl_user.biker_location, tbl_user.email,			tbl_user.firstname,	tbl_user.lastname,		tbl_user.gender, tbl_user.gmail,			tbl_user.image, 	tbl_user.is_biker,			tbl_user.is_online,		tbl_user.lastname,			tbl_user.mobile_phone,	tbl_user.phone, 	tbl_order.id as order_id,	tbl_order.address_id,			tbl_order.orderID as orderID, tbl_order.added_on as order_date,		tbl_address.id as address_id, tbl_address.name,			tbl_address.address, tbl_address.landmark,			tbl_address.locality,tbl_address.city,			tbl_address.pincode, tbl_address.phone,			GROUP_CONCAT(tbl_cart.id) as item_id,			GROUP_CONCAT(tbl_cart.price) as item_price,			GROUP_CONCAT(tbl_cart.qty) as item_qty,			GROUP_CONCAT(tbl_cart.amount) as item_amount,			GROUP_CONCAT(tbl_cart.added_on) as item_date,			GROUP_CONCAT(tbl_product.name) as item_name,			GROUP_CONCAT(tbl_product.image) as item_image			FROM tbl_user 	JOIN tbl_order ON tbl_order.biker_assign = tbl_user.id			JOIN tbl_address ON tbl_address.id = tbl_order.address_id	JOIN tbl_cart ON tbl_cart.order_id = tbl_order.id			JOIN tbl_product ON tbl_product.id = tbl_cart.product_id			WHERE 		tbl_user.is_biker = 1 AND	 	tbl_user.is_online = 1 AND tbl_user.is_running = 0 AND	tbl_order.biker_assign = " + data.biker_id;
        connection.query(sql, function (err, result) {
          
          if (result[0].user_id == null || result[0].user_id){
            
            response.success = 0;

          }else{

            response.success = 1;
            response.order_data = result[0];

          }

          io.sockets.emit('get_biker_order_data', response);
          
        });

        // var sql = "SELECT tbl_cart.id as item_id, tbl_cart.price, tbl_cart.qty, tbl_cart.amount, tbl_cart.added_on as item_date, tbl_product.name as product_name,tbl_product.image, tbl_product.sprice as product_price  FROM tbl_cart JOIN tbl_product ON tbl_product.id = tbl_cart.product_id WHERE tbl_cart.order_id = $order_id";
        // connection.query(sql, function (err, result) {
        //   users.push(['order_item_data', result]);
        // });

      });

   });

});



http.listen(3000, function() {
   console.log('listening on localhost:3000');
});
