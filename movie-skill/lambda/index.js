/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
const axios = require('axios');

// LaunchRequest Handler
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = "Welcome! You can ask 'Give me information about [movie name]' or 'What movies are playing now'";
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};


// search movies

const SearchMovieIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'SearchMovieIntent';
    },
    async handle(handlerInput) {
        let intent = handlerInput.requestEnvelope.request.intent;
        let movieName = intent.slots.m_name.value; 

        
        let result = await searchMovie(movieName);
        
       
        let speakOutput;
        if (result) {
            let movie = result.results[0];  
             movie.title= movie.title.replace(/&/g, 'and')
            speakOutput = `Here's information about ${movie.title}. It was released on ${movie.release_date}. Here's a brief overview: ${movie.overview}`;
        } else {
            speakOutput = `Sorry, I couldn't find any information about the movie ${movieName}.`;
        }
       
        return handlerInput.responseBuilder
                .speak(speakOutput)
                .getResponse();
    }
};


async function searchMovie(name) {
    try {
        const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
            params: {
                api_key: '2a9d7e5be4e68bb7bf68397d5326c218',
                query: name
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null; 
    }
}

//nowplaying

const NowPlayingIntentHandler={
     canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'NowPlayingIntent';
    },
    
   async handle(handlerInput) {
        let intent = handlerInput.requestEnvelope.request.intent;
     

       
        let result = await nowplaying();
        
        
        let speakOutput;
        if (result) {
             speakOutput = `Here is a list of movies playing right now`;
            for (let i = 0; i < 5; i++){
                let playing = result.results[i];
                playing.original_title=playing.original_title.replace(/&/g, 'and')
                speakOutput += `, ${playing.original_title}\n`;
            }
            
        } else {
            speakOutput = `Sorry, I couldn't find any information about the movies playing in cinema`;
        }
       
        return handlerInput.responseBuilder
                .speak(speakOutput)
                .getResponse();
    }

};

async function nowplaying() {
    try {
        const response = await axios.get('https://api.themoviedb.org/3/movie/now_playing', {
            params: {
                api_key: '2a9d7e5be4e68bb7bf68397d5326c218'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null; 
    }
}

//popularmovies

const PopularMovieIntentHandler={
     canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'PopularMovieIntent';
    },
    
   async handle(handlerInput) {
        let intent = handlerInput.requestEnvelope.request.intent;
     

        
        let result = await popularmovie();
        
     
        let speakOutput;
        
        if (result) {
             speakOutput = `Here is a list of movies trending right now`;
            for (let i = 0; i < 5; i++){
                let popular = result.results[i];
                popular.original_title= popular.original_title.replace(/&/g, 'and')
                speakOutput += `, ${popular.original_title}\n`;
            }
            
        }else {
            speakOutput = `Sorry, I couldn't find any information about the popular movies right now.`;
        }
       
        return handlerInput.responseBuilder
                .speak(speakOutput)
                .getResponse();
    }

};

async function popularmovie() {
    try {
        const response = await axios.get('https://api.themoviedb.org/3/movie/popular', {
            params: {
                api_key: '2a9d7e5be4e68bb7bf68397d5326c218'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null; 
    }
}

//upcomingmovies

const UpcomingIntentHandler={
     canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'UpcomingIntent';
    },
    
   async handle(handlerInput) {
        let intent = handlerInput.requestEnvelope.request.intent;
     

        
        let result = await upcomingmovie();
        
        
        let speakOutput;
        
        if (result) {
             speakOutput = `Here is a list of 5 movies releasin soon`;
            for (let i = 0; i < 5; i++){
                let upcoming = result.results[i];
                upcoming.original_title= upcoming.original_title.replace(/&/g, 'and')
                speakOutput += `, ${upcoming.original_title} releasing on ${upcoming.release_date}\n`;
            }
            
        }else {
            speakOutput = `Sorry, I couldn't find any information about the popular movies right now.`;
        }
       
        return handlerInput.responseBuilder
                .speak(speakOutput)
                .getResponse();
    }

};

//movieratings

const MovieRatingIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'MovieRatingIntent';
    },
    async handle(handlerInput) {
        let intent = handlerInput.requestEnvelope.request.intent;
        let movieName = intent.slots.m_name.value; 

       
        let result = await MovieRating(movieName);
        
       
        let speakOutput;
        if (result) {
            const movie = result.results[0]; 
            
            speakOutput = `The movie ${movieName} is rated ${movie.vote_average}`;
        } else {
            speakOutput = `Sorry, I couldn't find any information about the movie ${movieName}.`;
        }
       
        return handlerInput.responseBuilder
                .speak(speakOutput)
                .getResponse();
    }
};

//movie release search

const MovieReleaseIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'MovieReleaseIntent';
    },
    async handle(handlerInput) {
        let intent = handlerInput.requestEnvelope.request.intent;
        let date1 = intent.slots.releasefrom.value; 
        let date2 = intent.slots.releaseto.value;
        
       
        let result = await ReleaseMovie(date1,date2);
        
       
        let speakOutput;
        
        if (result) {
             speakOutput = `Here is a list of movies released between ${date1} and ${date2}`;
            for (let i = 0; i < 5; i++){
                let releasebw = result.results[i];
                releasebw.original_title= releasebw.original_title.replace(/&/g, 'and')
                speakOutput += `, ${releasebw.original_title}\n`;
            }
            
        }else {
            speakOutput = `Sorry, I couldn't find any information about the movies released between ${date1} and ${date2}.`;
        }
       
        return handlerInput.responseBuilder
                .speak(speakOutput)
                .getResponse();
    }
};


async function ReleaseMovie(date1,date2) {
    try {
        const response = await axios.get('https://api.themoviedb.org/3/discover/movie', {
            params: {
                api_key: '2a9d7e5be4e68bb7bf68397d5326c218',
                'release_date.gte': date1,
                'release_date.lte': date2,
                
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;  
    }
}


async function MovieRating(name) {
    try {
        const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
            params: {
                api_key: '2a9d7e5be4e68bb7bf68397d5326c218',
                query: name
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;  
    }
}

async function upcomingmovie() {
    try {
        const response = await axios.get('https://api.themoviedb.org/3/movie/upcoming', {
            params: {
                api_key: '2a9d7e5be4e68bb7bf68397d5326c218'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;  
    }
}


// HelpIntent Handler
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can ask me for movie information by saying, "Give me information about [movie name]"';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// Cancel and Stop Intent Handlers
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

// FallbackIntent Handler
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = "Sorry, I don't know about that. Please try again.";

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// SessionEndedRequest Handler
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        return handlerInput.responseBuilder.getResponse(); // Empty response
    }
};

// Intent Reflector Handler (for debugging)
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

// Generic Error Handler
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// Lambda function entry point
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        SearchMovieIntentHandler,
        NowPlayingIntentHandler,
        PopularMovieIntentHandler,
        MovieReleaseIntentHandler,
        UpcomingIntentHandler,
        MovieRatingIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();

