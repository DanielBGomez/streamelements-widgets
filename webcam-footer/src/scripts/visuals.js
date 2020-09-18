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