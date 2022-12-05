// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler, MessageFactory } = require('botbuilder');

class EchoBot extends ActivityHandler {
    // activity handler will help u to assign handlers for multiple events.
    constructor() {
        super();
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        this.onMessage(async (context, next) => {
            const replyText = `Echo: ${ context.activity.text }`;
            //console.log(context) 
            //context object contains the entire details regarding 
            // whenever there is commn b/w the bot and the channel use await as it is async ops
            await context.sendActivity(replyText);
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
        this.onMessage(async (context, next) => {
            const replyText = `Echo: ${ context.activity.text } 2nd echo`;
            //console.log(context) 
            //context object contains the entire details regarding 
            // whenever there is commn b/w the bot and the channel use await as it is async ops
            await context.sendActivity(replyText);
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
        // multiple same event  listeners can be registered, they will run in order in which they are registered.


        this.onMembersAdded(async (context, next) => {
            // this function is executed when the bot is initialzed
           
            const membersAdded = context.activity.membersAdded;// list of members added.
            // console.log(membersAdded)
            // Two users are added to the chat bot and the user. id and name
            const welcomeText = 'Hello and welcome To ariya Suhas Garla!';
            for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await context.sendActivity(MessageFactory.text(welcomeText, welcomeText));
                }
            }
            // so your sending hello messages to all users other than the bot.
            // recipient.id are users id

            // By calling next() you ensure that the next BotHandler is run.
            await next();// this is the middleware.
        });
    }
}

module.exports.EchoBot = EchoBot;
