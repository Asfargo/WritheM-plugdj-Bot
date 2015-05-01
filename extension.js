(function () {
    //Link location of your fork so you don't have to modify so many things.
    var fork = "pironic";
		
    //Define our function responsible for extending the bot.
    function extend() {
        //If the bot hasn't been loaded properly, try again in 1 second(s).
        if (!window.bot) {
            return setTimeout(extend, 1 * 1000);
        }

        //Precaution to make sure it is assigned properly.
        var bot = window.bot;

        //Load custom settings set below
        bot.retrieveSettings();

        /*
         Extend the bot here, either by calling another function or here directly.
         Model code for a bot command:

         bot.commands.commandCommand = {
         command: 'cmd',
         rank: 'user/bouncer/mod/manager',
         type: 'startsWith/exact',
         functionality: function(chat, cmd){
         if(this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
         if( !bot.commands.executable(this.rank, chat) ) return void (0);
         else{
         //Commands functionality goes here.
         }
         }
         }

         */

        bot.commands.wolframCommand = {
            command: 'wa',  //The command to be called. With the standard command literal this would be: !bacon
            rank: 'user', //Minimum user permission to use the command
            type: 'vars', //Specify if it can accept variables or not (if so, these have to be handled yourself through the chat.message
            url: 'http://10.1.1.3:81/wolfram/?q=',
            functionality: function (chat, cmd) {
                console.log(chat);
                if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                if (!bot.commands.executable(this.rank, chat)) return void (0);
                else {
                    var msg = chat.message.substr(4);
                    console.log('hitting the wolfram api');
                    console.log(msg);
                    $.post(this.url+encodeURIComponent(msg),function( data ) {
                        API.sendChat(data);
                    });
                }
            }
        };

        //Load the chat package again to account for any changes
        bot.loadChat();

    }

    //Change the bots default settings and make sure they are loaded on launch

    localStorage.setItem("basicBotsettings", JSON.stringify({
        botName: "WritheM Bot",
        language: "english",
        startupCap: 1, // 1-200
        startupVolume: 0, // 0-100
        startupEmoji: false, // true or false
        cmdDeletion: true,
        chatLink: "https://rawgit.com/Yemasthui/basicBot/master/lang/en.json",
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
        maximumSongLength: 10,
        autodisable: true,
        commandCooldown: 30,
        usercommandsEnabled: true,
        lockskipPosition: 3,
        lockskipReasons: [
            ["theme", "This song does not fit the room theme. Check http://wiki.writhem.com/display/radio/Our+Music+Choices for more information."],
            ["op", "This song is on the OP list. "],
            ["history", "This song is in the history. "],
            ["mix", "You played a mix, which is against the rules. "],
            ["sound", "The song you played had bad sound quality or no sound. "],
            ["nsfw", "The song you contained was NSFW (image or sound). "],
            ["unavailable", "The song you played was not available for some users. "]
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
        themeLink: null,
        fbLink: null,
        youtubeLink: null,
        website: null,
        intervalMessages: [],
        messageInterval: 5,
        songstats: true,
        commandLiteral: "!",
        blacklists: {
            NSFW: "https://rawgit.com/" + fork + "/basicBot-customization/master/blacklists/ExampleNSFWlist.json",
            OP: "https://rawgit.com/" + fork + "/basicBot-customization/master/blacklists/ExampleOPlist.json"
        }
    }));

    //Start the bot and extend it when it has loaded.
    $.getScript("https://rawgit.com/Yemasthui/basicBot/master/basicBot.js", extend);

}).call(this);
