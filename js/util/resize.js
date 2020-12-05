export default function makeResizable(element, leftResize, rightResize) {
    let originalWidth = 0;
    let elementX = 0;
    let mouseX = 0;
    leftResize.addEventListener('mousedown', e => startResize(e, resizeLeft));
    rightResize.addEventListener('mousedown', e => startResize(e, resizeRight))

    function startResize(e, resizeFunction) {
        e.preventDefault()
        originalWidth = element.offsetWidth;
        elementX = element.offsetLeft - element.parentNode.offsetLeft
        mouseX = e.pageX;
        window.addEventListener('mousemove', resizeFunction)
        window.addEventListener('mouseup', () => window.removeEventListener('mousemove', resizeFunction))
    }

    function resizeLeft(e) {
        const newX = elementX + (e.pageX - mouseX);
        if (newX >= 0) {
            const width = originalWidth - (e.pageX - mouseX)
            const previous = element.offsetWidth;
            element.style.width = width + 'px'
            if (previous !== element.offsetWidth) {
                element.style.left = newX + 'px'
            }
        } else {
            element.style.left = '0px'
        }
    }

    function resizeRight(e) {
        const width = originalWidth + (e.pageX - mouseX);
        element.style.width = width + 'px'
    }
}

