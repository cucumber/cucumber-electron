// Using '..' is important in order to verify types
import { AppElements } from ".."
import assert from "assert"

describe('types', () => {
  describe('AppElements', () => {
    it('can be used as a type', () => {
      function assertAppElements(appElements: AppElements) {
        assert(appElements)
      }
      const appElements = new AppElements()
      assertAppElements(appElements)
    })
  })
})
