"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const user_model_1 = require("../schemas/user.model");
const passport_local_1 = __importDefault(require("passport-local"));
const passport_google_oauth20_1 = __importDefault(require("passport-google-oauth20"));
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser(function (user, done) {
    done(null, user);
});
passport_1.default.use('local', new passport_local_1.default((username, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.UserModel.findOne({ username: username });
    if (!user) {
        return done(null, false);
    }
    else {
        if (user.password === password) {
            return done(null, user);
        }
        else {
            return done(null, false);
        }
    }
})));
passport_1.default.use(new passport_google_oauth20_1.default({
    clientID: "937742508314-2p04serotp7sjeugpcu3dmg8o1u90s8a.apps.googleusercontent.com",
    clientSecret: "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",
    callBackURL: "http://localhost:3000/auth/google/callback",
    passReqToCallback: true
}, (request, accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(profile, 'profile');
        let existingUser = yield user_model_1.UserModel.findOne({ 'google.id': profile.id });
        // if user exists return the user
        if (existingUser) {
            return done(null, existingUser);
        }
        // if user does not exist create a new user
        console.log('Creating new user...');
        const newUser = new user_model_1.UserModel({
            google: {
                id: profile.id,
            },
            username: profile.emails[0].value,
            password: null
        });
        yield newUser.save();
        console.log(newUser, 'newUser');
        return done(null, newUser);
    }
    catch (error) {
        return done(null, false);
    }
})));
exports.default = passport_1.default;
