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