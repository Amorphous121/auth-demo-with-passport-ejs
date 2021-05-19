const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const JWTstretagy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const { toObject, removeFields } = require('../utils/helper');

const USER = require('../models/users-model')

passport.use(new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
    async (email, password, done) => {
        try {
            
            let user = await USER.findOne({ email, isDeleted: false }, { isDeleted : 0, deletedBy : 0, createdAt : 0}).populate({ path : 'role', select : '_id name'})

            if (!user) {
                return done(null, false, { message: "USER doesn't exist" });
            }
            const validate = await user.isValidPassword(password);
            if (!validate)
                return done(null, false, { message: 'Incorrect password' });


            return done(null, user, { message: "Logged In Successfull" });
        } catch (error) {
            done(error);
        }
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
  
  
passport.deserializeUser(async function(id, done) {
   try {
    const project = { deletedAt : 0, createdAt : 0, updatedAt : 0, deletedBy : 0, isDeleted : 0, posts : 0, comments : 0, password : 0 };
    const user = await USER.findOne({ _id : id, isDeleted : false }, project).populate({ path : 'role', select : '_id name'});
    done(null, user)

   } catch(err) {
       done(err);
   }
});

// USER.findById(id, function(err, user) {
//   done(err, user);
// });


// passport.use(
//     new JWTstretagy(
//         {
//             secretOrKey: process.env.TOKEN_SECRET,
//             jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
//         },
//         async (token, done) => {
//                 let user = await USER.findOne({ _id: token.user._id, isDeleted: false })
//                             .populate({ path : 'role', select : { _id : 0, name : 1 }});
                
//                 if (user) { 
//                     token.user.role = user.role.name;
//                     return done(null, token.user);
//                 }   
//                 else return done(null, false, { message :" Invalid token"});
//         }
//     )
// );