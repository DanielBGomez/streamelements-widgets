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