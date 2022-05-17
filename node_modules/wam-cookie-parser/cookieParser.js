const cookieParser = (list = []) => {
    const cookies = list.map((item) => {
        const elems = item.split('=')
        const key = elems[0] ?? ''
        const value = elems[1] ?? ''
        return { key, value }
    })
    return cookies
}

module.exports = cookieParser