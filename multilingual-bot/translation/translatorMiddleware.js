// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityTypes } = require('botbuilder');
const { TranslationSettings } = require('./translationSettings');

const DEFAULT_LANGUAGE = TranslationSettings.englishEnglish; // assigning the default value of language.

class TranslatorMiddleware {
    /**
     * Middleware for translating text between the user and bot.
     * Uses the Microsoft Translator Text API.
     * @param {BotStatePropertyAccessor} languagePreferenceProperty Accessor for language preference property in the user state.
     * @param {string} translatorKey Microsoft Text Translation API key.
     */
    constructor(translator, languagePreferenceProperty) {
        if (!languagePreferenceProperty) {
            throw new Error('[TranslatorMiddleware]: Missing parameter. languagePreferenceProperty is required');
        }
        if (!translator) {
            throw new Error('[TranslatorMiddleware]: Missing parameter. translator is required');
        }

        this.languagePreferenceProperty = languagePreferenceProperty;
        this.translator = translator;
    }

    async onTurn(context, next) {
        if (!context) {
            throw new Error('Context is returning null');
        };

        const translate = await this.shouldTranslate(context);// to check if userlang and default are same

        if (translate) {
            await this.translateMessageActivity(context.activity, DEFAULT_LANGUAGE);
        };

        await context.onSendActivities(async (context, activities, nextSend) => {
            const userLanguage = await this.languagePreferenceProperty.get(context, DEFAULT_LANGUAGE);
            const shouldTranslate = userLanguage !== DEFAULT_LANGUAGE;
            // Translation done only when user lang is not same as default language.

            // Translate messages sent to the user to user language.
            
            if (shouldTranslate) {
                for (const activity of activities) {
                    await this.translateMessageActivity(activity, userLanguage);
                }
            }
            return await nextSend();
        });

        // By calling next() you ensure that the next Middleware is run.
        await next();
    };

    async translateMessageActivity(activity, targetLocale) {
        if (activity.type === ActivityTypes.Message) {
            activity.text = await this.translator.translate(activity.text, targetLocale);
            // target locale is 2 letter language code.
        }
    }
    // for checking translation has to be done or not?


    async shouldTranslate(context) {
        const userLanguage = await this.languagePreferenceProperty.get(context, DEFAULT_LANGUAGE);
        return userLanguage !== DEFAULT_LANGUAGE;
    };
}

module.exports.TranslatorMiddleware = TranslatorMiddleware;
