const expect = require("chai").expect
const cookieParser = require("../cookieParser")

const fakeCookieList = [
    "fizz=1",
    "buzz=2"
]

describe("Cookie Parser", function() {
    it("Get Cookies From Unformatted List", function () {
        const cookies = cookieParser(fakeCookieList)
        expect(cookies[0].key).to.equal('fizz')
        expect(cookies[0].value).to.equal('1')
        expect(cookies[1].key).to.equal('buzz')
        expect(cookies[1].value).to.equal('2')
    })
})
