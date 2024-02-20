export const checkUnsupportedBrowser = async () => !!((navigator.brave && await navigator.brave.isBrave()) || false);
