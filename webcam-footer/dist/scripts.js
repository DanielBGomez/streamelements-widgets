// Configs
const DEFAULT_INTERVAL = 3000
const RECENT_INTERVAL = 3000
const TOP_INTERVAL = 4000

const AVAILABLE_VISUAL_TYPES = ['bits', 'sub-gifter', 'sub', 'follow', 'donation', 'stars']

// Main element
const main = document.getElementById("webcam-footer")

const activityWrappers = main.querySelectorAll(".activity-wrapper")

// Recent wrapper
const recentWrapper = main.querySelector(".activity-wrapper.recent-elements")
const topWrapper = main.querySelector(".activity-wrapper.top-elements")

// 
initWrapperAnimations(recentWrapper, { interval: RECENT_INTERVAL })
initWrapperAnimations(topWrapper, { interval: TOP_INTERVAL })


window.addEventListener('onEventReceived', alertHandler)

function alertHandler(obj){
    // Deconstruct event
    const { name, amount, count, message, gifted, sender, bulkGifted, isCommunityGift, playedAsCommunityGift } = (obj.detail.event || {})
    // Switch
    switch(obj.detail.listener){
        case 'follower-latest':
            createActivityElement({
                type: 'follow',
                label: name,
                wrapper: recentWrapper
            })
            break
        case 'subscriber-latest':
            createActivityElement({
                type: sender ? 'sub-gifter' : 'sub',
                label: sender ? sender : name,
                value: sender ? count : amount,
                wrapper: recentWrapper,
                update: true
            })
            break
        case 'cheer-latest':
            createActivityElement({
                type: 'bits',
                label: name,
                value: amount,
                wrapper: recentWrapper
            })
            break
        case 'tip-latest':
            createActivityElement({
                type: 'donation',
                label: name,
                value: amount,
                wrapper: recentWrapper
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


window.addEventListener('onWidgetLoad', obj => sessionDataParser(obj["detail"]["session"]["data"]))
window.addEventListener('onSessionUpdate', obj => sessionDataParser(obj.detail.session))

function sessionDataParser(data){
    // const data = obj["detail"]["session"]["data"];
    // const recents = obj["detail"]["recents"];
    // const currency = obj["detail"]["currency"];
    // const channelName = obj["detail"]["channel"]["username"];
    // const apiToken = obj["detail"]["channel"]["apiToken"];
    // const fieldData = obj["detail"]["fieldData"];

    /**
     * TOPS
     */
    if(data["cheer-alltime-top-donator"])
        createActivityElement({
            type: 'bits',
            label: data["cheer-alltime-top-donator"].name,
            value: data["cheer-alltime-top-donator"].amount,
            wrapper: topWrapper,
            update: true
        })
    if(data["subscriber-alltime-gifter"])
        createActivityElement({
            type: 'sub-gifter',
            label: data["subscriber-alltime-gifter"].name,
            value: data["subscriber-alltime-gifter"].amount,
            wrapper: topWrapper,
            update: true
        })
}

function createActivityElement(params = {}){
    const { type, label = "Anon", value, wrapper, limit = 10, update } = params
    
    // Ignore if type is not available
    if( !AVAILABLE_VISUAL_TYPES.includes(type) ) return;

    const ACTIVITY_ELEMENT_HTML = `<div class="activity--element" data-key="${label}">
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
            const element = wrapper.querySelector(`.activity--element[data-key='${label}']`)
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

function moveElementsWrapper(wrapper, multiplier = 0){
    wrapper.style.transform = `translateY(-${100 * multiplier}%)`
}

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