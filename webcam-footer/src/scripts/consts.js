// Configurations
module.exports = {
    DEFAULT_INTERVAL: (parseInt("{{DEFAULT_INTERVAL}}") || 3) * 1000,
    RECENT_INTERVAL: (parseInt("{{RECENT_INTERVAL}}") || 3) * 1000,
    TOP_INTERVAL: (parseInt("{{TOP_INTERVAL}}") || 4) * 1000,

    ELEMENTS_LIMIT: parseInt("{{ELEMENTS_LIMIT}}") || 10,
    
    AVAILABLE_VISUAL_TYPES: ['bits', 'sub-gifter', 'sub', 'follow', 'donation', 'stars']
}