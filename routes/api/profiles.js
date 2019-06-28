var router = require("express").Router();
var mongoose = require("mongoose");
var User = mongoose.model("User");
var auth = require("../auth");
var reqService = require("../../services/api");

// Preload user profile on routes with ':username'
router.param("username", function(req, res, next, username) {
    User.findOne({ username: username })
        .then(function(user) {
            if (!user) {
                return res.sendStatus(404);
            }

            req.profile = user;

            return next();
        })
        .catch(next);
});

router.get("/:username", auth.optional, function(req, res, next) {
    if (req.payload) {
        User.findById(req.payload.id).then(function(user) {
            if (!user) {
                return res.json({
                    profile: req.profile.toProfileJSONFor(false)
                });
            }

            return reqService
                .restGet(
                    `/gamer/${req.profile._id}?api_key=${
                        process.env.GAME_API_KEY
                    }`
                )
                .then(gamer =>
                    res.json({
                        profile: req.profile.toProfileJSONFor(user, gamer.data)
                    })
                );
        });
    } else {
        return res.json({ profile: req.profile.toProfileJSONFor(false) });
    }
});

router.post("/:username/follow", auth.required, function(req, res, next) {
    var profileId = req.profile._id;

    User.findById(req.payload.id)
        .then(function(user) {
            if (!user) {
                return res.sendStatus(401);
            }

            return user.follow(profileId).then(() =>
                reqService
                    .restPatch(
                        `/gamer/${user._id}/achievements/IDOL_1?api_key=${
                            process.env.GAME_API_KEY
                        }`,
                        { progression: 1 }
                    )
                    .then(achievement => {
                        return reqService
                            .restGet(
                                `/gamer/${req.profile._id}?api_key=${
                                    process.env.GAME_API_KEY
                                }`
                            )
                            .then(gamer =>
                                res.json({
                                    profile: req.profile.toProfileJSONFor(
                                        user,
                                        gamer.data
                                    ),
                                    unlockedAchievement: achievement.errors
                                        ? false
                                        : achievement.data.unlockedAchievement
                                })
                            );
                    })
            );
        })
        .catch(next);
});

router.delete("/:username/follow", auth.required, function(req, res, next) {
    var profileId = req.profile._id;

    User.findById(req.payload.id)
        .then(function(user) {
            if (!user) {
                return res.sendStatus(401);
            }

            return user.unfollow(profileId).then(function() {
                return reqService
                    .restGet(
                        `/gamer/${req.profile._id}?api_key=${process.env.GAME_API_KEY}`
                    )
                    .then(gamer =>
                        res.json({
                            profile: req.profile.toProfileJSONFor(
                                user,
                                gamer.data
                            )
                        })
                    );
            });
        })
        .catch(next);
});

router.get("/leaderboard/experience", (req, res, next) => {
    return reqService
        .restGet(`/leaderboard/experience?api_key=${process.env.GAME_API_KEY}`)
        .then(leaderboard => {
            if (leaderboard.data) {
                return User.find({
                    _id: { $in: leaderboard.data.map(gamer => gamer.gamerId) }
                }).then(users => {
                    return res.json({
                        leaderboard: leaderboard.data.map(gamer => {
                            const matchingUser = users.find(
                                user => user._id.toString() === gamer.gamerId
                            );
                            if (matchingUser) {
                                return { ...matchingUser._doc, gamer };
                            }
                            return null;
                        })
                    });
                });
            }
            return res.json({ leaderboard: leaderboard.errors });
        });
});

module.exports = router;
