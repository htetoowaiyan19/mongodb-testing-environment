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

- MongoDB က Document တွေကို jsonON-like format နဲ့သိမ်းပါတယ်။ Document တစ်ခုဆီမှာ Field အများအပြား ပါနိုင်ပြီးတော့ Field တစ်ခုမှာ data သိမ်းရန် `key` ဆိုတဲ့ အခန်းလေးနဲ့ သိမ်းမဲ့ data တန်ဖိုး `value` ဆိုပြီး နှစ်ခုပါရှိပါတယ်။ ဥပမာအနေနဲ့ အောက်က Document ပုံစံလေးတစ်ခုကိုလေ့လာကြည့်ရအောင် -

```jsonon
{"greeting": "Hello, world!"}
```

- ဒါလေးကတော့ Data သိမ်းထားတဲ့ field တစ်ခုပါ။ ဒီ field ထဲမှာ `"gretting"` ဆိုတာလေးက `key` လေးဖြစ်ပြီးတော့ `"Hello, world!"` ဆိုတာလေးကတော့ သိမ်းထားတဲ့ data `value` လေးဖြစ်ပါတယ်။ လက်တွေ့မှာတော့ ဒီထပ်ပိုများတဲ့ field တွေအများအပြားတွေ့ရမှာ ဖြစ်ပါတယ်။

```jsonon
{"greeting": "Hello, world!", "foo": 3}
```

- အခုထည့်လိုက်တာလေးကတော့ `"foo"` ဆိုတဲ့ field အသစ်လေးကို ထည့်လိုက်တာ ဖြစ်ပါတယ်။ အခုဆိုရင် လက်ရှိ document လေးမှာ field နှစ်ခုပါဝင်လာပါပြီ။

- Quick Question: အပေါကပြထားတဲ့ Document ထဲက field လေးတွေက ဘာတွေလဲ။

### Embedded Documents

- Collection ထဲမှာ Document တွေကို တစ်ခြား Document တွေထဲထည့်ပြီး သိမ်းလို့ရပါတယ်ိ။ ဒါကြောင့် Document တွေကိုလဲ `value` တစ်ခုအနေနဲ့သက်မှတ်ပြီး `key` တစ်ခုထဲထည့်ပြီး သိမ်းနိုင်ပါတယ်။

```jsonon
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

```jsonon
{"street": "123 Park Street", "city": "Yangon", "state": "YGN"}
```

REF - Chapter 2: Getting Started, from "MongoDB: The Definitive Guide, Second Edition", by Kristina Chodorow

# PART I INTRODUCTION TO MONGODB
## Chapter 1: CRUD: Create, Read, Update, Delete

### Inserting and Saving Documents (CREATE)
- Documents တွေထဲကို data ထည့်ချင်တဲ့အခါ `insert(object)` နဲ့ထည့်ရပါတယ်။

```json
> db.foo.insert({"bar": "baz"})
```

### Batch Insert
- Data တစ်ခုတည်းကို ခဏခဏ ထည့်မနေဘဲ Data အစုလိုက်ကိုတစ်ခါတည်းထည့်ချင်ရင် `batchInsert(objects[])` ကိုသုံးရပါတယ်။

```json
> db.foo.batchInsert([{"_id": 0}, {"_id": 1}, {"_id": 2}])
```

### Reading Documents (READ)

- MongoDB ထဲက Data တွေကို Query ပြန်ထုတ်ချင်တယ်ဆိုရင် `find()` (သို့မဟုတ်) `findOne()` keywords တွေကိုအသုံးပြုနိုင်ပါတယ်။
- `find()` keyword က collection ထဲက data အားလုံးကိုတစ်ခါတည်း ထုတ်ပြနိုင်တာဖြစ်ပြီး `findOne()` ကတော့ collection ထဲက data တစ်ခုကိုရွေးပြီး ထုတ်ပြနိုင်ပါတယ်။

```jsonon
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

```json
> db.mailing.list.remove({"opt-out": true})
```

- Document တစ်ခုကိုဖျက်ပြီးတဲ့အခါ ဖျက်ပြီးသား data ကို ဘယ်နည်းနဲ့မှ ပြန်သုံးလို့မရနိုင်ပါ။

### Updating Documents (UPDATE)

- Document တစ်ခုကို modify/update လုပ်မယ်ဆိုရင်တော့ Document ရဲ့ fields များကို အောက်ပါ example အတိုင်း assign ပြန်လုပ်ပြီး `update()` keyword နဲ့ update လုပ်နိုင်ပါတယ်။
- `joe` ဆိုတဲ့လူတစ်ယောက်ရဲ့ friends နဲ့ enemies တွေကို Document တစ်ခုအနေနဲ့သိမ်းထားတယ်ဆိုပါစို့ -

```jsonon
{
    "_id" : ObjectId("4b2b9f67a1f631733d917a7a"),
    "name" : "joe",
    "friends" : 32,
    "enemies" : 2
}
```

- အဲ့ဒီ Document လေးထဲက `"friends"` နဲ့ `"enemies"` fields တွေကို `"relationships` ဆိုတဲ့ ဆက်သွယ်ချက် field လေးထဲထည့်ချင်ရင် အောက်ပါအတိုင်း ထည့်နိုင်ပါတယ်။

```json
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

```jsonon
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

```json
> var joe = db.users.findOne({"name": "joe"});
```

- joe ထဲကို document ဝင်သွားတဲ့နောက်မှာ `joe.relationships` ဆိုတဲ့ field တစ်ခုဆောက်ပြီး joe ရဲ့ friends နဲ့ enemies တွေကို embedded document အနေနဲ့ အဲ့ field ထဲ ထည့်သိမ်းလိုက်ပါတယ်။

```json
> joe.relationships = {"friends": joe.friends, "enemies": joe.enemies};
```

- ဆက်လက်ပြီးတော့ `username` ဆိုတဲ့ field အသစ်လေးထဲကို joe ရဲ့ အရင် name ကို ထည့်ပေးလိုက်ပါတယ်။

```json
> joe.username = joe.name;
```

- အဲ့ဒီနောက် joe ရဲ့ အရင် field အဟောင်းများကို ဖျက်လိုက်ပါတယ်။

```json
> delete joe.friends;
> delete joe.enemies;
> delete joe.name;
```

- နောက်ဆုံးမှာတော့ database ထဲက joe document ကို `update()` keyword သုံးပြီး အပေါမှာ အသစ်ဆောက်ထားတဲ့ variable ထဲက joe နဲ့ replace လုပ်လိုက်တာဖြစ်ပါတယ်။

```json
> db.users.update({"name": "joe"});
```

- `update(queryRequest, updateData)` ရဲ့ parameters တွေကတော့ `queryRequest` က database ထဲက document ကို query ယူဖို့ထောက်တဲ့ field ဖြစ်ပြီးတော့ `updateData` ကတော့ အဲ့ ထောက်ထားတဲ့ document ကို update လုပ်မဲ့ data ဖြစ်ပါတယ်။

### `$set` Modifier

- `$set` modifer ကို document တစ်ခုရဲ့ field ထဲက value တစ်ခုကို ပြောင်းချင်လို့ပဲဖြစ်ဖြစ် field အသစ်ထည့်ချင်လို့ပဲဖြစ်ဖြစ် document တစ်ခုလုံးကို replace မလုပ်ပဲ update ချင်ရင် သုံးနိုင်ပါတယ်။ အောက်က document လေးကိုလေ့လာကြည့်ရအောင် -

```jsonon
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

```json
> db.users.update({"_id": ObjectId("4b253b067525f35f94b60a31")}, {"$set": {"favorite book": "War and Peace"}})
```

- အခုဆိုရင် joe ရဲ့ document လေးက အောက်ပါအတိုင်း ဖြစ်သွားပါပြီ။

```jsonon
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

```json
> db.users.update({"name": "joe"}, {"$set": {"favorite book": "Green Eggs and Ham"}})
```

- ဒါဆိုရင်တော့ joe ရဲ့ `favorite book` က `Green Eggs and Ham` ဖြစ်သွားပါပြီ။
- အကယ်၍ joe ကဘာစာအုပ်မှ မကြိုက်တော့ဘူးဆိုရင်တော့ `$unset` modifier ကိုသုံးပြီး `favorite book` ဆိုတဲ့ field တစ်ခုလုံးကို ပြန်ဖျက်လို့ရပါတယ်။

```json
> db.users.update({"name": "joe"}, {"$unset": {"favorite book": 1}})
```

- ဒါဆိုရင်တော့ document က အပေါ်ဆုံးက example အတိုင်းပြန်ဖြစ်သွားပါပြီ။
- ဒါ့အပြင် `$set` ကိုအသုံးပြုပြီး embedded document တွေထဲက field တွေကိုပါသွား change နိုင်ပါတယ်။

```jsonon
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

```json
> db.games.insert({"game": "pinball", "user": "joe"})
```

- သူက ဆော့နေရင်းနဲ့ score 50 ရတဲ့ အပေါက်ထဲ pinball ဝင်သွားရင် သူ score 50 ရမှာဖြစ်ပါတယ်။ ဒါကြောင့် သူ့ document ထဲမှာ သူ score 50 ရကြောင်း update တင်ချင်ရင် `$inc` နဲ့တင်နိုင်ပါတယ်။

```json
> db.games.update({"game": "pinball", "user": "joe"}, {"$inc": {"score": 50}})
```

- ဒါဆိုသူ့ document လေးမှာ `score` ဆိုတဲ့ field လေးပါဝင်လာမှာပါ။

```jsonon
> db.games.findOne()
{
    "game": "pinball",
    "user": "joe",
    "score": 50
}
```

- joe ကဆက်လက် ဆော့နေရင်း pinball က jackpot အပေါက်ထဲဝင်သွားပြီး point 10000 ရသွားတယဆိုပါစို့၊ ဒါဆိုဘယ်လိုရေးမလဲ? ခုနရှိထားတဲ့ `score` field ကိုပဲ point 10000 ပေါင်းထည့်ဖို့ `$inc` ကိုသုံးရမှာဖြစ်ပါတယ်။

```json
> db.games.update({"game": "pinball", "user": "joe"}, {"$inc": {"score": 10000}})
```

- ဒါဆိုရင်တော့ joe က score စုစုပေါင်း 10050 ရသွားမှာဖြစ်ပါတယ်။

```jsonon
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

```jsonon
{
    "subjects": ["networking", "programming", "data structure"]
}
```

### Adding Elements (`$push` Modifier)

- `$push` modifier က array ရှိနေရင် အဲ့ array ထဲကို value ထပ်ထည့်မှာဖြစ်ပြီး array မရှိပါက array တစ်ခုဆောက်ပေးမှာ ဖြစ်ပါတယ်။

```jsonon
db.blog.posts.findOne()
{
    "_id": ObjectId("4b2d75476cc613d5ee930164"),
    "title": "A blog post",
    "content": "..."
}
```

- ဒီ document လေးထဲကို `comments` ဆိုတဲ့ array လေးတစ်ခု ထည့်ကြည့်ရအောင်။

```jsonon
> db.blog.posts.update({"title": "A blog post"},
    {"$push": {"comments":
        {"name": "joe", "email": "joe@example.com", "content": "nice post."}}})
```

- array လေးထည့်ပြီးရင်တော့ အောက်ပါအတိုင်း ပြန်ထွက်လာမှာ ဖြစ်ပါတယ်။

```jsonon
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

```jsonon
> db.blog.posts.update({"title": "A blog post"},
    {"$push": {"comments":
        {"name": "bob", "email": "bob@example.com", "content": "good post."}}})
```

- ဒါဆိုရင်တော့ အောက်ပါအတိုင်း value လေးနှစ်ခု သိမ်းပေးသွားမှာဖြစ်ပါတယ်။

```jsonon
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

```json
> db.stock.ticker.update({"_id": "GOOG"}, {"$push":
    {"hourly": {"$each": [562.776, 562.790, 559.123]}}
})
```

- ဒါဆိုရင်တော့ အောက်ပါအတိုင်း သိမ်းပေးမှာဖြစ်ပါတယ်။

```jsonon
{
    "hourly": [562.776, 562.790, 559.123]
}
```

### `$slice` Modifier

- Array တစ်ခုကို size limit တစ်ခုထားချင်ရင် `$slice` ကိုသုံးနိုင်ပါတယ်။

```json
> db.movies.update({"genre": "horror"}, {"$push": {"top10": {
    "$each": ["Nightmare on Elm Street", "Saw"],
    "$slice": -10}}})
```

- `top10` ဆိုတဲ့အတိုင်း `top10` array က ၁၀ ခုထက်မကျော်အောင် `$slice` နဲ့ limit ထားပါတယ်။ limit တန်ဖိုးက အမြဲ negative value ဖြစ်ရပါမယ်။ `$slice` သုံးလိုက်တာနဲ့ array size က ၁၀ ထက်ကျော်သွားမယ်ဆိုရင် ရှေ့က ထည့်ခဲ့တဲ့ data တွေကို slice ဖြတ်ထုတ်ပြီး နောက်ဆုံးကျန်တဲ့ element ၁၀ ခုကိုသာထည်ိ့မှာဖြစ်ပါတယ်။

### `$sort` Modifier

- `$sort` modifier လေးကတော့ သူပြောတဲ့အတိုင်း array ကို user သက်မှတ်ထားတဲ့ criteria အတိုင်း sort ပြီးပြန် ထုတ်ပေးမှာဖြစ်ပါတယ်။ `$sort` ကို အများအားဖြင့် query ပြန်ယူတဲ့အခါ အသုံးပြုနိုင်ပါတယ်။

```json
> db.movies.update({"genre" : "horror"},
    {"$push" : {"$top10" : {
        "$each" : [{"name" : "Nightmare on Elm Street", "rating" : 6.6},
                    {"name" : "Saw", "rating" : 4.3}],
        "$slice" : -10,
        "$sort" : {"rating" : -1}}}})
```

- အပေါ်က query ကလေးကတော့ `top10` ထဲကိုမထည့်မှီမှာ `$sort` လေးသုံးပြီး elements တွေကို `rating` အရစီလိုက်ပါတယ်။ `rating` မှာ -1 ပါတဲ့အတွက်ကြောင့် descending order စီမှာဖြစ်ပြီး rating အများဆုံး movie က နောက်ဆုံးမှာ ရှိပါတယ်။ အဲ့တာကြောင့် slice လုပ်လိုက်တဲ့အချိန် နောက်ဆုံး ၁၀ ခုပဲ top 10 ကျန်ခဲ့မှာဖြစ်ပါတယ်။

### Using Arrays as Sets

- Array တွေကို Set လိုအသုံးပြုချင်တဲ့အခါမှာတော့ `$ne` နဲ့ `$addToSet` ကိုအသုံးပြုနိုင်ပါတယ်။ Set ဆိုတာ Array တစ်ခုထဲမှာ value ရှိပြီးသားဖြစ်နေရင် အဲ့ value နဲ့တူညီတဲ့ နောက်ထပ် value တစ်ခုကို ထပ်ထည့်မရနိုင်ပါ။ ယခု ပြသပေးမဲ့ modifier နှစ်ခုကလဲ array ထဲမှာ value တူတာရှိနေရင်မထည့်ဘဲ အဲ့ value မရှိမှ ထည့်တာမျိုးလုပ်ပေးပါတယ်။

```json
> db.papers.update({"author cited" : {"$ne" : "Richie"}},
    {"$push" : {"authors cited" : "Richie"}})
```

- ဒီ operation လေးမှာတော့ `$ne` ကိုအသုံးပြုပြီး Richie ဆိုတဲ့ author မရှိခဲ့ရင် Richie ကိုထည့်မယ်ဆိုတဲ့ ပုံစံရေးထားတာဖြစ်ပါတယ်။ ပထမ criteria မှာ `$n2` က **Not Equal** လို့အဓိပ္ပါယ်ယူနိုင်ပါတယ်။ `author cited` ထဲမှာ Richie ဆိုတာမရှိမှ criteria က query လို့ရမှာဖြစ်ပြီး Richie ကိုထည့်ပေးမှာဖြစ်ပါတယ်။

### `$addToSet`

- `$addToSet` ကလဲ အ‌ပေါ်ကပြောခဲ့တဲ့ `$ne` လိုပဲ value ရှိရင်မထည့်ပဲ မရှိမှထည့်ပေးတဲ့ modifier လေးတစ်ခုပါ။ `$addToSet` က အသုံးပြုရတာပိုလွယ်ပြီး convenient ပိုဖြစ်ပါတယ်။

- User တစ်ယောက်က သူ့ document ထဲမှာ email တွေကို သိမ်းထားချင်ပါတယ်။ email ဆိုတဲ့အတိုင်း နှစ်ခုထပ်တာ duplicate ဖြစ်တာတေမရှိ‌အောင် email ထည့်မည့်အခါမှာ `$addToSet` ကိုသုံးနိုင်ပါတယ်။

```json
> db.users.findOne({"_id" : ObjectId("4b2d75476cc613d5ee930164")})
{
    "_id" : ObjectId("4b2d75476cc613d5ee930164"),
    "username" : "joe",
    "emails" : [
        "joe@example.com",
        "joe@gmail.com",
        "joe@yahoo.com"
    ]
}
```

- ဒီ document လေးထဲကို `joe@gmail.com` လေးထည့်ကြည့်ရအောင်။

```json
> db.users.update({"_id" : ObjectId("4b2d75476cc613d5ee930164")},
    {"$addToSet" : {"emails" : "joe@gmail.com"}})
> db.users.findOne({"_id" : ObjectId("4b2d75476cc613d5ee930164")})
{
    "_id" : ObjectId("4b2d75476cc613d5ee930164"),
    "username" : "joe",
    "emails" : [
        "joe@example.com",
        "joe@gmail.com",
        "joe@yahoo.com"
    ]
}
```

- `joe@gmail.com` ထည့်လိုက်တဲ့အခါ array လေးကဘာမှမပြောင်းဘဲ ဒီတိုင်းပြန်ထွက်လာပါတယ်။ ဒါတို မတူတဲ့ `joe@hotmail.com` လေးထည့်ကြည့်ရအောင်။

```json
> db.users.update({"_id" : ObjectId("4b2d75476cc613d5ee930164")},
    {"$addToSet" : {"emails" : "joe@hotmail.com"}})
> db.users.findOne({"_id" : ObjectId("4b2d75476cc613d5ee930164")})
{
    "_id" : ObjectId("4b2d75476cc613d5ee930164"),
    "username" : "joe",
    "emails" : [
        "joe@example.com",
        "joe@gmail.com",
        "joe@yahoo.com",
        "joe@hotmail.com"
    ]
}
```

- ဒါဆိုရင်တော့ `joe@hotmail.com` ဆိုပြီး element လေးတစ်ခု array ထဲထည့်လိုက်နိုင်ပြီ ဖြစ်ပါတယ်။

- အဲ့ဒီ `$addToSet` ကိုပဲ `$each` နဲ့ပေါင်းပြီး element အများအပြားကို တစ်ပြိုင်ထဲ ထည့်နိုင်ပါတယ်။

```json
> db.users.update({"_id" : ObjectId("4b2d75476cc613d5ee930164")},
    {"$addToSet" : {"emails" : {"$each" : 
        ["joe@php.net", "joe@example.com", "joe@python.org"]}}})
> db.users.findOne({"_id" : ObjectId("4b2d75476cc613d5ee930164")})
{
    "_id" : ObjectId("4b2d75476cc613d5ee930164"),
    "username" : "joe",
    "emails" : [
        "joe@example.com",
        "joe@gmail.com",
        "joe@yahoo.com",
        "joe@hotmail.com",
        "joe@php.net",
        "joe@example.com",
        "joe@python.org"
    ]
}
```

### Removing Elemets

- Array ထဲက element တွေကို remove လုပ်ချင်ရင်တော့ `$pop` နဲ့ `$pull` ကိုအသုံးပြုနိုင်ပါတယ်။

### `$pop` Modifier

- `$pop` ကတော့နှစ်နည်း အသုံးပြနိုင်ပါတယ်။ `$pop` ကို `key` နဲ့တွဲပြီး နောက်ဆုံးက element ကိုဖျက်ချင်ရင် `{"$pop" : {"key" : 1}}` ဆိုပြီးအသုံးပြုနိုင်ပါတယ်။ ထိုနည်းတူ array ရဲ့ ‌ရှေ့ဆုံးက element ကိုဖျက်ချင်ရင်တော့ `{"$pop" : {"key" : -1}}` ကိုအသုံးပြုနိုင်ပါတယ်။

### `$pull` Modifier

- `$pull` ကတော့ criteria တစ်ခုအပေါမူတည်ပြီး အဲ့ criteria/condition နဲ့ကိုက်ညီတဲ့ element ကို remove မှာဖြစ်ပါတယ်။

```json
> db.list.insert({"todo" : ["dishes", "laundry", "dry cleaning"]})
```

- အပေါ်မှာပြထားတဲ့ array လေးထဲက `laundry` ကိုထုတ်ချင်ရင် `$pull` နဲ့ remove နိုင်ပါတယ်။

```json
> db.list.update({}, {"$pull" : {"todo" : "laundry"}})
> db.list.find()
{
    "_id" : ObjectId("4b2d75476cc613d5ee930164"),
    "todo" : [
        "dishes",
        "dry cleaning"
    ]
}
```

- တစ်ခုသတိထားရမှာက `$pull` ကသူ့ criteria/condition နဲ့ညီနေတဲ့ element အကုန်လုံးကို remove လုပ်ပစ်မှာပါ။ ဥပမာ `array[1, 1, 1, 2]` လို့ရှိခဲ့လို့ `1` ကို `pull` လိုက်မယ်ဆို `array[2]` ပဲကျန်မှာပါ။

### Positional Array Modification

- Array ထဲက field/element တစ်ခုခုကို အသေးစိတ်ပြောင်းချင်ရင် အရင်ကသုံးခဲ့တဲ့ `.` operator လေးနဲ့ `ထဲက` ဆိုပြီးပြန်ခေါ်သုံးနိုင်ပါတယ်။ ဥပမာ အောက်က document ထဲက ပထမဆုံး comment ရဲ့ vote ကို တစ်ခုတိုးချင်တယ်ဆိုရင် အောက်ပါအတိုင်း တိုးနိုင်ပါတယ်။

```json
> db.blog.posts.findOne()
{
    "_id" : ObjectId("4b329a216cc613d5ee930192"),
    "content" : "...",
    "comments" : [
        {
            "comment" : "good post",
            "author" : "John",
            "votes" : 0
        },
        {
            "comment" : "i thought it was too short",
            "author" : "Claire",
            "votes" : 3
        },
        {
            "comment" : "free watches",
            "author" : "Alice",
            "votes" : -1
        }
    ]
}
> db.blog.update({"post" : post_id},
    {"$inc" : {"comments.0.votes" : 1}})
```

REF - Chapter 3: Creating, Updating, and Deleting Documents, from "MongoDB: The Definitive Guide, Second Edition", by Kristina Chodorow

## Chapter 3: Querying

### Introduction to `find()`

- `find()` ကတော့ အားလုံးနီးပါးသိတဲ့အတိုင်း data query ယူတဲ့နေရာမှာ အဓိကထားအသုံးပြုပါတယ် သူ့ရဲ့ parameter လေးကတော့ criteria ဖြစ်ပြီး အဲ့ဒီ criteria နဲ့ ညီတဲ့ data တွေအကုန် query ပြန်ပေးမှာဖြစ်ပါတယ်။

- အခု Chapter မှာဆက်လက်ပြောပြပေးသွားမှာက ကိုယ်က document တစ်ခုလုံးကြီးကိုမလိုချင်ပဲ အဲ့ဒီ document ရဲ့ field တစ်စိတ်တစ်စ ကိုသာလိုချင်တယ်ဆိုရင် ဘလိုခေါ်ရမလဲ ဆိုတာဆက်လက်လေ့လာကြမှာပါ။

- Document တစ်ခုမှာ `name`, `age`, `email` ပဲရှိတယ်ဆိုပါစို့။ ကိုယ်က `age` မလိုချင်ဘူး `name` နဲ့ `email` ပဲလိုချင်ပါတယ်ဆိုရင် ဒီလိုရေးနိုင်ပါတယ်။

```json
> db.users.find({}, {"username" : 1, "email" : 1})
{
    "_id" : ObjectId("4ba0f0dfd22aa494fd523620"),
    "username" : "joe",
    "email" : "joe@example.com"
}
```

- `"_id"` field လေးကတော့ default အမြဲတန်း return ပြန်မဲ့ field လေးဖြစ်လို့ return ပြန်တာဖြစ်ပါတယ်။ အကယ်၍ ကိုယ်က အဲ့ id ပါမလိုချင်ခဲ့ရင် `0` နဲ့ မလိုချင်တဲ့ field ကို ပိတ်လို့ရပါတယ်။

```json
> db.users.find({}, {"username" : 1, "_id" : 0})
{
    "username" : "joe",
}
```

### Query Conditionals

- Programming languages တွေမှာ conditional statements/contitions တွေပါသလို data တွေ query တဲ့အခါမှာလဲ ကိုယ်လိုချင်တဲ့ data ကိုအသေးစိတ် အတိအကျယူနိုင်အောင် Comparison Operatiors တွေထည့်ပေးထားပါတယ်။

| Operator | Operation |
| ----------- | ----------- |
| `$lt` | less than |
| `$lte` | less than or equal |
| `$gt` | greater than |
| `$gte` | greater than or equal |

### Comparison Operatiors

- အကယ်၍ အသက် 18 နှစ်ကနေ 30 ကြား user တွေကို query ယူချင်တယ်ဆိုရင် ဒီလိုရေးနိုင်ပါတယ်။

```json
> db.users.find({"age" : {"$gte" : 18, "$lte" : 30}})
```

- ဒီလို operator တွေက လက်တွေ့မှာအရမ်းအသုံးများပါတယ်။ ကျောင်းအပ်ဌာနက 20/11/2025 နောက်ပိုင်းကျောင်းအပ်ထားတဲ့ ကျောင်းသားစာရင်းရှာချင်ရင် အလွယ်တကူ ရှာနိုင်ပါတယ်။

```json
> start = new Date("20/11/2025")
> db.students.registries.find({"registered" : {"$gt" : start}})
```

### OR Queries (At Least ONE Condition Must be TRUE)

- တစ်ခုထပ်ပိုသော criteria တွေအသုံးပြုပြီး data ရှာချင်တယ်ဆိုရင် `$or` နဲ့ `$in` ကိုအသုံးပြုနိုင်ပါတယ်။

- `$in` က သူလက်ခံထားတဲ့ array ထဲက value တစ်ခု သို့မဟုတ် တစ်ခုထပ်ပိုသော value တွေနဲ့ ညီနေတယ်ဆို criteria ညီတယ်လို့သက်မှတ်ပေးပြီး အဲ့ ညီတဲ့ data တွေအကုန်ဆွဲထုတ်နိုင်ပါတယ်။

- ဥပမာ ထီတစ်ခုမှာ ပေါက်မဲနံပါတ်က 725, 542, 390 ဖြစ်နေမယ်ဆိုရင် အဲ့သုံးခုထဲက နံပတ်တစ်ခု သို့မဟုတ် တစ်ခုထပ်ပိုပြီးပိုင်ဆိုင်ထားတဲ့ user အားလုံးကိုရှာချင်ရင် အောက်ပါအတိုင်းရေးနိုင်ပါတယ်။

```json
> db.luckey.find({"ticket_no" : {"$in" : [725, 542, 390]}})
```

- NOTE: `$nin` ဆိုတဲ့ operator လေးကတော့ `$in` ရဲ့ပြောင်းပြန်ဖြစ်ပြီး သူ့ value တွေအားလုံးနဲ့ မတူတဲ့ data ကိုသာ return ပြန်ပေးမှာဖြစ်ပါတယ်။

- `$or` operator ကတော့ field တစ်ခုတည်းမဟုတ်ပဲ တစ်ခြား field တွေနဲ့ပါစစ်ချင်ရင် သုံးနိုင်ပါတယ်။

- ဥပမာ student တစ်ယောက်က score 50 ကျော်ရင် ကျောင်းတက်ခွင့်ရမည်ဖြစ်သလို scholarship အောင်ထားတယ်ဆိုရင်လဲ ကျောင်းတက်ခွင့်ရနိုင်ကြောင်း အဲ့လို student တွေစစ်ထုတ်ပြီးရှာချင်ရင် အောက်ပါအတိုင်းရေးနိုင်ပါတယ်။

```json
> db.students.find({"$or" : [{"score" : {"$gte" : 50}}, {"scholarship" : true}]})
```

- `$or` operator ကို `$in` နဲ့တွဲပြီးရေးနိုင်ပါတယ်။ အကယ်၍ ကျောင်းသားက score 50 မဟုတ်ပဲ Grade A, B ရမှ ကျောင်းဝင်ခွင့်ရမယ်ဆိုရင် ဒီလိုရေးနိုင်ပါတယ်။

```json
> db.students.find({"$or" : [{"grade" : {"$in" : ["A", "B"]}}, {"scholarship" : true}]})
```

### `$not` Opeartor (Opposite)

- `$not` operator ကတော့ အငြင်း operator ဖြစ်ပါတယ် သူ့ဆီရောက်လာတဲ့ condition အားလုံးကို ပြောင်းပြန်ပြောင်းပစ်လိုက်တာပါ။ true ဆို false, false ဆို true ပြောင်းလိုက်တာပါ။ ကျောင်းသားလက်ခံတဲ့ဌာနက ကျောင်းဝင်ခ္ငင့်မရတဲ့ ကျောင်းသားတွေကို သိချင်တယ်ဆို ဒီလို ရှာနိုင်ပါတယ်။

```json
> db.students.find({"grade" : {"$not" : {"$in" : ["A", "B"]}}})
```

- ဒါဆိုရင်တော့ grade A, B မဟုတ်တဲ့ ကျောင်းသားတွေအကုန် return ပြန်ပေးမှာဖြစ်ပါတယ်။

### Modifiers and Operators

- Modifier တွေက query တစ်ခုမှာ တစ်ခါသာအသုံးပြုနိုင်ပြီး Operator တွေကတော့ အများအပြားအသုံးပြုနိုင်ပါတယ်။ ဒါပေမဲ့ Meta Operators လို့‌ခေါ်တဲ့ Main Operator တွေဖြစ်တဲ့ `$and`, `$or`, `$nor` တို့ကိုတော့ Modifier အဖြစ်နဲ့သတ်မှတ်ထားသောကြောင့် query တစ်ခုမှာ တစ်ခါသာ အသုံးပြုနိုင်ပါတယ်။

### Null

- Null ဆိုတာကတော့ IT လောကနဲ့ရင်းနှီးပြီးသား ဖြစ်နေရင်သိလောက်မှာပါ။ empty, nothing, ဘာမှမရှိလို့အဓိပ္ပါယ် ယူနိုင်ပါတယ်။ query ခေါ်တဲ့အချိန်မှာ null ကို value တစ်ခုအနေနဲ့ သတ်မှတ်ပြီးခေါ်နိုင်ပါတယ်။

```json
> db.c.find()
{ "_id" : ObjectId("4ba0f0dfd22aa494fd523621"), "y" : null }
{ "_id" : ObjectId("4ba0f0dfd22aa494fd523622"), "y" : 1 }
{ "_id" : ObjectId("4ba0f148d22aa494fd523623"), "y" : 2 }
```

- y = null ဖြစ်တဲ့ id ကိုပဲ query ချင်ရင် ပုံမှန်အတိုင်း ရေးနိုင်ပါတယ်။

```json
> db.c.find({"y" : null})
{ "_id" : ObjectId("4ba0f0dfd22aa494fd523621"), "y" : null }
```

- ဒါပေမဲ့ null က `မရှိ` လို့လဲအဓိပ္ပါယ်ယူနိုင်ပါတယ် အဲ့တာကြောင့် x ကို null ပေးပြီး query မယ်ဆိုရင် အဲ့ဒီ x မရှိတဲ့ document/data တွေအကုန် ကျလာမှာဖြစ်ပါတယ်။

```json
> db.c.find({"z" : null})
{ "_id" : ObjectId("4ba0f0dfd22aa494fd523621"), "y" : null }
{ "_id" : ObjectId("4ba0f0dfd22aa494fd523622"), "y" : 1 }
{ "_id" : ObjectId("4ba0f148d22aa494fd523623"), "y" : 2 }
```

### Querying Arrays

- Array တွေကို query ဖို့အတွက်လဲ MongoDB က Modifier တွေလုပ်ပေးထားပါတယ်။

### `$all` Modifier

- `$all` ကတော့ array တစ်ခုထဲမှာ `$all` ထဲထည့်ထားတဲ့ value တွေပါနေရင် return ပေးမှာဖြစ်ပါတယ်။ ဥပမာအနေနဲ့ သစ်သီးခြင်းသုံးခြင်းရှိတယ်ဆိုပါစို့ -

```json
> db.fruit_basket.insert({"_id" : 1, "fruit" : ["apple", "banana", "peach"]})
> db.fruit_basket.insert({"_id" : 2, "fruit" : ["apple", "kumquat", "orange"]})
> db.fruit_basket.insert({"_id" : 3, "fruit" : ["cherry", "banana", "apple"]})
```

- အဲ့ခြင်းသုံးခြင်းထဲကမှ ပန်းသီး (Apple) နဲ့ ငှက်ပြောသီး (Banana) နှစ်ခုပါတဲ့ ခြင်းကိုပဲ ရှာချင်တယ်ဆိုရင် အောက်ပါအတိုင်း `$all` နဲ့ရေးနိုင်ပါတယ်။

```json
> db.fruit_basket.find({fruit : {$all : ["apple", "banana"]}})
{"_id" : 1, "fruit" : ["apple", "banana", "peach"]}
{"_id" : 3, "fruit" : ["cherry", "banana", "apple"]}
```

- ဒါဆိုရင်တော့ apple နဲ့ banana နှစ်ခုစလုံးပါတဲ့ ခြင်းနှစ်ခြင်းကိုသာ return ပြန်ပေးမှာပါ။

### `$size` Modifier

- `$size` Modifier ကတော့ `"$size" : n` လို့အသုံးပြုရပြီး n size အတိအကျရှိတဲ့ array တွေကိုသာ return ပြန်ပေးမှာပါ။

```json
> db.fruit_basket.find({"fruit" : {"$size" : 3}})
```

### `$slice` Modifier

- အရင် chapter မှာတုန်းကပြောခဲ့တဲ့ `$slice` Modifier ကို `find` နဲ့လဲတွဲသုံးနိုင်ပါတယ်။

- `find` မှာသုံးတဲ့ `$slice` ကတော့သုံးနည်း သုံးမျိုးရှိပါတယ်။

- Array တစ်ခုထဲက ပထမဆုံး 5 ခုကို return ပြန်စေချင်ရင် အောက်ပါအတိုင်း ရေးနိုင်ပါတယ်။

```json
> db.blog.posts.findOne(criteria, {"comments" : {"$slice" : 5}})
```

- အကယ်၍ နောက်ဆုံး element 10 ခုကို လိုချင်တယ်ဆိုရင်တော့ `-` ထည့်ပြီးရေးနိုင်ပါတယ်။

```json
> db.blog.posts.findOne(criteria, {"comments" : {"$slice" : -10}})
```

- ဒါမှမဟုတ် array အလယ်က element အစုကိုလိုချင်တယ်ဆိုရင်တော့ အစ index နဲ့ အဆုံး index ကို bracket ထဲထည့်ပြီး ရေးနိုင်ပါတယ်။

```json
> db.blog.posts.findOne(criteria, {"comments" : {"$slice" : [23, 10]}})
```

REF - Chapter 4: Querying, from "MongoDB: The Definitive Guide, Second Edition", by Kristina Chodorow

# PART II DESIGNING YOUR APPLICATION

## Chapter 4: Indexing

- Coming Soon...

REF - Chapter 5: Indexing, from "MongoDB: The Definitive Guide, Second Edition", by Kristina Chodorow

## Chapter 5: Collections

- Coming Soon...

REF - Chapter 6: Special Index and Collection Types, from "MongoDB: The Definitive Guide, Second Edition", by Kristina Chodorow

## Chapter 6: Aggregation

- Coming Soon...

REF - Chapter 7: Aggregation, from "MongoDB: The Definitive Guide, Second Edition", by Kristina Chodorow