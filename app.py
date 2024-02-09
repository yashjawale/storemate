from flask import Flask, render_template, request, redirect, jsonify
from cs50 import SQL
import time

app = Flask(__name__)

db = SQL("sqlite:///shop.db")

@app.route("/")
def index():
    orders = db.execute("SELECT * FROM orders ORDER BY timestamp DESC LIMIT 10;")
    return render_template("index.html", orders=orders)

@app.route("/neworder")
def neworder():
    return render_template("neworder.html")

@app.route("/search")
def search():
    return render_template("search.html")

@app.route("/inventory", methods=["GET", "POST"])
def inventory():
    if (request.method == "GET"):
        items = db.execute("SELECT * FROM items;")
        return render_template("inventory.html", items=items)

    if (request.method == "POST"):
        item_code = request.form.get("item-code")
        item_name = request.form.get("item-name")
        item_quantity = int(request.form.get("item-quantity"))
        item_price = float(request.form.get("item-price"))
        # Enter into database
        print(item_name, item_quantity, item_price, item_code)
        db.execute("INSERT INTO items (item_code, item_name, item_quantity, item_price) VALUES (?, ?, ?, ?);", item_code, item_name, item_quantity, item_price)
        return redirect("/inventory")

# Returns a random 10 digit order number based on time
def get_order_number():
    import time
    return int(time.time())
    
@app.route("/addorder", methods=["POST"])
def addorder():
    data = request.get_json()
    customer_name = data['customerName']
    customer_mobile = data['customerMobile']
    total_amount = data['totalAmount']
    items = data['items']
    order_number = get_order_number()
    db.execute("INSERT INTO orders (order_id, customer_name, customer_phone, order_total) VALUES (?, ?, ?, ?);", order_number, customer_name, customer_mobile, total_amount)
    for item in items:
        price = float(db.execute("SELECT item_price from items WHERE item_code = ?;", item['itemCode'])[0]["item_price"])
        db.execute("INSERT INTO records (order_id, item_code, item_quantity, effective_price ) VALUES (?, ? , ?, ?);", order_number, item['itemCode'], item['quantity'], price * int(item['quantity']))
        db.execute("UPDATE items SET item_quantity = item_quantity - ? WHERE item_code = ?;", item['quantity'], item['itemCode'])
    return redirect("/")

@app.route("/getitem", methods=["GET"])
def getitem():
    item_code = request.args.get('id')
    print(item_code)
    items = db.execute("SELECT * FROM items WHERE item_code = ? ;", item_code)
    return jsonify(items)
