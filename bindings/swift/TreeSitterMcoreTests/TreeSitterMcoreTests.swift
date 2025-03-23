import XCTest
import SwiftTreeSitter
import TreeSitterMcore

final class TreeSitterMcoreTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_mcore())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Mcore grammar")
    }
}
