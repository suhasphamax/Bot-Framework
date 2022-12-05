// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler, MessageFactory } = require('botbuilder');

class Dialogbot extends ActivityHandler {
   /**
     *
     * @param {ConversationState} conversationState
     * @param {UserState} userState
     * @param {Dialog} dialog
     */
    constructor(conversationState, userState, dialog) {
        super();
        if (!conversationState) throw new Error('[DialogBot]: Missing parameter. conversationState is required');
        if (!userState) throw new Error('[DialogBot]: Missing parameter. userState is required');
        if (!dialog) throw new Error('[DialogBot]: Missing parameter. dialog is required');

        this.conversationState = conversationState;
        this.userState = userState;
        this.dialog = dialog;// user profile dialog
        this.dialogState = this.conversationState.createProperty('DialogState');// ?
        //console.log(this.dialogState)

        this.onMessage(async (context, next) => {
           

            // Run the Dialog with the new message Activity.
            // this.dialog state is a accessor we are passing to the dialog
            await this.dialog.run(context, this.dialogState);
            // at first run ur passing memory object.
            // turn context,accessor

            await next();
        });
    }

    /**
     * Override the ActivityHandler.run() method to save state changes after the bot logic completes.
     */
    async run(context) {
        await super.run(context);

        // Save any state changes. The load happened during the execution of the Dialog.
        await this.conversationState.saveChanges(context, false);
        // saves the values of this.dialogState

        await this.userState.saveChanges(context, false);
    }
        
}

module.exports.DialogBot = Dialogbot;
