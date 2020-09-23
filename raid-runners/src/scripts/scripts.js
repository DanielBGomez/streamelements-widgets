// Assets
const ASSETS = require('./assets')

// Animation
const MOVE_ANIMATION = [
    { // from
        right: '100%'
    },
    {
        right: '-10%'
    }
]

// Elements length
const ELEMENTS_COUNT = ASSETS.length

// Setup listener
window.addEventListener('onEventReceived', event => {
    // Deconstruct event
    const data = event.detail.event
    // Set count
    let count = Array.isArray(data.items) ? items.length : data.amount

    // Fitler by raid and host
    const eventType = event.detail.listener
    if(eventType == 'raid-latest') {
        // Start interval
        const interval = setInterval(() => {
            const Index = parseInt(Math.random() * ELEMENTS_COUNT)
            // Check count
            printElement(ASSETS[Index])
            // Rest count
            count--
            // Finished
            if(!count) clearInterval(interval)
        }, 100)
    }
})


function printElement({ img, duration = 5000 }){
    // Create HTML element
    const test = document.createElement('div')
    // Setup class and image
    test.className = "asset"
    test.style.backgroundImage = `url('${img}')`

    const Z = parseInt( Math.random() * 4 )

    // Define Z index
    test.style.zIndex = Z
    test.style.bottom = Z == 0 ? "60px" : ( Z == 1 ? "40px" : ( Z == 2 ? "20px" : 0) )

    // Animate
    const animation = test.animate(MOVE_ANIMATION, { duration: duration * ( 1.20 - Math.random() / 2.5 ) })

    // Remove element on finish
    animation.onfinish = test.remove()

    // Append to body
    document.body.append(test)
}