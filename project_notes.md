## MEAN Stack

- Mongodb

  - NoSQL

  - Documents, collections

  - app data

  - no schema or relations, unstrucuted database

    

- Express.js

  - node.js framework

  - middleware-based: funnedl req through func

  - includes routing, view-rendering

    

- Angular

  - js on client side (browser)

  - popular for single pge application (like mobile experience)

  - index.html import angular => angular re-renders index.html

    

    

- Node.js

  - server side library, js on server side 
  - listen to req and send  res
  - server side logic
  - interact with database and files



![image-20191103203407488](/Users/zhiweixu/Library/Application Support/typora-user-images/image-20191103203407488.png)



We shall never connect mongodb from the Angular or the frontend as it is extremly dangerous which will expose the data at the client browser.



Two ways of connecting Node + Angular:

- Node app serves Angular SPA
  - node handles incoming requests
  - special route '/' to return angular spa
- Two seperate servers
  - Node handles incoming requests
  - Nginx return angular spa



CORS:

Cross Origin Resource Sharing

Client and Server running on different port



use body-parser to extract post data

## MongoDB

A NoSQL database that stores "Documents" in "Collections"

(instead of "Records" in "Tables" in SQL)

Features

- Store Application Data
- Enforces no Data Schema or Relations
- Easily connected to Node/Express



#### NoSQL vs SQL

| NoSQL                                                      | SQL                                                      |
| ---------------------------------------------------------- | -------------------------------------------------------- |
| MongoDB                                                    | MySQL                                                    |
| Enforce no data schema (records with different structures) | Enforces a Strict Data Schema                            |
| Less Focused on Relations                                  | Relations are a Core Feature                             |
| "Independent Documents"                                    | Records are Related                                      |
| Logs, Orders, (Chat) Messages                              | Shopping Carts, Contacts, Social Networks, DealerShip :) |
|                                                            |                                                          |

documents => Natural way to store and fetch data:

- store new records with new added fields while old records remains

- can create relations by storing the id of one document in another document

- NoSQL therefore great for data where the structure might vary





Two reason to use the MongoDB (NoSQL)

- large throughput (fast to query no joins)

  For app with a lot of read actions, more effient

- stored in a structure looks like json, easy to work with



[Download the mongodb](https://treehouse.github.io/installation-guides/mac/mongo-mac.html)

Local or Cloud? (mLab is now merged to mongodb Atlas )



Cluster: a combination of multiple servers so that the db is horizontally scaled

https://cloud.mongodb.com/



user: zhiwei

password: SDmTgvOIt6jAscuO



MongoDB stores BSON documents

> A binary representation of JSON documents

```js
var mydoc = {
               _id: ObjectId("5099803df3f4948bd2f98391"),
               name: { first: "Alan", last: "Turing" },
               birth: new Date('Jun 23, 1912'),
               death: new Date('Jun 07, 1954'),
               contribs: [ "Turing machine", "Turing test", "Turingery" ],
               views : NumberLong(1250000)
            }
```



### How to query them on the local shell?

Can Download locally => new Project => new Cluster => see username and password 

=> connect using local shell

```
# show database
db

use inventory
db

show dbs
# no examples database cuz it only created when you first store data in this database
```



### CRUD Operations

Create:

```sql
db.inventory.insertMany([
   { _id: 10, item: "jou", qty: 25, status: "A", size: { h: 14, w: 21, uom: "cm" }, tags: [ "blank", "red" ] },
   { item: "notebook", qty: 50, status: "A", size: { h: 8.5, w: 11, uom: "in" }, tags: [ "red", "blank" ] },
   { item: "paper", qty: 10, status: "D", size: { h: 8.5, w: 11, uom: "in" }, tags: [ "red", "blank", "plain" ] },
   { item: "planner", qty: 0, status: "D", size: { h: 22.85, w: 30, uom: "cm" }, tags: [ "blank", "red" ] },
   { item: "postcard", qty: 45, status: "A", size: { h: 10, w: 15.25, uom: "cm" }, tags: [ "blue" ] }
]);

```

Read

> db.collection.find (**query**, **projection**)

```sql
db.inventory.find()
# format results
db.inventory.find().pretty()

# add condition filters
db.inventory.find( { status: "D" } );
db.inventory.find( { qty: 0, status: "D" } );

# how do we select specific fields to return?
db.collection.find(query, projection)
<field>: 1 to include a field in the returned documents
<field>: 0 to exclude a field in the returned documents
db.inventory.find( {}, { item: 1, status: 1 } );
db.inventory.find( {}, { _id: 0, item: 1, status: 1 } );
```



Update

```sql
db.inventory.updateOne(
   { item: "paper" },
   {
     $set: { "size.uom": "cm", status: "P" },
     $currentDate: { lastModified: true }
   }
)
# here update the document whose item is "paper"
# $set, 
# $currentdate will update (create if not exist) the lastModified field to current date
# notice that we can have a collections of documents with **different fields**

```



```sql
replace the entire content of a doc
with same _id as the _id is immutable (always the first field)

db.inventory.replaceOne(
   { item: "paper" },
   { item: "paper", instock: [ { warehouse: "A", qty: 60 }, { warehouse: "B", qty: 40 } ] }
)
```



Delete

```sql
# delete all
db.inventory.deleteMany({})
# add filter
db.inventory.deleteMany({ status : "A" })
or
db.inventory.deleteMany({ status : "A" })
# delete the first doc with status "D"
db.inventory.deleteOne( { status: "D" } )
```



### How is it "joined" for query across collections?

```sql
{
   $lookup:
     {
       from: <collection to join>,
       localField: <field from the input documents>,
       foreignField: <field from the documents of the "from" collection>,
       as: <output array field>
     }
}

db.orders.insert([
   { "_id" : 1, "item" : "almonds", "price" : 12, "quantity" : 2 },
   { "_id" : 2, "item" : "pecans", "price" : 20, "quantity" : 1 }
])

db.items.insert([
  { "_id" : 1, "item" : "almonds", description: "almond clusters", "instock" : 120 },
  { "_id" : 2, "item" : "bread", description: "raisin and nut bread", "instock" : 80 },
  { "_id" : 3, "item" : "pecans", description: "candied pecans", "instock" : 60 }
])

db.orders.aggregate([
   {
      $lookup: {
         from: "items",
         localField: "item",    // field in the orders collection
         foreignField: "item",  // field in the items collection
         as: "fromItems"
      }
   },
   {
      $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$fromItems", 0 ] }, "$$ROOT" ] } }
   },
   { $project: { fromItems: 0 } }
]).pretty()

select orders.*, items.description, items.instock from orders join items
on orders.item = items.item
```



### Stored Procedure in MongoDB

```
db.system.js.save({_id: "sum",
...                  value: function (x, y) { return x + y; }});
db.eval("return sum(2, 3);");
```



### Index Support Text Search

```
any field whose value is a string or an arrray  of strings
one collection => one text search index => many fields

db.stores.insert(
   [
     { _id: 1, name: "Java Hut", description: "Coffee and cakes" },
     { _id: 2, name: "Burger Buns", description: "Gourmet hamburgers" },
     { _id: 3, name: "Coffee Shop", description: "Just coffee" },
     { _id: 4, name: "Clothes Clothes Clothes", description: "Discount clothing" },
     { _id: 5, name: "Java Shopping", description: "Indonesian goods" }
   ]
)

db.stores.createIndex( { name: "text", description: "text" } )

#use $text to perform text search on the text index, $search to specify query strings
db.stores.find( { $text: { $search: "java coffee shop" } } )

```



###How it is used in the MEAN stack

Why use mongoose:

straightforward

schema based define how your data look like, easy for store and fetch data

https://mongoosejs.com/



the ids are created by moogose

- show the example before connecting to the cloud db

{
  _id: 5dc91c6b03837a323172adf4,
  title: 'New Post',
  content: 'Hello From Darkness!'
}



Collection: Plural form of the model name

Auto create database

Auto create collections

Post.save(), auto create document



client side routing:

- rerender different component to the page according to different urls

server side routing:

- parse different urls to do data exchange, sending responses and reading requests

















