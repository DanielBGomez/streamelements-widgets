(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// Modules
const { createActivityElement } = require('./visuals')

/**
 * 
 * @param {object} obj  Event
 */
function alertHandler(data = {}, wrapperZ){
    // Deconstruct event
    const { name, amount, count, message, gifted, sender, bulkGifted, isCommunityGift, playedAsCommunityGift } = data
    // Switch
    switch(obj.detail.listener){
        case 'follower-latest':
            createActivityElement({
                type: 'follow',
                label: name,
                wrapper
            })
            break
        case 'subscriber-latest':
            createActivityElement({
                type: sender ? 'sub-gifter' : 'sub',
                label: sender ? sender : name,
                value: sender ? count : amount,
                wrapper,
                update: true
            })
            break
        case 'cheer-latest':
            createActivityElement({
                type: 'bits',
                label: name,
                value: amount,
                wrapper
            })
            break
        case 'tip-latest':
            createActivityElement({
                type: 'donation',
                label: name,
                value: amount,
                wrapper
            })
            break
        case 'raid-latest':
        case 'message':
        case 'delete-message':
        case 'delete-messages':
        case 'event:skip':
        case 'bot:counter':
        case 'host-latest':
        default:
            // Do nothing
    }
}

// Exports
module.exports.alertHandler = alertHandler
},{"./visuals":4}],2:[function(require,module,exports){
// Configurations
module.exports = {
    DEFAULT_INTERVAL: 3000,
    RECENT_INTERVAL: 3000,
    TOP_INTERVAL: 4000,

    ELEMENTS_LIMIT: 10,
    
    AVAILABLE_VISUAL_TYPES: ['bits', 'sub-gifter', 'sub', 'follow', 'donation', 'stars']
}
},{}],3:[function(require,module,exports){
/**
 * Configs
 */
const { RECENT_INTERVAL, TOP_INTERVAL, ELEMENTS_LIMIT } = require('./consts')

/**
 * Modules
 */
const { alertHandler } = require('./alerts')
const { initWrapperAnimations, createActivityElement } = require('./visuals')

/**
 * Elements
 */ 
const main = document.getElementById("webcam-footer")

// Wrappers
const recentWrapper = main.querySelector(".activity-wrapper.recent-elements")
const topWrapper = main.querySelector(".activity-wrapper.top-elements")

/**
 * Session / Initialization
 */
window.addEventListener('onWidgetLoad', obj => sessionDataParser(obj.detail, { recent: recentWrapper, top: topWrapper }))
window.addEventListener('onSessionUpdate', obj => sessionDataParser(obj.detail, { recent: recentWrapper, top: topWrapper }))

// Init wrapper elements
initWrapperAnimations(recentWrapper, { interval: RECENT_INTERVAL })
initWrapperAnimations(topWrapper, { interval: TOP_INTERVAL })

/**
 * Alerts
 */
// Setup alerts listener
window.addEventListener('onEventReceived', event => alertHandler(event.detail.event, recentWrapper))


function sessionDataParser(detailsObj, wrappers){
    // const data = obj["detail"]["session"]["data"];
    // const recents = obj["detail"]["recents"];
    // const currency = obj["detail"]["currency"];
    // const channelName = obj["detail"]["channel"]["username"];
    // const apiToken = obj["detail"]["channel"]["apiToken"];
    // const fieldData = obj["detail"]["fieldData"];

    /**
     * RECENTS
     */
    const RECENT_EVENTS = detailsObj.recents.filter(event => !["host", "raid"].includes(event.type))
        .sort((a, b) => {
            if (a.createdAt > b.createdAt) return -1;
            if (a.createdAt < b.createdAt) return 1;
            // a must be equal to b
            return 0;
        })
        .slice(0, ELEMENTS_LIMIT)
        .reverse()

    console.log(RECENT_EVENTS)

    // Iterate recent events
    RECENT_EVENTS.forEach(event => {
        let elementData;

        // Follow
        switch(event.type){
            case 'follower':
                elementData = {
                    type: "follow",
                    label: event.name
                }
                break
            case 'subscriber':
                elementData = {
                    type: event.sender ? 'sub-gifter' : 'sub',
                    label: event.sender ? event.sender : event.name,
                    value: event.sender ? event.count : event.amount
                }
                break
            case 'cheer':
                elementData = {
                    type: 'bits',
                    label: event.name,
                    value: event.amount
                }
                break
            case 'tip':
                elementData = {
                    type: 'donation',
                    label: event.name,
                    value: event.amount
                }
                break
            default:
                // console.log(event)

        }
        // Ignore if element data does not exists
        if(!elementData) return;

        // Set common values
        // elementData.update = true
        elementData.wrapper = wrappers.recent

        // Create element
        createActivityElement( elementData )
    })

    /**
     * TOPS
     */
    if(detailsObj.session.data["cheer-alltime-top-donator"])
        createActivityElement({
            type: 'bits',
            label: detailsObj.session.data["cheer-alltime-top-donator"].name,
            value: detailsObj.session.data["cheer-alltime-top-donator"].amount,
            wrapper: wrappers.top,
            update: true
        })
    if(detailsObj.session.data["subscriber-alltime-gifter"])
        createActivityElement({
            type: 'sub-gifter',
            label: detailsObj.session.data["subscriber-alltime-gifter"].name,
            value: detailsObj.session.data["subscriber-alltime-gifter"].amount,
            wrapper: wrappers.top,
            update: true
        })
}
},{"./alerts":1,"./consts":2,"./visuals":4}],4:[function(require,module,exports){
const { AVAILABLE_VISUAL_TYPES, DEFAULT_INTERVAL, ELEMENTS_LIMIT } = require('./consts')

/**
 * 
 * @param {object} params 
 */
function createActivityElement(params = {}){
    const { type, label = "Anon", value, wrapper, limit = ELEMENTS_LIMIT || 10, update } = params
    
    // Ignore if type is not available
    if( !AVAILABLE_VISUAL_TYPES.includes(type) ) return console.log(type);

    const ACTIVITY_ELEMENT_HTML = `<div class="activity--element" data-key="${type}:${label}">
                                        <div class="label">${label}</div>
                                        <div class="value ${type}">${value ? value : ''}</div>
                                    </div>`
    
    // Has wrapper?
    if(wrapper){
        /**
         * @todo update element if exists
         * @todo ??
         */

        if(limit) {
            // Get current elements
            const elements = wrapper.querySelectorAll(".activity--element")
            // Reached limit?
            if(elements.length >= limit){
                // Delete 
                Array.from(elements).slice(limit - 1).forEach(element => element.remove())
            }
        }
        // Update?
        if(update){
            // Already exists?
            const element = wrapper.querySelector(`.activity--element[data-key='${type}:${label}']`)
            /**
             * @todo animate sum
             * @todo delete or update
             */
            if(element) {

                // console.log(element)
                // Delete or update
                element.remove()
            }
        }
        // Prepend element
        wrapper.innerHTML = ACTIVITY_ELEMENT_HTML + wrapper.innerHTML 
    }

    // Return HTML
    return ACTIVITY_ELEMENT_HTML
}

/**
 * 
 * @param {*} wrapper 
 * @param {*} params 
 * 
 * @todo calcular cambio en elementos
 */
function initWrapperAnimations(wrapper, params = {}){
    // Control var
    let activeElement = 0

    return setInterval(() => {
        // Get elements
        const elements = wrapper.querySelectorAll(".activity--element")

        // Play animation only if there's more than 1 element
        if(elements.length > 1) {

            activeElement++
            // Reset to 0 if already reached the end of elements
            if(activeElement > elements.length - 1) activeElement = 0

            moveElementsWrapper(wrapper, activeElement)
        }
    }, params.interval || DEFAULT_INTERVAL)
}

/**
 * 
 * @param {*} wrapper 
 * @param {*} multiplier 
 */
function moveElementsWrapper(wrapper, multiplier = 0){
    wrapper.style.transform = `translateY(-${100 * multiplier}%)`
}

/**
 * 
 * @param {*} params 
 * @param {*} callback 
 */
function elementCounter(params = {}, callback = e => e) {
    const { initialValue = 0, finalValue = 1, time = 5000 } = params
    // Final element length
    const finalLength = `${finalValue}`.length

    let actualValue = initialValue
    // Amount to sum each interval
    const sum = (finalValue - initialValue) / (time / 20)
    // Loop
    const interval = setInterval(() => {
        // Sum
        actualValue = sum + actualValue
        // Callback -- 
        callback( `${ parseInt(actualValue) }`.padStart(finalLength, 0) )
    }, 20)

    setTimeout(() => {
        // Stop interval
        clearInterval(interval)
        // Send final value
        callback( finalValue )
    }, time)
}

/**
 * Exports
 */
module.exports = {
    createActivityElement,
    initWrapperAnimations,
    moveElementsWrapper,
    elementCounter
}
},{"./consts":2}]},{},[3]);
