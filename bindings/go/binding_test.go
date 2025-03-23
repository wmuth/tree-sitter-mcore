package tree_sitter_mcore_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_mcore "github.com/wmuth/tree-sitter-mcore/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_mcore.Language())
	if language == nil {
		t.Errorf("Error loading Mcore grammar")
	}
}
