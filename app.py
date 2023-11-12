from flask import Flask, render_template, request, redirect, jsonify
from cs50 import SQL

app = Flask(__name__)

db = SQL("sqlite:///shop.db")

@app.route("/")
def index():
    return render_template("index.html")

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

@app.route("/getitem", methods=["GET"])
def getitem():
    item_code = request.args.get('id')
    print(item_code)
    items = db.execute("SELECT * FROM items WHERE item_code = ? ;", item_code)
    return jsonify(items)
