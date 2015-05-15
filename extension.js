(function () {
    //Link location of your fork so you don't have to modify so many things.
    var fork = "pironic";
    var build = 47;
		
    //Define our function responsible for extending the bot.
    function extend() {
        //If the bot hasn't been loaded properly, try again in 1 second(s).
        if (!window.bot) {
            return setTimeout(extend, 1 * 1000);
        }

        //Precaution to make sure it is assigned properly.
        var bot = window.bot;
        bot.version = bot.version + '.' + build;


        //Load custom settings set below
        bot.retrieveSettings();
         /* *********************** *
         * WRITHEM CUSTOM COMMANDS *
        * *********************** */

        bot.commands.aboutCommand = {
            command: 'about',
            rank: 'user',
            functionality: function (chat, cmd) {
                // alias of !source
                bot.commands.sourceCommand.functionality(chat,cmd);
            }
        };

        bot.commands.afkCommand = {
            command: 'afk',  //The command to be called. With the standard command literal this would be: !bacon
            rank: 'user', //Minimum user permission to use the command
            type: 'startsWith', //Specify if it can accept variables or not (if so, these have to be handled yourself through the chat.message
            functionality: function (chat, cmd) {
                if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                if (!bot.commands.executable(this.rank, chat)) return void (0);
                else {
                    // add user with timestamp to the array and reason
                    var afkUser = {
                        un: chat.un,
                        uid: chat.uid,
                        timestamp: new Date().getTime(),
                        reason: (chat.message.length > cmd.length + 1 ? chat.message.substr(cmd.length + 1):"no reason provided")
                    }
                    bot.writhemAfkList[chat.un] = afkUser;
                    API.sendChat("[@" + chat.un + "] You have been marked as AFK, if anyone tries to page you, I will respond on your behalf.");
                    localStorage.setItem("writhemAfkList", JSON.stringify(bot.writhemAfkList));
                }
            }
        };

        bot.commands.afkdisableCommand = {
            command: 'afkdisable',  //The command to be called. With the standard command literal this would be: !bacon
            rank: 'user', //Minimum user permission to use the command
            type: 'startsWith', //Specify if it can accept variables or not (if so, these have to be handled yourself through the chat.message
            functionality: function (chat, cmd) {
                if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                if (!bot.commands.executable(this.rank, chat)) return void (0);
                else {
                    if (chat.message.length > (cmd.length + 2)
                        && bot.commands.executable("bouncer",chat)) {
                        // deal with a username passed
                        var user = chat.message.substr(cmd.length + 2);
                        if (typeof bot.writhemAfkList[user] !== 'undefined') {
                            API.sendChat("[@" + chat.un + "] " + user + " has been marked as returned, I will no longer respond on their behalf. They were gone for: "+bot.roomUtilities.msToStr(new Date().getTime() - bot.writhemAfkList[user].timestamp));
                            delete bot.writhemAfkList[user];
                            localStorage.setItem("writhemAfkList", JSON.stringify(bot.writhemAfkList));
                        }
                        else {
                            API.sendChat("[@" + chat.un + "] " + user + " was not marked as AFK to begin with, so I will continue not responding on their behalf.  *scoff*");
                        }

                    }
                    else {
                        // self
                        if (typeof bot.writhemAfkList[chat.un] !== 'undefined') {
                            API.sendChat("[@" + chat.un + "] You have been marked as returned, I will no longer respond on your behalf. You were gone for approx: "+bot.roomUtilities.msToStr(new Date().getTime() - bot.writhemAfkList[chat.un].timestamp));
                            delete bot.writhemAfkList[chat.un];
                            localStorage.setItem("writhemAfkList", JSON.stringify(bot.writhemAfkList));
                        }
                    }
                }
            }
        };

        bot.commands.echoCommand = {
            command: 'echo',  //The command to be called. With the standard command literal this would be: !bacon
            rank: 'cohost', //Minimum user permission to use the command
            type: 'startsWith', //Specify if it can accept variables or not (if so, these have to be handled yourself through the chat.message
            functionality: function (chat, cmd) {
                if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                if (!bot.commands.executable(this.rank, chat)) return void (0);
                else {
                    API.moderateDeleteChat(chat.cid);
                    API.sendChat(chat.message.substr(cmd.length + 1));
                }
            }
        };

        bot.commands.rcsCommand = {
            command: 'rcs',  //The command to be called. With the standard command literal this would be: !bacon
            rank: 'user', //Minimum user permission to use the command
            type: 'exact', //Specify if it can accept variables or not (if so, these have to be handled yourself through the chat.message
            functionality: function (chat, cmd) {
                if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                if (!bot.commands.executable(this.rank, chat)) return void (0);
                else {
                    console.log(cmd);
                    console.log(chat);
                    API.sendChat("[@" + chat.un + "] Radiant's RCS is a suite of tools to upgrade and enhance your plug.dj experience. Download it here: https://rcs.radiant.dj/ Direct USERSCRIPT link: https://code.radiant.mu/rs.user.js");
                }
            }
        };

        bot.commands.rollCommand = {
            command: 'roll',  //The command to be called. With the standard command literal this would be: !bacon
            rank: 'user', //Minimum user permission to use the command
            defaultDice: [1,100],
            functionality: function (chat, cmd) {
                var params = chat.message.substr(cmd.length + 2);
                console.log(params);
                var numDice = 1;
                var typeDie = 100;
                var diceArray = this.defaultDice;
                if (params !== undefined)
                    diceArray = params.split('d');
                var capped = false;
                console.log(diceArray);
                if(diceArray && diceArray.length > 1){
                    if(!isNaN(diceArray[0])) numDice = diceArray[0];
                    if(!isNaN(diceArray[1])) typeDie = diceArray[1];
                    if(typeDie > 1000) {
                        typeDie = 1000; capped = true;
                    }
                    else if (typeDie < 1) {
                        typeDie = 1; capped = true;
                    }
                    if(numDice > 1000) {
                        numDice = 1000; capped = true;
                    }
                    else if (numDice < 1) {
                        numDice = 1; capped = true;
                    }

                }

                if(capped)
                {
                    //API.sendChat("Dice Rolls capped to < 1000d1000 & > 1d1");
                }

                var diceRoll = 0;
                for(var i = 0; i < numDice; i++)
                {
                    diceRoll += Math.floor((Math.random()*typeDie)+1);
                }

                API.sendChat("@"+chat.un+" rolled a "+diceRoll);
            }
        };

        bot.commands.sayCommand = {
            command: 'say',  //The command to be called. With the standard command literal this would be: !bacon
            rank: 'manager', //Minimum user permission to use the command
            type: 'startsWith', //Specify if it can accept variables or not (if so, these have to be handled yourself through the chat.message
            functionality: function (chat, cmd) {
                if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                if (!bot.commands.executable(this.rank, chat)) return void (0);
                else {
                    API.moderateDeleteChat(chat.cid);
                    API.sendChat("[@" + chat.un + "] " + chat.message.substr(cmd.length + 1));
                }
            }
        };

        bot.commands.seenCommand = {
            command: 'seen',  //The command to be called. With the standard command literal this would be: !bacon
            rank: 'user', //Minimum user permission to use the command
            type: 'startsWith', //Specify if it can accept variables or not (if so, these have to be handled yourself through the chat.message
            functionality: function (chat, cmd) {
                if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                if (!bot.commands.executable(this.rank, chat)) return void (0);
                else {
                    var searchUser = chat.message.substr(cmd.length +2);
                    var found = false;
                    for (var i = 0; i < bot.room.users.length; i++) {
                        if (bot.room.users[i].username === searchUser) {
                            found = bot.room.users[i];
                            if (found.inRoom) {
                                API.sendChat("[@" + chat.un + "] You silly goose! Open your eyes! @"+searchUser+ " is right here.");
                            } else {
                                API.sendChat("[@" + chat.un + "] I last saw @" + searchUser + " " + bot.roomUtilities.msToStr(new Date().getTime() - found.lastActivity)+ " ago.");
                            }
                            break;
                        }
                    }
                    if (!found) {
                        API.sendChat("Sorry I have not seen "+searchUser+". Make sure to include the @ to help me find them.")
                    }
                }
            }
        };

        bot.commands.userStatsCommand = {
            command: 'userStats',  //The command to be called. With the standard command literal this would be: !bacon
            rank: 'user', //Minimum user permission to use the command
            type: 'exact', //Specify if it can accept variables or not (if so, these have to be handled yourself through the chat.message
            functionality: function (chat, cmd) {
                if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                if (!bot.commands.executable(this.rank, chat)) return void (0);
                else {
                    for (var i = 0; i < bot.room.users.length; i++) {
                        if (bot.room.users[i].id === chat.uid) {
                            var s = "[@" + chat.un + "]";
                            s += " I first saw you here: " + bot.roomUtilities.msToStr(new Date().getTime() - bot.room.users[i].jointime)+" ago.";
                            var score = (bot.room.users[i].votes.curate * 10)
                                +(bot.room.users[i].votes.woot * 5)
                                +(bot.room.users[i].votes.meh * 1);
                            s += " You have a WritheM Score of "+score+".";
                            s += " And your last activity was "+ bot.roomUtilities.msToStr(new Date().getTime() - bot.room.users[i].lastActivity)+" ago, obviously.";
                            API.sendChat(s);
                        }
                    }

                }
            }
        };

        bot.commands.wolframCommand = {
            command: 'wa',  //The command to be called. With the standard command literal this would be: !bacon
            rank: 'user', //Minimum user permission to use the command
            type: 'startsWith', //Specify if it can accept variables or not (if so, these have to be handled yourself through the chat.message
            url: 'https://news.writhem.com/wolfram/?q=', // this is a private url and can't be accessed outside the writhem network. dont' bother even trying. ;-)
            functionality: function (chat, cmd) {
                if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                if (!bot.commands.executable(this.rank, chat)) return void (0);
                else { 
                    var msg = chat.message.substr(4);
                    $.post(this.url+encodeURIComponent(msg),function( data ) {
                        API.sendChat("[@" + chat.un + "] " + data); 
                    });
                }
            }
        };

        /* ************************* *
        * DEFAULT COMMAND OVERLOADS *
       * ************************* */

        bot.commands.helpCommand = {
            command: 'help',
            rank: 'user',
            type: 'exact',
            functionality: function (chat, cmd) {
                if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                if (!bot.commands.executable(this.rank, chat)) return void (0);
                else {
                    var link = "http://bit.ly/wmr-faq";
                    API.sendChat(subChat(bot.chat.starterhelp, {link: link}));
                }
            }
        };

        bot.commands.pingCommand = {
            command: 'ping',  //The command to be called. With the standard command literal this would be: !bacon
            rank: 'user', //Minimum user permission to use the command
            type: 'exact', //Specify if it can accept variables or not (if so, these have to be handled yourself through the chat.message
            functionality: function (chat, cmd) {
                if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                if (!bot.commands.executable(this.rank, chat)) return void (0);
                else { 
                    console.log(cmd);
                    console.log(chat);
                    API.sendChat("[@" + chat.un + "] Pong! Your user id is " + chat.uid); 
                }
            }
        };
        
        bot.commands.sourceCommand = {
            command: 'source',
            rank: 'user',
            functionality: function (chat, cmd) {
                API.sendChat('/me This bot was created by Matthew (Yemasthui), but is now maintained by Michael Writhe (pironic). You can find our open source fork at https://github.com/' + fork + '/WritheM-plugdj-Bot');
            }
        };

         /* ******************************* *
         * WRITHEM EVENT HANDLER OVERLOADS *
        * ******************************* */

        bot.writhemEvents = {};
        bot.writhemEvents.catchAFKPing = function (chat) {
            var regexp = RegExp('(:?^| )@(.+)');
            var regResult = regexp.exec(chat.message);
            if (regResult != null){
                var catches = regResult[2].split(" ");
                var caught = false;
                var user = null;
                if (typeof bot.writhemAfkList[catches[0]] !== 'undefined') {
                    caught = true;user = catches[0];
                } else if (typeof bot.writhemAfkList[catches[0] + " " + catches[1]] !== 'undefined') {
                    caught = true;user = catches[0] + " " + catches[1];
                }

                if (caught) {
                    API.sendChat("[@"+chat.un+"] Sorry "+ user +" has been marked afk for approx "+bot.roomUtilities.msToStr(new Date().getTime() - bot.writhemAfkList[user].timestamp)+" : '"+ bot.writhemAfkList[user].reason+"' ");
                }
            }
        };

        bot.writhemEvents.breakAFKChat = function(chat) {
            if (typeof bot.writhemAfkList[chat.un] !== 'undefined'
                && (new Date().getTime() - bot.writhemAfkList[chat.un].timestamp) > 30) {
                API.sendChat("[@" + chat.un + "] You have been marked as returned, I will no longer respond on your behalf. You were gone for approx: "+bot.roomUtilities.msToStr(new Date().getTime() - bot.writhemAfkList[chat.un].timestamp));
                delete bot.writhemAfkList[chat.un]
                localStorage.setItem("writhemAfkList", JSON.stringify(bot.writhemAfkList));
            }
        };

        bot.writhemEvents.advanceFailSafe = function(obj) {
            window.clearInterval(bot.failSafeSkipTimer);
            var duration = (obj.media.duration*1000)+5000;
            console.log(duration);
            bot.failSafeSkipTimer = setInterval(function() {API.moderateForceSkip();},duration);
        };

        bot.writhemEvents.removeNonDJAfterPlay = function(obj) {
            console.log(obj);
            if (obj.lastPlay.dj.role < 1) {
                API.moderateRemoveDJ(obj.lastPlay.dj.id);
            }
        };

        var proxy = {
            eventChat: $.proxy(function(chat) {
                bot.writhemEvents.catchAFKPing(chat);
                bot.writhemEvents.breakAFKChat(chat);
            }, this),
            eventDJAdvance: $.proxy(function(obj) {
                bot.writhemEvents.advanceFailSafe(obj);
                bot.writhemEvents.removeNonDJAfterPlay(obj);
                bot.writhemStats();
            }, this),
            eventUserJoin: $.proxy(function(obj) {
                bot.writhemStats();
            }, this),
            eventUserLeave: $.proxy(function(obj) {
                bot.writhemStats();
            }, this),
            eventWaitlistUpdate: $.proxy(function(obj) {
                bot.writhemStats();
            }, this)
        };
         /* **************** *
         * WRITHEM START UP *
        * **************** */

        bot.writhemAPI = function() {
            API.chatLog("Loading WritheM Specific Event Handlers...")

            API.on(API.ADVANCE, proxy.eventDJAdvance);
            API.on(API.CHAT, proxy.eventChat);
            API.on(API.USER_JOIN, proxy.eventUserJoin);
            API.on(API.USER_LEAVE, proxy.eventUserLeave);
            API.on(API.WAIT_LIST_UPDATE, proxy.eventWaitlistUpdate);
        }
        var basicBotDisconnect = bot.disconnectAPI;
        bot.disconnectAPI = function() {
            API.off(API.ADVANCE,proxy.eventDJAdvance);
            API.off(API.CHAT, proxy.eventChat);
            API.off(API.USER_JOIN, proxy.eventUserJoin);
            API.off(API.USER_LEAVE, proxy.eventUserLeave);
            API.off(API.WAIT_LIST_UPDATE, proxy.eventWaitlistUpdate);

            basicBotDisconnect();
        }

        bot.writhemAPI();
        var afkList = JSON.parse(localStorage.getItem("writhemAfkList"));
        if (afkList === null || typeof afkList === 'undefined')
            afkList = {};
        bot.writhemAfkList = afkList;
        bot.cmdLink = "http://wiki.writhem.com/display/radio/Bot+Commands";

        //Load the chat package again to account for any changes
        bot.loadChat();

        bot.writhemStats = function() {
            window.clearInterval(bot.writhemStatsTimer);
            var url = "https://news.writhem.com/radio/stats/?rrd=plug";
            var data = {};
            data.djs = API.getWaitList().length + (typeof API.getDJ() === 'undefined'?0:1);
            data.listeners = API.getUsers().length;
            data.friends = 0;
            data = "["+JSON.stringify(data)+"]";
            console.log(data);
            $.ajax({
                type: "POST",
                url: url,
                data: data,
                success: function(resp) {
                    API.chatLog(resp);
                },
                dataType: 'json'
            });
            bot.writhemStatsTimer = setInterval(function() {bot.writhemStats();},30*1000);
        }
        bot.writhemStats();

    }

    //Change the bots default settings and make sure they are loaded on launch

    localStorage.setItem("basicBotsettings", JSON.stringify({
        botName: "WritheM Bot",
        language: "english",
        startupCap: 1, // 1-200
        startupVolume: 0, // 0-100
        startupEmoji: false, // true or false
        cmdDeletion: false,
        chatLink: "https://rawgit.com/" + fork + "/WritheM-plugdj-Bot/master/lang/en.json",
        maximumAfk: 1440,
        afkRemoval: false,
        maximumDc: 60,
        bouncerPlus: true,
        blacklistEnabled: true,
        lockdownEnabled: false,
        lockGuard: false,
        maximumLocktime: 10,
        cycleGuard: true,
        maximumCycletime: 10,
        voteSkip: true,
        voteSkipLimit: 10,
        timeGuard: true,
        maximumSongLength: 16,
        autodisable: true,
        commandCooldown: 120,
        usercommandsEnabled: true,
        lockskipPosition: 3,
        lockskipReasons: [
            ["theme", "This song does not fit the room theme. Check http://wiki.writhem.com/display/radio/Our+Music+Choices for more information."],
            ["op", "This song is on the OP list. "],
            ["history", "This song is in the history. "],
            ["mix", "You played a mix, which is against the rules. "],
            ["sound", "The song you played had bad sound quality or no sound. "],
            ["nsfw", "The song you contained was NSFW (image or sound). "],
            ["broken", "The song you played was not available for some users. "]
        ],
        afkpositionCheck: 5,
        afkRankCheck: "ambassador",
        motdEnabled: false,
        motdInterval: 5,
        motd: "Temporary Message of the Day",
        filterChat: true,
        etaRestriction: false,
        welcome: true,
        opLink: null,
        rulesLink: null,
        themeLink: "http://wiki.writhem.com/display/radio/Our+Music+Choices",
        fbLink: "http://facebook.com/writhem",
        youtubeLink: null,
        website: "http://radio.writhem.com/",
        intervalMessages: ["Thanks for migrating to the new platform with us! Welcome to WritheM Radio 3.0 Our 3rd host in 4 years."],
        messageInterval: 10,
        songstats: false,
        commandLiteral: "!",
        blacklists: {
            NSFW: "https://rawgit.com/" + fork + "/WritheM-plugdj-Bot/master/blacklists/NSFWlist.json",
            OP: "https://rawgit.com/" + fork + "/WritheM-plugdj-Bot/master/blacklists/OPlist.json",
            troll: "https://rawgit.com/" + fork + "/WritheM-plugdj-Bot/master/blacklists/Trolllist.json"
        }
    }));

    //Start the bot and extend it when it has loaded.
    $.getScript("https://rawgit.com/Yemasthui/basicBot/master/basicBot.js", extend);

}).call(this);
