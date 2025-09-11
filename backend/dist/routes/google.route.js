import { Router } from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user.model.js';
import welcomeEmail from '../emails/welcomeEmail.js';
const router = Router();
// Passport Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.API_URL + '/auth/google/callback',
    passReqToCallback: true,
}, async (req, accessToken, refreshToken, profile, done) => {
    try {
        let role = 'user';
        const roleQuery = req.secureQuery.state;
        if (typeof roleQuery === 'string') {
            const checkRole = [
                'user',
                'landlord',
                'admin',
                'superAdmin',
                'owner',
            ].includes(roleQuery);
            if (checkRole) {
                role = roleQuery;
            }
        }
        let user = await User.findOne({
            where: {
                googleId: profile.id,
            },
        });
        if (!user) {
            const existUser = await User.findOne({
                where: {
                    email: profile.emails?.[0]?.value,
                },
            });
            if (existUser) {
                existUser.googleId = profile.id;
                await existUser.save();
                user = existUser;
            }
            else {
                user = await User.create({
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails?.[0]?.value,
                    avatar: profile.photos?.[0]?.value || '',
                    role,
                    isVerified: true,
                });
            }
        }
        return done(undefined, user);
    }
    catch (e) {
        done(e, undefined);
    }
}));
// Routes
router.get('/auth/google', (req, res, next) => {
    const role = typeof req.secureQuery.role === 'string' ? req.secureQuery.role : 'user';
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        state: role,
    })(req, res, next);
});
router.get('/auth/google/callback', passport.authenticate('google', {
    session: false,
    failureRedirect: process.env.FRONTEND_URL + '/login',
}), async (req, res, next) => {
    try {
        const token = await req.user.generateAuthToken();
        welcomeEmail('delivered@resend.dev');
        res.cookie('jwt-auth', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7, //saved for 7days
            secure: process.env.PRODUCTION === 'true',
            sameSite: process.env.PRODUCTION === 'true' ? 'none' : 'lax',
            priority: 'high',
        });
        res.redirect(`${process.env.FRONTEND_URL}/?login=success`);
    }
    catch (err) {
        next(err);
    }
});
export default router;
//# sourceMappingURL=google.route.js.map