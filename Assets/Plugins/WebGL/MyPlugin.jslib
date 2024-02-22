

var MyPlugin = {
    IsMobile: function () {
        var ua = window.navigator.userAgent.toLowerCase();
        var mobilePattern = /android|iphone|ipad|ipod/i;

        return ua.search(mobilePattern) !== -1 || (ua.indexOf("macintosh") !== -1 && "ontouchend" in document);
    },
    Auth: function() {
        console.log('AUTH');
        ysdk.auth.openAuthDialog().then(() => {
            console.log('SUCCESS');
            myGameInstance.SendMessage('YandexManager', 'SetAuth', "true");

            ysdk.getLeaderboards()
                .then(lb => lb.getLeaderboardPlayerEntry('MaxScore'))
                .then(res => {
                    console.log('SetBestScore');
                    myGameInstance.SendMessage('YandexManager', 'SetBestScore', res.score);
                })
                .catch(err => {
                    myGameInstance.SendMessage('YandexManager', 'SetBestScore', 0);
                });
            
            initPlayer().catch(err => {
                // Ошибка при инициализации объекта Player.
            });
        }).catch(() => {
            myGameInstance.SendMessage('YandexManager', 'SetAuth', "false");
        });
    },
    CheckAuth: function() {
        console.log('CheckAuth');
        if (player.getMode() === 'lite') {
            myGameInstance.SendMessage('YandexManager', 'SetAuth', "false");
            player.getData().then((res) => {
                console.log('data is get');
                myGameInstance.SendMessage('YandexManager', 'SetBestScore', res.bestScore);
            });
        } else {
            myGameInstance.SendMessage('YandexManager', 'SetAuth', "true");

            ysdk.getLeaderboards()
                .then(lb => lb.getLeaderboardPlayerEntry('MaxScore'))
                .then(res => {
                    console.log('SetBestScore');
                    myGameInstance.SendMessage('YandexManager', 'SetBestScore', res.score);
                })
                .catch(err => {
                    console.log('SetBestScore0');
                    myGameInstance.SendMessage('YandexManager', 'SetBestScore', 0);
                });
        }
    },
    GiveMePlayerData: function () {
        ysdk.getLeaderboards()
            .then(lb => lb.getLeaderboardPlayerEntry('MaxScore'))
            .then(res => {
                console.log('SetBestScore');
                myGameInstance.SendMessage('YandexManager', 'SetBestScore', res.score);
            })
            .catch(err => {
                console.log('SetBestScore0');
                myGameInstance.SendMessage('YandexManager', 'SetBestScore', 0);
            });
    },
    RateGame : function (){
	    ysdk.feedback.canReview()
            .then(({ value, reason }) => {
                if (value) {
                    ysdk.feedback.requestReview()
                        .then(({ feedbackSent }) => {
                            console.log(feedbackSent);
                        })
                } else {
                    console.log(reason)
            }
        })
    },
    SetToLeaderBoard: function(time, score){
        ysdk.getLeaderboards()
            .then(lb => lb.getLeaderboardPlayerEntry('MaxScore'))
            .then(res => {
                if(res.score < score) {
                    ysdk.getLeaderboards()
                    .then(lb => {
                        lb.setLeaderboardScore('MaxScore', score);
                    });
                }
            })
            .catch(err => {
                if (err.code === 'LEADERBOARD_PLAYER_NOT_PRESENT') {
                    ysdk.getLeaderboards()
                        .then(lb => {
                            lb.setLeaderboardScore('MaxScore', score);
                        });
                }
                if (err.code === 'AUTH_HAS_NO_AUTH') {
                    player.getData().then((res) => {
                        console.log('data is get');
                        if(res.bestScore === undefined || res.bestScore < score) {
                            player.setData({
                                bestTime: res.bestTime,
                                bestScore: score,
                            }).then(() => {
                                console.log('data is set');
                            });
                        }
                    });
                }
            });

        setTimeout(function() {
            ysdk.getLeaderboards()
                .then(lb => lb.getLeaderboardPlayerEntry('MaxTime'))
                .then(res => {
                    if(res.score < time) {
                        ysdk.getLeaderboards()
                        .then(lb => {
                            lb.setLeaderboardScore('MaxTime', time);
                        });
                    }
                })
                .catch(err => {
                    if (err.code === 'LEADERBOARD_PLAYER_NOT_PRESENT') {
                        ysdk.getLeaderboards()
                            .then(lb => {
                                lb.setLeaderboardScore('MaxTime', time);
                            });
                    }
                    if (err.code === 'AUTH_HAS_NO_AUTH') {
                        player.getData().then((res) => {
                            console.log('data is get');
                            if(res.bestTime === undefined || res.bestTime < score) {
                                player.setData({
                                    bestScore: res.bestScore,
                                    bestTime: time,
                                }).then(() => {
                                    console.log('data is set');
                                });
                            }
                        });
                    }
                });
        }, 1500) 
    },
    GetLang : function (){
	    var lang = ysdk.environment.i18n.lang;
	    var bufferSize = lengthBytesUTF8(lang) + 1;
	    var buffer = _malloc(bufferSize);
	    stringToUTF8(lang, buffer, bufferSize);
	    return buffer;
    },
};  
mergeInto(LibraryManager.library, MyPlugin);