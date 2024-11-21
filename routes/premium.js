const express = require('express');
const { checkUsername, resetAllLimit } = require('../database/db');
const { addPremium, deletePremium, tokens, checkPremium, changeKey, resetOneLimit, resetTodayReq } = require('../database/premium');
const { isAuthenticated } = require('../lib/auth');
const { limitCount } = require('../lib/settings');
const router = express.Router();
myusername = 'Bener'
router.get('/', isAuthenticated, async (req, res) => {
    let { username } = req.user
    if (username !== myusername) return res.redirect('/docs')
    res.render('/index', {
        layout: 'layouts/main'
    })
})

router.get('/add', isAuthenticated, async (req, res) => {
    let { username } = req.user
    if (username !== myusername) return res.redirect('/docs')
    res.render('/add', {
        layout: 'layouts/main'
    });
});

router.post('/add', isAuthenticated, async (req, res) => {
    let { username, expired, customKey, token } = req.body;
    if (token != tokens) {
        req.flash('error_msg', 'Invalid Token');
        res.redirect('/add');
    }
    let checking = await checkUsername(username);
    if (!checking) {
        req.flash('error_msg', 'Username is not registered');
        res.redirect('/add');
    } else {
        let checkPrem = await checkPremium(username)
        if (checkPrem) {
            req.flash('error_msg', `'${username}' is alredy Premium before`);
            res.redirect('/add');
        } else {
            addPremium(username, customKey, expired)
            req.flash('success_msg', `Success Added Premium ${username}`);
            res.redirect('/premium');
        }
    }
})

router.get('/delete', isAuthenticated, async (req, res) => {
    let { username } = req.user
    if (username !== myusername) return res.redirect('/docs')
    res.render('/delete', {
        layout: 'layouts/main'
    });
});

router.post('/delete', isAuthenticated, async (req, res) => {
    let { username, token } = req.body;
    if (token != tokens) {
        req.flash('error_msg', 'Invalid Token');
        return res.redirect('/delete');
    }
    let checking = await checkUsername(username);
    if (!checking) {
        req.flash('error_msg', 'Username is not registered');
        res.redirect('/delete');
    } else {
        let checkPrem = await checkPremium(username)
        if (checkPrem) {
            deletePremium(username);
            req.flash('success_msg', `Succes Delete Premium ${username}`);
            res.redirect('/premium');
        } else {
            req.flash('error_msg', 'Username is not Premium');
            res.redirect('/delete');
        }
    };
});

router.get('/custom', isAuthenticated, (req, res) => {
    res.render('/custom', {
        layout: 'layouts/main'
    });
})

router.post('/custom', isAuthenticated, async (req, res) => {
    let { customKey } = req.body;
    let { username } = req.user
    let checkPrem = await checkPremium(username);
    if (checkPrem) {
        changeKey(username, customKey)
        req.flash('success_msg', `Succes Custom Apikey ${customKey}`);
        res.redirect('/docs');
    } else {
        req.flash('error_msg', 'Youre not Premium');
        res.redirect('/docs');
    }
})

router.get('/limit', isAuthenticated, async (req, res) => {
    let { username } = req.user
    if (username !== myusername) return res.redirect('/docs')
    res.render('/limit', {
        layout: 'layouts/main'
    });
})

router.post('/limit', isAuthenticated, async (req, res) => {
    let { username, token } = req.body;
    if (token != tokens) {
        req.flash('error_msg', 'Invalid Token');
        return res.redirect('/limit');
    }
    let reset = await checkPremium(username);
    if (!reset) {
        resetOneLimit(username)
        req.flash('success_msg', `Succes Reset Limit Apikey User ${username} to ${limitCount}`);
        res.redirect('/premium');
    } else {
        req.flash('error_msg', 'Cannot Reset Premium Apikey');
        res.redirect('/limit');
    }
})

router.post('/resetall', isAuthenticated, async (req, res) => {
    let { username } = req.user
    if (username !== myusername) return res.redirect('/docs')
    let { token } = req.body;
    if (token != tokens) {
        req.flash('error_msg', 'Invalid Token');
        return res.redirect('/premium');
    } else {
        resetAllLimit();
        resetTodayReq();
        req.flash('success_msg', `Succes Reset Limit All Apikey`);
        return res.redirect('/premium');
    }
})

module.exports = router;
