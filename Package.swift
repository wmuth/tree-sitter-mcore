// swift-tools-version:5.3
import PackageDescription

let package = Package(
    name: "TreeSitterMcore",
    products: [
        .library(name: "TreeSitterMcore", targets: ["TreeSitterMcore"]),
    ],
    dependencies: [
        .package(url: "https://github.com/ChimeHQ/SwiftTreeSitter", from: "0.8.0"),
    ],
    targets: [
        .target(
            name: "TreeSitterMcore",
            dependencies: [],
            path: ".",
            sources: [
                "src/parser.c",
                "src/scanner.c",
            ],
            resources: [
                .copy("queries")
            ],
            publicHeadersPath: "bindings/swift",
            cSettings: [.headerSearchPath("src")]
        ),
        .testTarget(
            name: "TreeSitterMcoreTests",
            dependencies: [
                "SwiftTreeSitter",
                "TreeSitterMcore",
            ],
            path: "bindings/swift/TreeSitterMcoreTests"
        )
    ],
    cLanguageStandard: .c11
)
