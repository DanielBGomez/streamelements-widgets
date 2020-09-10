// Configs
const DEFAULT_INTERVAL = 3000
const RECENT_INTERVAL = 3000
const TOP_INTERVAL = 4000

// Main element
const main = document.getElementById("webcam-footer")

const activityWrappers = main.querySelectorAll(".activity-wrapper")

// Recent wrapper
const recentWrapper = main.querySelector(".activity-wrapper.recent-elements")
const topWrapper = main.querySelector(".activity-wrapper.top-elements")

// 
initWrapperAnimations(recentWrapper, { interval: RECENT_INTERVAL })
initWrapperAnimations(topWrapper, { interval: TOP_INTERVAL })



// const someElement = topWrapper.querySelectorAll('.activity--element')[0]
// elementCounter({
//         initialValue: 0,
//         finalValue: 100,
//         time: 1000
//     },
//     value => {
//         someElement.querySelector(".value").innerText = value
//     })

/**
 * 
 * @param {*} wrapper 
 * @param {*} params 
 * 
 * @todo calcular cambio en elementos
 */
function initWrapperAnimations(wrapper, params = {}){
    const elements = wrapper.querySelectorAll(".activity--element")

    // Play animation only if there's more than 1 element
    if(elements.length > 1) {
        let activeElement = 0

        setInterval(() => {
            activeElement++
            // Reset to 0 if already reached the end of elements
            if(activeElement > elements.length - 1) activeElement = 0

            moveElementsWrapper(wrapper, activeElement)

        }, params.interval || DEFAULT_INTERVAL)
    } 
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