const express = require('express');
const router = express.Router();
const sql = require('mssql');
const moment = require('moment');

router.get('/', async function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');

	// TODO: Get order id
    const orderId = req.query.orderId;

	// TODO: Check if valid order id
	if(!orderId){
        res.write('Invalid order id or no items in order.');
        res.end();
        return;
    }


        try {
            let pool = await sql.connect(dbConfig);
            const transaction=new sql.Transaction(pool);
            await transaction.begin();
           // TODO: Start a transaction
        
	   	// TODO: Retrieve all items in order with given id
            try{
                const orderProductsQuery=`
                SELECT op.productId, op.quantity, pi.quantity AS availableQuantity
                FROM orderproduct op JOIN productinventory pi ON op.productId=pi.productid
                WHERE op.orderId=@orderId and pi.warehouseId=1
                `;

                const orderProducts=await transaction.request()
                .input('orderId', sql.Int, orderId)
                .query(orderProductsQuery);

                if(orderProducts.recordset.length===0){
                    res.write("Invalid order id or no items in order");
                    await transaction.rollback();
                    res.end();
                    return;
                }
// Check inventory and collect insufficient items
let insufficientItems = [];
for (const item of orderProducts.recordset) {
    if (item.quantity > item.availableQuantity) {
        insufficientItems.push({
            productId: item.productId,
            requiredQuantity: item.quantity,
            availableQuantity: item.availableQuantity,
        });
    }
}

if (insufficientItems.length > 0) {
    res.write(` <html>
        <head>
            <title>Shipment Success</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                background-color: #E8F5E9;
                }
                h1 {
                    color: #2E7D32;
                }
            </style></head><body>`);

    res.write('<h1 style="text-align: center;">Urban Harvest</h1>');

    res.write('<h2>Shipment Details:</h2>');
    orderProducts.recordset.forEach((item) => {
        const previousInventory = item.availableQuantity;
        const newInventory = previousInventory - item.quantity > 0 ? previousInventory - item.quantity : 'N/A';
        res.write(`<p>Ordered product id: ${item.productId} Qty: ${item.quantity} Previous inventory: ${previousInventory} New inventory: ${newInventory}</p>`);
    });

    res.write('<h2 style="color: red;">Shipment not done. Insufficient inventory for the following products:</h2>');
    insufficientItems.forEach(item => {
        res.write(`<p>Product ID: ${item.productId}, Required: ${item.requiredQuantity}, Available: ${item.availableQuantity}</p>`);
    });

    res.write('<p><a href="/">Back to Main Page</a></p>');
    res.write('</body></html>');
    await transaction.rollback();
    res.end();
    return;
}

const shipmentDate = moment().format('YYYY-MM-DD HH:mm:ss');
            const shipmentDesc = `Shipment for Order ID ${orderId}`;
            const shipmentQuery = `
                INSERT INTO shipment (shipmentDate, shipmentDesc, warehouseId)
                OUTPUT INSERTED.shipmentId
                VALUES (@shipmentDate, @shipmentDesc, 1)
            `;
            const shipmentResult = await transaction.request()
                .input('shipmentDate', sql.DateTime, shipmentDate)
                .input('shipmentDesc', sql.VarChar, shipmentDesc)
                .query(shipmentQuery);

            const shipmentId = shipmentResult.recordset[0].shipmentId;

            // Update inventory for each item
            for (const item of orderProducts.recordset) {
                const updateInventoryQuery = `
                    UPDATE productinventory
                    SET quantity = quantity - @quantity
                    WHERE productId = @productId AND warehouseId = 1
                `;
                await transaction.request()
                    .input('quantity', sql.Int, item.quantity)
                    .input('productId', sql.Int, item.productId)
                    .query(updateInventoryQuery);
            }

            await transaction.commit();

            // Prepare the HTML response for successful shipment
        res.write(` <html>
        <head>
            <title>Shipment Success</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                background-color: #E8F5E9;
                }
                h1 {
                    color: #2E7D32;
                }
            </style></head><body>`);
            res.write('<h1 style="text-align: center;">Urban Harvest</h1>');
            
            res.write('<h2>Shipment Details:</h2>');
            orderProducts.recordset.forEach((item) => {
                const previousInventory = item.availableQuantity;
                const newInventory = item.availableQuantity - item.quantity;
                res.write(`<p>Ordered product id: ${item.productId} Qty: ${item.quantity} Previous inventory: ${previousInventory} New inventory: ${newInventory}</p>`);
            });
            
            res.write('<h2 style="color: green;">Shipment successfully processed.</h2>');
            res.write('<p><a href="/">Back to Main Page</a></p>');
            res.write('</body></html>');
            res.end();
            



            }catch (err) {
                await transaction.rollback();
                res.write(`Transaction failed. Error: ${err}`);
                res.end();
	   	// TODO: Create a new shipment record.
	   	// TODO: For each item verify sufficient quantity available in warehouse 1.
	   	// TODO: If any item does not have sufficient inventory, cancel transaction and rollback. Otherwise, update inventory for each item.
	   		} }catch (err) {
                res.write(`Database connection failed. Error: ${err}`);
                res.end();
            }});


module.exports = router;
