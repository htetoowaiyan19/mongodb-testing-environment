# MongoDB - Learn Directly
## Chapter 0: Introduction

### What is MongoDB

- MongoDB ဆိုတာ Document-Based Database တစ်ခုဖြစ်ပီး Data တွေကို Collections တွေမှာ Document အနေနဲ့သိမ်းပါတယ်။
- MongoDB နဲ့ MySQL တို့ရဲ့ကွာခြားချက်ကတော့ MongoDB က NoSQL Database ဖြစ်ပြီးတော့ MySQL ကတော့ SQL Database ဖြစ်ပါတယ်။
- NoSQL နဲံ SQL ကွာခြားချက်များကတော့ အောက်မှာ ဖော်ပြပေးထားပါတယ်။

| SQL (MySQL) | NoSQL (MongoDB) |
| ----------- | ----------- |
| Tables | Collection |
| Rows | Documents |
| Columns | Fields |

### Document Structure

- MongoDB က Document တွေကို JSON-like format နဲ့သိမ်းပါတယ်။ Document တစ်ခုဆီမှာ Field အများအပြား ပါနိုင်ပြီးတော့ Field တစ်ခုမှာ data သိမ်းရန် `key` ဆိုတဲ့ အခန်းလေးနဲ့ သိမ်းမဲ့ data တန်ဖိုး `value` ဆိုပြီး နှစ်ခုပါရှိပါတယ်။ ဥပမာအနေနဲ့ အောက်က Document ပုံစံလေးတစ်ခုကိုလေ့လာကြည့်ရအောင် -

```json
{"greeting": "Hello, world!"}
```

- ဒါလေးကတော့ Data သိမ်းထားတဲ့ field တစ်ခုပါ။ ဒီ field ထဲမှာ `"gretting"` ဆိုတာလေးက `key` လေးဖြစ်ပြီးတော့ `"Hello, world!"` ဆိုတာလေးကတော့ သိမ်းထားတဲ့ data `value` လေးဖြစ်ပါတယ်။ လက်တွေ့မှာတော့ ဒီထပ်ပိုများတဲ့ field တွေအများအပြားတွေ့ရမှာ ဖြစ်ပါတယ်။

```json
{"greeting": "Hello, world!", "foo": 3}
```

- အခုထည့်လိုက်တာလေးကတော့ `"foo"` ဆိုတဲ့ field အသစ်လေးကို ထည့်လိုက်တာ ဖြစ်ပါတယ်။ အခုဆိုရင် လက်ရှိ document လေးမှာ field နှစ်ခုပါဝင်လာပါပြီ။

- Quick Question: အပေါကပြထားတဲ့ Document ထဲက field လေးတွေက ဘာတွေလဲ။

### Embedded Documents

- Collection ထဲမှာ Document တွေကို တစ်ခြား Document တွေထဲထည့်ပြီး သိမ်းလို့ရပါတယ်ိ။ ဒါကြောင့် Document တွေကိုလဲ `value` တစ်ခုအနေနဲ့သက်မှတ်ပြီး `key` တစ်ခုထဲထည့်ပြီး သိမ်းနိုင်ပါတယ်။

```json
{
    "name": "Kyaw Kyaw",
    "address": {
        "street": "123 Park Street",
        "city": "Yangon",
        "state": "YGN"
    }
}
```

- အပေါမှာဖော်ပြထားတဲ့ document လေးရဲ့ `address` field ထဲမှာ အဲ့ဒီ `address` ကိုအသေးစိတ်ဖော်ပြတဲ့ document လေးထည့်ထားတာကို တွေ့ရမှာဖြစ်ပါတယ်။ မြင်သာအောင် အောက်မှာ ထပ်မံဖော်ပြပေးထားပါတယ်။

```json
{"street": "123 Park Street", "city": "Yangon", "state": "YGN"}
```

REF - Chapter 2: Getting Started, from "MongoDB: The Definitive Guide, Second Edition", by Kristina Chodorow

## Chapter 1: CRUD: Create, Read, Update, Delete

### Inserting and Saving Documents (CREATE)
- Documents တွေထဲကို data ထည့်ချင်တဲ့အခါ `insert(object)` နဲ့ထည့်ရပါတယ်။

```js
> db.foo.insert({"bar": "baz"})
```

### Batch Insert
- Data တစ်ခုတည်းကို ခဏခဏ ထည့်မနေဘဲ Data အစုလိုက်ကိုတစ်ခါတည်းထည့်ချင်ရင် `batchInsert(objects[])` ကိုသုံးရပါတယ်။

```js
> db.foo.batchInsert([{"_id": 0}, {"_id": 1}, {"_id": 2}])
```

### Reading Documents (READ)

- MongoDB ထဲက Data တွေကို Query ပြန်ထုတ်ချင်တယ်ဆိုရင် `find()` (သို့မဟုတ်) `findOne()` keywords တွေကိုအသုံးပြုနိုင်ပါတယ်။
- `find()` keyword က collection ထဲက data အားလုံးကိုတစ်ခါတည်း ထုတ်ပြနိုင်တာဖြစ်ပြီး `findOne()` ကတော့ collection ထဲက data တစ်ခုကိုရွေးပြီး ထုတ်ပြနိုင်ပါတယ်။

```json
> db.blog.find()
{
    "_id": ObjectId("5037ee4a1084eb3ffeef7228"),
    "title": "My Blog Post",
    "content": "Here's my blog post.",
    "date": ISODate("2012-08-24T21:12:09.982Z")
}
```

### Removing Documents (DELETE)
- Document တစ်ခုကိုဖျက်ချင်တဲ့အခါမှာတော့ `remove(object)` keyword လေးကိုအသုံးပြုပြီးဖျက်လို့ရပါတယ်။

```js
> db.mailing.list.remove({"opt-out": true})
```

- Document တစ်ခုကိုဖျက်ပြီးတဲ့အခါ ဖျက်ပြီးသား data ကို ဘယ်နည်းနဲ့မှ ပြန်သုံးလို့မရနိုင်ပါ။

### Updating Documents (UPDATE)

- Document တစ်ခုကို modify/update လုပ်မယ်ဆိုရင်တော့ Document ရဲ့ fields များကို အောက်ပါ example အတိုင်း assign ပြန်လုပ်ပြီး `update()` keyword နဲ့ update လုပ်နိုင်ပါတယ်။
- `joe` ဆိုတဲ့လူတစ်ယောက်ရဲ့ friends နဲ့ enemies တွေကို Document တစ်ခုအနေနဲ့သိမ်းထားတယ်ဆိုပါစို့ -

```json
{
    "_id" : ObjectId("4b2b9f67a1f631733d917a7a"),
    "name" : "joe",
    "friends" : 32,
    "enemies" : 2
}
```

- အဲ့ဒီ Document လေးထဲက `"friends"` နဲ့ `"enemies"` fields တွေကို `"relationships` ဆိုတဲ့ ဆက်သွယ်ချက် field လေးထဲထည့်ချင်ရင် အောက်ပါအတိုင်း ထည့်နိုင်ပါတယ်။

```js
> var joe = db.users.findOne({"name": "joe"});
> joe.relationships = {"friends": joe.friends, "enemies": joe.enemies};
{
    "friends": 32,
    "enemies": 2
}
> joe.username = joe.name;
"joe"
> delete joe.friends;
true
> delete joe.enemies;
true
> delete joe.name;
true
> db.users.update({"name": "joe"});
```

- ဒီနည်းကတော့ Document တစ်ခုလုံးကို replace လုပ်လိုက်သလိုဖြစ်ပါတယ်။ `findOne()` နဲ့ခေါ်ကြည့်ရင် အောက်ပါ Document အသစ်ပုံစံ ထွက်လာပါလိမ့်မယ် -

```json
{
    "_id" : ObjectId("4b2b9f67a1f631733d917a7a"),
    "username" : "joe",
    "relationships" : {
        "friends" : 32,
        "enemies" : 2
    }
}
```

- ပထမဆုံး အနေနဲ့ `joe` ဆိုတဲ့ variable ထဲကို joe ရဲ့ document တစ်ခုလုံး သိမ်းလိုက်ပါတယ်။

```js
> var joe = db.users.findOne({"name": "joe"});
```

- joe ထဲကို document ဝင်သွားတဲ့နောက်မှာ `joe.relationships` ဆိုတဲ့ field တစ်ခုဆောက်ပြီး joe ရဲ့ friends နဲ့ enemies တွေကို embedded document အနေနဲ့ အဲ့ field ထဲ ထည့်သိမ်းလိုက်ပါတယ်။

```js
> joe.relationships = {"friends": joe.friends, "enemies": joe.enemies};
```

- ဆက်လက်ပြီးတော့ `username` ဆိုတဲ့ field အသစ်လေးထဲကို joe ရဲ့ အရင် name ကို ထည့်ပေးလိုက်ပါတယ်။

```js
> joe.username = joe.name;
```

- အဲ့ဒီနောက် joe ရဲ့ အရင် field အဟောင်းများကို ဖျက်လိုက်ပါတယ်။

```js
> delete joe.friends;
> delete joe.enemies;
> delete joe.name;
```

- နောက်ဆုံးမှာတော့ database ထဲက joe document ကို `update()` keyword သုံးပြီး အပေါမှာ အသစ်ဆောက်ထားတဲ့ variable ထဲက joe နဲ့ replace လုပ်လိုက်တာဖြစ်ပါတယ်။

```js
> db.users.update({"name": "joe"});
```

- `update(queryRequest, updateData)` ရဲ့ parameters တွေကတော့ `queryRequest` က database ထဲက document ကို query ယူဖို့ထောက်တဲ့ field ဖြစ်ပြီးတော့ `updateData` ကတော့ အဲ့ ထောက်ထားတဲ့ document ကို update လုပ်မဲ့ data ဖြစ်ပါတယ်။

### `$set` Modifier

- `$set` modifer ကို document တစ်ခုရဲ့ field ထဲက value တစ်ခုကို ပြောင်းချင်လို့ပဲဖြစ်ဖြစ် field အသစ်ထည့်ချင်လို့ပဲဖြစ်ဖြစ် document တစ်ခုလုံးကို replace မလုပ်ပဲ update ချင်ရင် သုံးနိုင်ပါတယ်။ အောက်က document လေးကိုလေ့လာကြည့်ရအောင် -

```json
> db.users.findOne()
{
    "_id" : ObjectId("4b253b067525f35f94b60a31"),
    "name" : "joe",
    "age" : 30,
    "sex" : "male",
    "location" : "Wisconsin"
}
```

- joe က သူ့ရဲ့ အကြိုက်ဆုံး စာအုပ် `favorite book` ကို သူ့ document ထဲသိမ်ချင်တယ်ဆိုရင် အောက်ပါအတိုင်း သိမ်းနိုင်ပါတယ်။

```js
> db.users.update({"_id": ObjectId("4b253b067525f35f94b60a31")}, {"$set": {"favorite book": "War and Peace"}})
```

- အခုဆိုရင် joe ရဲ့ document လေးက အောက်ပါအတိုင်း ဖြစ်သွားပါပြီ။

```json
> db.users.findOne()
{
    "_id" : ObjectId("4b253b067525f35f94b60a31"),
    "name" : "joe",
    "age" : 30,
    "sex" : "male",
    "location" : "Wisconsin",
    "favorite book" : "War and Peace"
}
```

- joe ကစိတ်ပြောင်းပြီး စာအုပ်နောက်တစ်အုပ်ကို ကြိုက်တယ်ဆိုပါစို့၊ ဒါဆို `favorite book` လေးကို `$set` modifier သုံးပြီး တန်ဖိုးလေးပြောင်းကြည့်ရအောင် -

```js
> db.users.update({"name": "joe"}, {"$set": {"favorite book": "Green Eggs and Ham"}})
```

- ဒါဆိုရင်တော့ joe ရဲ့ `favorite book` က `Green Eggs and Ham` ဖြစ်သွားပါပြီ။
- အကယ်၍ joe ကဘာစာအုပ်မှ မကြိုက်တော့ဘူးဆိုရင်တော့ `$unset` modifier ကိုသုံးပြီး `favorite book` ဆိုတဲ့ field တစ်ခုလုံးကို ပြန်ဖျက်လို့ရပါတယ်။

```js
> db.users.update({"name": "joe"}, {"$unset": {"favorite book": 1}})
```

- ဒါဆိုရင်တော့ document က အပေါ်ဆုံးက example အတိုင်းပြန်ဖြစ်သွားပါပြီ။
- ဒါ့အပြင် `$set` ကိုအသုံးပြုပြီး embedded document တွေထဲက field တွေကိုပါသွား change နိုင်ပါတယ်။

```json
> db.blog.posts.findOne()
{
    "_id" : ObjectId("4b253b067525f35f94b60a31"),
    "title" : "A Blog Post",
    "content" : "...",
    "author" : {
        "name" : "joe",
        "email" : "joe@example.com"
    }
}
> db.blog.posts.update({"author.name": "joe"}, {"$set": {"author.name": "joe schmoe"}})
> db.blog.posts.findOne()
{
    "_id" : ObjectId("4b253b067525f35f94b60a31"),
    "title" : "A Blog Post",
    "content" : "...",
    "author" : {
        "name" : "joe schmoe",
        "email" : "joe@example.com"
    }
}
```

- ဒီ example မှာဆိုရင် `.` operator ကိုသုံးပြီး "ထဲက" လို့ရည်ညွန်းထားပါတယ်။ `author.name` ဆိုရင် `author` "ထဲက" `name` ကိုရည်ညွန်းပါတယ်။

### `$inc` Modifier

- `$inc` modifier ကို field တစ်ခုခုရဲ့ value တိုးချင်တဲ့နေရာမှာ သုံးနိုင်ပါတယ်။ ဥပမာ joe က pinball ဂိမ်းတစ်ခု‌ဆော့နေတယ်ဆိုပါစို့ -

```js
> db.games.insert({"game": "pinball", "user": "joe"})
```

- သူက ဆော့နေရင်းနဲ့ score 50 ရတဲ့ အပေါက်ထဲ pinball ဝင်သွားရင် သူ score 50 ရမှာဖြစ်ပါတယ်။ ဒါကြောင့် သူ့ document ထဲမှာ သူ score 50 ရကြောင်း update တင်ချင်ရင် `$inc` နဲ့တင်နိုင်ပါတယ်။

```js
> db.games.update({"game": "pinball", "user": "joe"}, {"$inc": {"score": 50}})
```

- ဒါဆိုသူ့ document လေးမှာ `score` ဆိုတဲ့ field လေးပါဝင်လာမှာပါ။

```json
> db.games.findOne()
{
    "game": "pinball",
    "user": "joe",
    "score": 50
}
```

- joe ကဆက်လက် ဆော့နေရင်း pinball က jackpot အပေါက်ထဲဝင်သွားပြီး point 10000 ရသွားတယဆိုပါစို့၊ ဒါဆိုဘယ်လိုရေးမလဲ? ခုနရှိထားတဲ့ `score` field ကိုပဲ point 10000 ပေါင်းထည့်ဖို့ `$inc` ကိုသုံးရမှာဖြစ်ပါတယ်။

```js
> db.games.update({"game": "pinball", "user": "joe"}, {"$inc": {"score": 10000}})
```

- ဒါဆိုရင်တော့ joe က score စုစုပေါင်း 10050 ရသွားမှာဖြစ်ပါတယ်။

```json
> db.games.find()
{
    "_id" : ObjectId("4b2d75476cc613d5ee930164"),
    "game" : "pinball",
    "user" : "joe",
    "score" : 10050
}
```

- မှတ်ချက်၊ `$inc` modifier ကို နံပါတ်ပါသော (ဖြစ်သော) integer, long, double data types များတွင်သာ အသုံးပြုနိုင်ပါတယ်။

### Array Modifiers

- Array ဆိုတာကတော့ အားလုံးနီးပါး သိကြတဲ့အတိုင်း data တစ်ခုမက သိမ်းနိုင်တဲ့ fields တွေဖြစ်ပါတယ်။ Array တွေကို MongoDB မှာ ထောင့်ကွင်း [] နဲ့ပဲသိမ်းနိုင်ပါတယ်။

```json
{
    "subjects": ["networking", "programming", "data structure"]
}
```

### Adding Elements (`$push` Modifier)

- `$push` modifier က array ရှိနေရင် အဲ့ array ထဲကို value ထပ်ထည့်မှာဖြစ်ပြီး array မရှိပါက array တစ်ခုဆောက်ပေးမှာ ဖြစ်ပါတယ်။

```json
db.blog.posts.findOne()
{
    "_id": ObjectId("4b2d75476cc613d5ee930164"),
    "title": "A blog post",
    "content": "..."
}
```

- ဒီ document လေးထဲကို `comments` ဆိုတဲ့ array လေးတစ်ခု ထည့်ကြည့်ရအောင်။

```json
> db.blog.posts.update({"title": "A blog post"},
    {"$push": {"comments":
        {"name": "joe", "email": "joe@example.com", "content": "nice post."}}})
```

- array လေးထည့်ပြီးရင်တော့ အောက်ပါအတိုင်း ပြန်ထွက်လာမှာ ဖြစ်ပါတယ်။

```json
> db.blog.posts.findOne()
{
    "_id" : ObjectId("4b2d75476cc613d5ee930164"),
    "title" : "A blog post",
    "content" : "...",
    "comments" : [
        {
            "name" : "joe",
            "email" : "joe@example.com",
            "content" : "nice post."
        }
    ]
}
```

- ဒီထဲကိုပဲ နောက် comment တစ်ခုလောက် ထပ်ထည့်မယ်ဆိုရင် -

```json
> db.blog.posts.update({"title": "A blog post"},
    {"$push": {"comments":
        {"name": "bob", "email": "bob@example.com", "content": "good post."}}})
```

- ဒါဆိုရင်တော့ အောက်ပါအတိုင်း value လေးနှစ်ခု သိမ်းပေးသွားမှာဖြစ်ပါတယ်။

```json
> db.blog.posts.findOne()
{
    "_id" : ObjectId("4b2d75476cc613d5ee930164"),
    "title" : "A blog post",
    "content" : "...",
    "comments" : [
        {
            "name" : "joe",
            "email" : "joe@example.com",
            "content" : "nice post."
        },
        {
            "name" : "bob",
            "email" : "bob@example.com",
            "content" : "good post."
        }
    ]
}
```

### `$each` Suboperator (Submodifier)

- Array ထဲကို operation တစ်ခုထဲနဲ့ value အများကြီးထည့်ချင်ရင် `$each` suboperator ကိုသုံးနိုင်ပါတယ်။

```js
> db.stock.ticker.update({"_id": "GOOG"}, {"$push":
    {"hourly": {"$each": [562.776, 562.790, 559.123]}}
})
```

- ဒါဆိုရင်တော့ အောက်ပါအတိုင်း သိမ်းပေးမှာဖြစ်ပါတယ်။

```json
{
    "hourly": [562.776, 562.790, 559.123]
}
```

### `$slice` Modifier

- Array တစ်ခုကို size limit တစ်ခုထားချင်ရင် `$slice` ကိုသုံးနိုင်ပါတယ်။ ဒါဆို အဲ့ဒီ array က `$push` သုံးတဲ့အခါမှာ အဲ့ limit ထက်ကျော်ပြီး ထည့်မရအောင် ပိတ်ထားနိုင်ပါတယ်။

```js
> db.movies.find({"genre": "horror"}, {"$push": {"top10": {
    "$each": ["Nightmare on Elm Street", "Saw"],
    "$slice": -10}}})
```

- `top10` ဆိုတဲ့အတိုင်း `top10` array က ၁၀ ခုထက်မကျော်အောင် `$slice` နဲ့ limit ထားပါတယ်။ limit တန်ဖိုးက အမြဲ negative value ဖြစ်ရပါမယ်။

### `$sort` Modifier

- To be continued...

REF - Chapter 3: Creating, Updating, and Deleting Documents, from "MongoDB: The Definitive Guide, Second Edition", by Kristina Chodorow