var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const mongoose = require("mongoose");
const MONGOOURI = "mongodb+srv://sabana:diktaBagus95@sabana.mcc5i.gcp.mongodb.net/sabana?retryWrites=true&w=majority";
const InitiateMongoServer = () => __awaiter(this, void 0, void 0, function* () {
    try {
        yield mongoose.connect(MONGOOURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log("Connected to DB !! sabana");
    }
    catch (e) {
        console.log(e);
        throw e;
    }
});
module.exports = InitiateMongoServer;
