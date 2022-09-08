import mongoose, { ConnectOptions } from 'mongoose';
require('dotenv').config();

mongoose.connect(
    process.env.MONGODB_URI!, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true, 
        serverSelectionTimeoutMS: 100000,
        keepAlive: true
    } as ConnectOptions)
.then((res) => { console.log(`🚀 Connection Established 🔥!!`); })
.catch((err) => { console.log(`🚀 Connection Denied ❌!! ${err}`); });